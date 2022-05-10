import { RTable } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import { system_db } from '../rethinkdb';

const systable = (name: string) => r.db(system_db).table(name);

function query(server_status: RTable, table_config: RTable) {
  if (!server_status) {
    server_status = systable('server_status');
  }
  if (!table_config) {
    table_config = systable('table_config');
  }
  return r.do(
    // All connected servers
    server_status('name').coerceTo('array'),
    // All servers assigned to tables
    table_config
      .concatMap((row) => row('shards').default([]))
      .concatMap((row) => row('replicas'))
      .distinct(),
    (connected_servers, assigned_servers) => ({
      servers_connected: connected_servers.count(),

      servers_missing: assigned_servers.setDifference(connected_servers),

      unknown_missing: table_config
        .filter((row) => row.hasFields('shards').not())('name')
        .isEmpty()
        .not(),
    }),
  );
}
