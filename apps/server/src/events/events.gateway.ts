import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { createRethinkdbConnection } from 'rethinkdb-kek';
import { RethinkDBConnection } from 'rethinkdb-kek/lib/connection/connection';
import { TermJson } from 'rethinkdb-kek/lib/internal-types';
import { RConnectionOptions, ServerInfo } from 'rethinkdb-kek/lib/types';
import { URL } from 'url';

let connection: RethinkDBConnection;

const RETHINKDB_URL =
  process.env.RETHINKDB_URL || 'rethinkdb://localhost:28015';

async function connect() {
  const rethinkdbUrl = new URL(RETHINKDB_URL);
  const options: RConnectionOptions = {};
  if (rethinkdbUrl.hostname) {
    options.host = rethinkdbUrl.hostname;
  }
  if (rethinkdbUrl.port) {
    options.port = Number.parseInt(rethinkdbUrl.port, 10);
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
  connection = await createRethinkdbConnection(options);
}
connect();

@WebSocketGateway({ path: '/api/socket.io' })
export class EventsGateway {
  @SubscribeMessage('events')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!' + payload;
  }

  @SubscribeMessage('query')
  async handleQuery(client: any, payload: TermJson): Promise<[boolean, unknown]> {
    try {
      return [true, await connection.run(payload)];
    } catch (error) {
      return [false, error.message];
    }
  }

  @SubscribeMessage('me')
  async handleMe(): Promise<ServerInfo> {
    return connection.server();
  }
}
