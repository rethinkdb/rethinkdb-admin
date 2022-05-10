import { RDatum, RSingleSelection } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import { system_db } from '../rethinkdb';

export const dbConfigQuery = r.db(system_db).table('db_config');
export const tableStatusQuery = r.db(system_db).table('table_status');

export const tableListQuery = dbConfigQuery.map((db) => ({
  name: db('name'),
  id: db('id'),
  tables: tableStatusQuery
    .orderBy((table) => table('name'))
    .filter((i: RDatum) => i('db').eq(db('name')))
    .merge((table) => ({
      shards: table('shards').count()['default'](0),
      replicas: table('shards')
        ['default']([])
        .map((shard) => shard('replicas').count())
        .sum(),
      replicas_ready: table('shards')
        ['default']([])
        .map((shard) =>
          shard('replicas')
            .filter((replica) => replica('state').eq('ready'))
            .count(),
        )
        .sum(),
      status: table('status'),
      id: table('id'),
    })),
}));

export const guaranteedQuery = (tableId: string) =>
  r.do(
    r.db(system_db).table('server_config').coerceTo('array'),
    r.db(system_db).table('table_status').get(tableId),
    r.db(system_db).table('table_config').get(tableId),
    (
      server_config: RDatum,
      table_status: RSingleSelection,
      table_config: RSingleSelection,
    ) =>
      r.branch(
        table_status.eq(null),
        null,
        table_status
          .merge({
            max_shards: 64,
            num_shards: table_config('shards').count().default(0),
            num_servers: server_config.count(),
            num_default_servers: server_config
              .filter((server) => server('tags').contains('default'))
              .count(),
            max_num_shards: r
              .expr([
                64,
                server_config
                  .filter((server) => server('tags').contains('default'))
                  .count(),
              ])
              .min(),
            num_primary_replicas: table_status('shards')
              .count((row) => row('primary_replicas').isEmpty().not())
              .default(0),
            num_replicas: table_status('shards')
              .default([])
              .map((shard) => shard('replicas').count())
              .sum(),
            num_available_replicas: table_status('shards')
              .concatMap((shard) =>
                shard('replicas').filter({ state: 'ready' }),
              )
              .count()
              .default(0),
            num_replicas_per_shard: table_config('shards')
              .default([])
              .map((shard) => shard('replicas').count())
              .max()
              .default(0),
            status: table_status('status'),
            id: table_status('id'),
            // These are updated below if the table is ready
          })
          .without('shards'),
      ),
  );
