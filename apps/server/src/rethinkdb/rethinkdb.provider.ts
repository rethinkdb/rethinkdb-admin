import { URL } from 'url';

import { connect, RethinkDBConnectionOptions } from 'rethinkdb-ts';
import { RethinkDBServerConnectionOptions } from 'rethinkdb-ts/lib/connection/types';

export const RethinkdbProvider = {
  provide: 'RethinkdbProvider',
  useFactory: async () => {
    const RETHINKDB_URL =
      process.env.RETHINKDB_URL || 'rethinkdb://localhost:28015';
    const rethinkdbUrl = new URL(RETHINKDB_URL);
    const connectionOptions: RethinkDBServerConnectionOptions = {};
    const options: RethinkDBConnectionOptions = { db: 'test' };
    if (rethinkdbUrl.hostname) {
      connectionOptions.host = rethinkdbUrl.hostname;
    }
    if (rethinkdbUrl.port) {
      connectionOptions.port = Number.parseInt(rethinkdbUrl.port, 10);
    }
    if (rethinkdbUrl.pathname) {
      options.db = rethinkdbUrl.pathname.substring(1);
    }
    if (rethinkdbUrl.username) {
      options.user = rethinkdbUrl.username;
    }
    if (rethinkdbUrl.password) {
      options.password = rethinkdbUrl.password;
    }
    console.log('kek');
    return connect(connectionOptions, options);
  },
};
