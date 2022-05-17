import { RDatum, RTable, RValue } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
export * from './socket';

export const system_db = 'rethinkdb';

export const admin = {
  cluster_config: r.db(system_db).table('cluster_config'),
  cluster_config_id: r
    .db(system_db)
    .table('cluster_config', { identifierFormat: 'uuid' }),
  current_issues: r.db(system_db).table('current_issues'),
  current_issues_id: r
    .db(system_db)
    .table('current_issues', { identifierFormat: 'uuid' }),
  db_config: r.db(system_db).table('db_config'),
  db_config_id: r
    .db(system_db)
    .table('db_config', { identifierFormat: 'uuid' }),
  jobs: r.db(system_db).table('jobs'),
  jobs_id: r.db(system_db).table('jobs', { identifierFormat: 'uuid' }),
  logs: r.db(system_db).table('logs'),
  logs_id: r.db(system_db).table('logs', { identifierFormat: 'uuid' }),
  server_config: r.db(system_db).table('server_config'),
  server_config_id: r
    .db(system_db)
    .table('server_config', { identifierFormat: 'uuid' }),
  server_status: r.db(system_db).table('server_status'),
  server_status_id: r
    .db(system_db)
    .table('server_status', { identifierFormat: 'uuid' }),
  stats: r.db(system_db).table('stats'),
  stats_id: r.db(system_db).table('stats', { identifierFormat: 'uuid' }),
  table_config: r.db(system_db).table('table_config'),
  table_config_id: r
    .db(system_db)
    .table('table_config', { identifierFormat: 'uuid' }),
  table_status: r.db(system_db).table('table_status'),
  table_status_id: r
    .db(system_db)
    .table('table_status', { identifierFormat: 'uuid' }),
};

export const match = (variable: RValue, ...specs: any[]) => {
  let previous = r.error(`nothing matched ${variable}`);
  for (const [val, action] of Array.from(specs.reverse())) {
    previous = r.branch(r.expr(variable).eq(val), action, previous);
  }
  return previous;
};

export const queries = {
  server_logs: (limit: number, server_id: string) => {
    const server_conf = admin.server_config;
    return r
      .db(system_db)
      .table('logs', { identifierFormat: 'uuid' })
      .orderBy({ index: r.desc('id') })
      .filter({ server: server_id })
      .limit(limit)
      .map((log) =>
        log.merge({
          server: server_conf.get(log('server'))('name'),
          server_id: log('server'),
        }),
      );
  },

  issues_with_ids(current_issues = admin.current_issues) {
    const { current_issues_id } = admin;
    return current_issues
      .merge(function (issue) {
        const issue_id = current_issues_id.get(issue('id'));
        const log_write_error = {
          servers: issue('info')('servers').map(
            issue_id('info')('servers'),
            (server: RDatum, server_id: RDatum) => ({
              server,
              server_id,
            }),
          ),
        };
        const memory_error = {
          servers: issue('info')('servers').map(
            issue_id('info')('servers'),
            (server: RDatum, server_id: RDatum) => ({
              server,
              server_id,
            }),
          ),
        };
        const non_transitive_error = {
          servers: issue('info')('servers').map(
            issue_id('info')('servers'),
            (server: RDatum, server_id: RDatum) => ({
              server,
              server_id,
            }),
          ),
        };
        const outdated_index = {
          tables: issue('info')('tables').map(
            issue_id('info')('tables'),
            (table: RDatum, table_id: RDatum) => ({
              db: table('db'),
              db_id: table_id('db'),
              table_id: table_id('table'),
              table: table('table'),
              indexes: table('indexes'),
            }),
          ),
        };
        const table_avail = issue('info').merge({
          table_id: issue_id('info')('table'),
          shards: issue('info')('shards').default([]),
          missing_servers: issue('info')('shards')
            .default([])('replicas')
            .concatMap((x) => x)
            .filter({ state: 'disconnected' })('server')
            .distinct(),
        });
        return {
          info: match(
            issue('type'),
            ['log_write_error', log_write_error],
            ['memory_error', memory_error],
            ['non_transitive_error', non_transitive_error],
            ['outdated_index', outdated_index],
            ['table_availability', table_avail],
            [issue('type'), issue('info')], // default
          ),
        };
      })
      .coerceTo('ARRAY');
  },

  tables_with_primaries_not_ready(
    table_config_id: RTable = admin.table_config_id,
    table_status: RTable = admin.table_status,
  ) {
    return r.do(
      admin.server_config
        .map((x) => [x('id'), x('name')])
        .coerceTo('ARRAY')
        .coerceTo('OBJECT'),
      (server_names) =>
        table_status
          .map(table_config_id, (status: RDatum, config: RDatum) => ({
            id: status('id'),
            name: status('name'),
            db: status('db'),

            shards: status('shards')
              .default([])
              .map(
                r.range(),
                config('shards').default([]),
                function (shard: RDatum, pos: RDatum, conf_shard: RDatum) {
                  const primary_id = conf_shard('primary_replica');
                  const primary_name = server_names(primary_id);
                  return {
                    num_shards: status('shards').count().default(0),
                    position: pos.add(1),
                    primary_id,
                    primary_name: primary_name.default('-'),
                    primary_state: shard('replicas')
                      .filter(
                        { server: primary_name },
                        { default: r.error() },
                      )('state')(0)
                      .default('disconnected'),
                  };
                },
              )
              .filter((shard) => shard('primary_state').ne('ready'))
              .coerceTo('ARRAY'),
          }))
          .filter((table: RDatum) => table('shards').isEmpty().not())
          .coerceTo('ARRAY'),
    );
  },

  tables_with_replicas_not_ready(
    table_config_id = admin.table_config_id,
    table_status = admin.table_status,
  ) {
    return table_status
      .map(table_config_id, (status: RDatum, config: RDatum) => ({
        id: status('id'),
        name: status('name'),
        db: status('db'),

        shards: status('shards')
          .default([])
          .map(
            r.range(),
            config('shards').default([]),
            (shard: RDatum, pos: RDatum, conf_shard: RDatum) => ({
              position: pos.add(1),
              num_shards: status('shards').count().default(0),

              replicas: shard('replicas')
                .filter((replica: RDatum) =>
                  r
                    .expr([
                      'ready',
                      'looking_for_primary_replica',
                      'offloading_data',
                    ])
                    .contains(replica('state'))
                    .not(),
                )
                .map(
                  conf_shard('replicas'),
                  (replica: RDatum, replica_id: RDatum) => ({
                    replica_id,
                    replica_name: replica('server'),
                  }),
                )
                .coerceTo('ARRAY'),
            }),
          )
          .coerceTo('ARRAY'),
      }))
      .filter((table: RDatum) => table('shards')(0)('replicas').isEmpty().not())
      .coerceTo('ARRAY');
  },
  num_primaries(table_config_id = admin.table_config_id) {
    return table_config_id('shards')
      .default([])
      .map((x: RDatum) => x.count())
      .sum();
  },

  num_connected_primaries(table_status = admin.table_status) {
    return table_status
      .map((table) =>
        table('shards')
          .default([])('primary_replicas')
          .count((arr: RDatum) => arr.isEmpty().not()),
      )
      .sum();
  },

  num_replicas(table_config_id: RTable = admin.table_config_id) {
    return table_config_id('shards')
      .default([])
      .map((shards: RDatum) =>
        shards.map((shard: RDatum) => shard('replicas').count()).sum(),
      )
      .sum();
  },

  num_connected_replicas(table_status = admin.table_status) {
    return table_status('shards')
      .default([])
      .map((shards: RDatum) =>
        shards('replicas')
          .map((replica: RDatum) =>
            replica('state').count((replica: RDatum) =>
              r
                .expr(['ready', 'looking_for_primary_replica'])
                .contains(replica),
            ),
          )
          .sum(),
      )
      .sum();
  },

  disconnected_servers(server_status = admin.server_status) {
    return server_status
      .filter((server: RDatum) => server('status').ne('connected'))
      .map((server) => ({
        time_disconnected: server('connection')('time_disconnected'),
        name: server('name'),
      }))
      .coerceTo('ARRAY');
  },

  num_disconnected_tables(table_status = admin.table_status) {
    return table_status.count(function (table?: RDatum) {
      const shard_is_down = (shard: RDatum) =>
        shard('primary_replicas').isEmpty().not();
      return table('shards').default([]).map(shard_is_down).contains(true);
    });
  },

  num_tables_w_missing_replicas(table_status = admin.table_status) {
    return table_status.count((table: RDatum) =>
      table('status')('all_replicas_ready').not(),
    );
  },

  num_connected_servers(server_status?: RTable) {
    if (server_status == null) {
      ({ server_status } = admin);
    }
    return server_status.count((server: RDatum) =>
      server('status').eq('connected'),
    );
  },

  num_sindex_issues(current_issues = admin.current_issues) {
    return current_issues.count((issue: RDatum) =>
      issue('type').eq('outdated_index'),
    );
  },

  num_sindexes_constructing(jobs = admin.jobs) {
    return jobs.count((job: RDatum) => job('type').eq('index_construction'));
  },
};
