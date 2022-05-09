import { RDatum } from 'rethinkdb-ts';
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
