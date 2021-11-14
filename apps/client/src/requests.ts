import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { request } from './socket';
import { useEffect, useState } from 'react';

export const system_db = 'rethinkdb';

async function getGuaranteedData(tableId: string) {
  return request(
    r.do(
      r.db(system_db).table('server_config').coerceTo('array'),
      r.db(system_db).table('table_status').get(tableId),
      r.db(system_db).table('table_config').get(tableId),
      (server_config, table_status, table_config) =>
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
            })
            .without('shards'),
        ),
    ),
  );
}

type GuaranteedDataResult = {
  max_shards: 64;
  num_shards: number;
  num_servers: number;
  num_default_servers: number;
  max_num_shards: number;
  num_primary_replicas: number;
  num_replicas: number;
  num_available_replicas: number;
  num_replicas_per_shard: number;
  status: any;
  id: any;
};

function useGuaranteedQuery(): null | GuaranteedDataResult {
  const [state, setState] = useState(null);
  useEffect(() => {
    getGuaranteedData('76685a4c-495f-4bf6-b21f-07407f4763da').then((data) => {
      setState(data);
    });
  }, []);
  return state;
}

export { useGuaranteedQuery };
