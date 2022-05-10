import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { system_db } from '../rethinkdb';
import { RQuery } from 'rethinkdb-ts';
import { admin } from '../rethinkdb/app-driver';

const server_conf = admin.server_config;


export const allServerChangesQuery = (server: string) =>  r
  .db(system_db)
  .table('logs', {identifierFormat: 'uuid'})
  .orderBy({index: r.desc('id')})
  .filter(r.row('server').eq(server))
  .changes();

export function serverLogs(limit: number, server: string) {
  return r
    .db(system_db)
    .table('logs', {identifierFormat: 'uuid'})
    .orderBy({index: r.desc('id')})
    .filter(r.row('server').eq(server))
    .limit(limit)
    .map((log) =>
      log.merge({
        server: server_conf.get(log('server'))('name'),
        server_id: log('server'),
      }),
    );
}

export const allLogChangesQuery = r
  .db(system_db)
  .table('logs', { identifierFormat: 'uuid' })
  .orderBy({ index: r.desc('id') })
  .changes();

export function getAllLogsQuery(limit: number): RQuery {
  const server_conf = admin.server_config;
  return r
    .db(system_db)
    .table('logs', { identifierFormat: 'uuid' })
    .orderBy({ index: r.desc('id') })
    .limit(limit)
    .map((log) =>
      log.merge({
        server: server_conf.get(log('server'))('name'),
        server_id: log('server'),
      }),
    );
}
