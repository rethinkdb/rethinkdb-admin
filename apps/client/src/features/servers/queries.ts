import { RDatum, RSingleSelection, RValue } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import { admin } from '../rethinkdb';

const { table_config: tableConfig, table_status: tableStatus } = admin;

export const serverConfigQuery = admin.server_config.coerceTo('ARRAY');
const server_status = admin.server_status.coerceTo('ARRAY');
const table_status = admin.table_status.coerceTo('ARRAY');

export const getServerListQuery = serverConfigQuery.map(
  server_status,
  (sconfig: RDatum, sstatus: RDatum) => ({
    id: sconfig('id'),
    name: sconfig('name'),
    tags: sconfig('tags'),
    timeStarted: sstatus('process')('time_started'),
    hostname: sstatus('network')('hostname'),
    cacheSize: sconfig('cache_size_mb'),
    primaryCount: table_status
      .map((table) =>
        table('shards')
          ['default']([])
          .count((shard) =>
            shard('primary_replicas').contains(sconfig('name')),
          ),
      )
      .sum(),
    secondaryCount: table_status
      .map((table) =>
        table('shards')
          ['default']([])
          .count((shard) =>
            shard('replicas')('server')
              .contains(sconfig('name'))
              .and(shard('primary_replicas').contains(sconfig('name')).not()),
          ),
      )
      .sum(),
  }),
);

export const serverRespQuery = (server_name: RValue) =>
  tableConfig
    .filter((i: RDatum) =>
      i('shards')('replicas')
        .concatMap((x) => x)
        .contains(server_name),
    )
    .map((config) => ({
      db: config('db'),
      name: config('name'),
      id: config('id'),
      shards: config('shards')
        .map(
          tableStatus.get(config('id'))('shards'),
          r.range(config.count()),
          (sconfig: RValue, sstatus: RValue, shardId: RValue): RValue => ({
            shard_id: shardId.add(1),
            total_shards: config('shards').count(),
            inshard: sconfig('replicas').contains(server_name),
            currently_primary:
              sstatus('primary_replicas').contains(server_name),
            configured_primary: sconfig('primary_replica').eq(server_name),
            nonvoting: sconfig('nonvoting_replicas').contains(server_name),
          }),
        )
        .filter({ inshard: true })
        .without('inshard')
        .coerceTo('ARRAY'),
    }))
    .coerceTo('ARRAY');

export type Shard = {
  configured_primary: boolean;
  currently_primary: boolean;
  nonvoting: boolean;
  shard_id: number;
  total_shards: number;
};

export type ShardedTable = {
  db: string;
  id: string;
  name: string;
  shards: Shard[];
};

export type ExpandedServer = {
  main: {
    id: string;
    name: string;
  };
  profile: {
    cache_size: number;
    hostname: string;
    tags: string[];
    time_started: string;
    version: string;
  };
  tables: ShardedTable[];
};

export const fetchServer = (id: string) =>
  r.do(
    admin.server_config.get(id),
    admin.server_status.get(id),
    (
      server_config: RSingleSelection,
      server_status: RSingleSelection,
    ): RValue => ({
      profile: {
        version: server_status('process')('version'),
        time_started: server_status('process')('time_started'),
        hostname: server_status('network')('hostname'),
        tags: server_config('tags'),
        cache_size: server_status('process')('cache_size_mb').mul(1024 * 1024),
      },
      main: {
        name: server_status('name'),
        id: server_status('id'),
      },
      tables: serverRespQuery(server_config('name')),
    }),
  );
