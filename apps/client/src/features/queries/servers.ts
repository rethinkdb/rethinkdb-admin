import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { system_db } from '../../requests';
import {RDatum} from "rethinkdb-ts";

export const serverConfigQuery = r.db(system_db).table('server_config').coerceTo('array');
const server_status = r.db(system_db).table('server_status').coerceTo('array');
const table_status = r.db(system_db).table('table_status').coerceTo('array');

export const getServerListQuery = serverConfigQuery
  .map(server_status, function (sconfig: RDatum, sstatus: RDatum) {
    return {
      id: sconfig('id'),
      name: sconfig('name'),
      tags: sconfig('tags'),
      timeStarted: sstatus('process')('time_started'),
      hostname: sstatus('network')('hostname'),
      cacheSize: sconfig('cache_size_mb'),
      primaryCount: table_status
        .map(function (table) {
          return table('shards')
            ['default']([])
            .count(function (shard) {
              return shard('primary_replicas').contains(sconfig('name'));
            });
        })
        .sum(),
      secondaryCount: table_status
        .map(function (table) {
          return table('shards')
            ['default']([])
            .count(function (shard) {
              return shard('replicas')('server')
                .contains(sconfig('name'))
                .and(
                  shard('primary_replicas').contains(sconfig('name')).not(),
                );
            });
        })
        .sum(),
    };
  })
;
