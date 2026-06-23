import { RQuery } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { admin } from '../rethinkdb';

const server_conf = admin.server_config;

export const allServerChangesQuery = (server: string) =>
admin.logs_id.orderBy({ index: r.desc('id') })
    .filter(r.row('server').eq(server))
    .changes();

export const serverLogs = (limit: number, server: string) => admin.logs_id.orderBy({index: r.desc('id')})
  .filter(r.row('server').eq(server))
  .limit(limit)
  .map((log) =>
    log.merge({
      server: server_conf.get(log('server'))('name'),
      server_id: log('server'),
    }),
  );

export const allLogChangesQuery = admin.logs_id.orderBy({ index: r.desc('id') }).changes();

export const getAllLogsQuery = (limit: number): RQuery => admin.logs_id.orderBy({index: r.desc('id')})
    .limit(limit)
    .map((log) =>
      log.merge({
        server: server_conf.get(log('server'))('name'),
        server_id: log('server'),
      }),
    );
