import { r } from 'rethinkdb-kek/lib/query-builder/r';
import { system_db } from './requests';
import { RQuery } from "rethinkdb-kek";

const admin = {
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


const helpers = {
  // Macro to create a match/switch construct in reql by
  // nesting branches
  // Use like: match(doc('field'),
  //                 ['foo', some_reql],
  //                 [r.expr('bar'), other_reql],
  //                 [some_other_query, contingent_3_reql],
  //                 default_reql)
  // Throws an error if a match isn't found. The error can be absorbed
  // by tacking on a .default() if you want
  match(variable, ...specs) {
    let previous = r.error(`nothing matched ${variable}`);
    for (const [val, action] of Array.from(specs.reverse())) {
      previous = r.branch(r.expr(variable).eq(val), action, previous);
    }
    return previous;
  },
  identity(x) {
    return x;
  },
};

function getAllLogsQuery(limit: number): RQuery {
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


const queries = {
  server_logs: (limit, server_id) => {
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

  issues_with_ids(current_issues) {
    // we use .get on issues_id, so it must be the real table
    if (current_issues == null) {
      ({ current_issues } = admin);
    }
    const { current_issues_id } = admin;
    return current_issues
      .merge(function (issue) {
        const issue_id = current_issues_id.get(issue('id'));
        const log_write_error = {
          servers: issue('info')('servers').map(
            issue_id('info')('servers'),
            (server, server_id) => ({
              server,
              server_id,
            }),
          ),
        };
        const memory_error = {
          servers: issue('info')('servers').map(
            issue_id('info')('servers'),
            (server, server_id) => ({
              server,
              server_id,
            }),
          ),
        };
        const non_transitive_error = {
          servers: issue('info')('servers').map(
            issue_id('info')('servers'),
            (server, server_id) => ({
              server,
              server_id,
            }),
          ),
        };
        const outdated_index = {
          tables: issue('info')('tables').map(
            issue_id('info')('tables'),
            (table, table_id) => ({
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
          info: helpers.match(
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
      .coerceTo('array');
  },

  tables_with_primaries_not_ready(table_config_id, table_status) {
    if (table_config_id == null) {
      ({ table_config_id } = admin);
    }
    if (table_status == null) {
      ({ table_status } = admin);
    }
    return r.do(
      admin.server_config
        .map((x) => [x('id'), x('name')])
        .coerceTo('ARRAY')
        .coerceTo('OBJECT'),
      (server_names) =>
        table_status
          .map(table_config_id, (status, config) => ({
            id: status('id'),
            name: status('name'),
            db: status('db'),

            shards: status('shards')
              .default([])
              .map(
                r.range(),
                config('shards').default([]),
                function (shard, pos, conf_shard) {
                  const primary_id = conf_shard('primary_replica');
                  const primary_name = server_names(primary_id);
                  return {
                    position: pos.add(1),
                    num_shards: status('shards').count().default(0),
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
              .coerceTo('array'),
          }))
          .filter((table) => table('shards').isEmpty().not())
          .coerceTo('array'),
    );
  },

  tables_with_replicas_not_ready(table_config_id, table_status) {
    if (table_config_id == null) {
      ({ table_config_id } = admin);
    }
    if (table_status == null) {
      ({ table_status } = admin);
    }
    return table_status
      .map(table_config_id, (status, config) => ({
        id: status('id'),
        name: status('name'),
        db: status('db'),

        shards: status('shards')
          .default([])
          .map(
            r.range(),
            config('shards').default([]),
            (shard, pos, conf_shard) => ({
              position: pos.add(1),
              num_shards: status('shards').count().default(0),

              replicas: shard('replicas')
                .filter((replica) =>
                  r
                    .expr([
                      'ready',
                      'looking_for_primary_replica',
                      'offloading_data',
                    ])
                    .contains(replica('state'))
                    .not(),
                )
                .map(conf_shard('replicas'), (replica, replica_id) => ({
                  replica_id,
                  replica_name: replica('server'),
                }))
                .coerceTo('array'),
            }),
          )
          .coerceTo('array'),
      }))
      .filter((table) => table('shards')(0)('replicas').isEmpty().not())
      .coerceTo('array');
  },
  num_primaries(table_config_id) {
    if (table_config_id == null) {
      ({ table_config_id } = admin);
    }
    return table_config_id('shards')
      .default([])
      .map((x) => x.count())
      .sum();
  },

  num_connected_primaries(table_status) {
    if (table_status == null) {
      ({ table_status } = admin);
    }
    return table_status
      .map((table) =>
        table('shards')
          .default([])('primary_replicas')
          .count((arr) => arr.isEmpty().not()),
      )
      .sum();
  },

  num_replicas(table_config_id) {
    if (table_config_id == null) {
      ({ table_config_id } = admin);
    }
    return table_config_id('shards')
      .default([])
      .map((shards) =>
        shards.map((shard) => shard('replicas').count()).sum(),
      )
      .sum();
  },

  num_connected_replicas(table_status) {
    if (table_status == null) {
      ({ table_status } = admin);
    }
    return table_status('shards')
      .default([])
      .map((shards) =>
        shards('replicas')
          .map((replica) =>
            replica('state').count((replica) =>
              r
                .expr(['ready', 'looking_for_primary_replica'])
                .contains(replica),
            ),
          )
          .sum(),
      )
      .sum();
  },

  disconnected_servers(server_status) {
    if (server_status == null) {
      ({ server_status } = admin);
    }
    return server_status
      .filter((server) => server('status').ne('connected'))
      .map((server) => ({
        time_disconnected: server('connection')('time_disconnected'),
        name: server('name'),
      }))
      .coerceTo('array');
  },

  num_disconnected_tables(table_status) {
    if (table_status == null) {
      ({ table_status } = admin);
    }
    return table_status.count(function (table) {
      const shard_is_down = (shard) =>
        shard('primary_replicas').isEmpty().not();
      return table('shards').default([]).map(shard_is_down).contains(true);
    });
  },

  num_tables_w_missing_replicas(table_status) {
    if (table_status == null) {
      ({ table_status } = admin);
    }
    return table_status.count((table) =>
      table('status')('all_replicas_ready').not(),
    );
  },

  num_connected_servers(server_status) {
    if (server_status == null) {
      ({ server_status } = admin);
    }
    return server_status.count((server) =>
      server('status').eq('connected'),
    );
  },

  num_sindex_issues(current_issues) {
    if (current_issues == null) {
      ({ current_issues } = admin);
    }
    return current_issues.count((issue) =>
      issue('type').eq('outdated_index'),
    );
  },

  num_sindexes_constructing(jobs) {
    if (jobs == null) {
      ({ jobs } = admin);
    }
    return jobs.count((job) => job('type').eq('index_construction'));
  },
};

export { getAllLogsQuery, admin, helpers, queries };
