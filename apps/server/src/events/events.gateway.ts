import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { createRethinkdbConnection } from 'rethinkdb-kek';
import { RethinkDBConnection } from "rethinkdb-kek/lib/connection/connection";
import { TermJson } from "rethinkdb-kek/lib/internal-types";
import { ServerInfo } from "rethinkdb-kek/lib/types";

let connection: RethinkDBConnection;

async function connect() {
  connection = await createRethinkdbConnection({
    host: 'localhost'
  });
}
connect();

@WebSocketGateway({ path: '/api/socket.io' })
export class EventsGateway {
  @SubscribeMessage('events')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!' + payload;
  }

  @SubscribeMessage('query')
  async handleQuery(client: any, payload: TermJson): Promise<unknown> {
    return connection.run(payload);
  }

  @SubscribeMessage('me')
  async handleMe(): Promise<ServerInfo> {
    return connection.server();
  }
}
