import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  connect,
  RethinkDBConnection,
  RethinkDBConnectionOptions,
  ServerInfo,
  TermJson,
} from 'rethinkdb-ts';
import { URL } from 'url';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromStream } from '../from-stream';
import { toQuery } from 'rethinkdb-ts/lib/query-builder/query';
import { ServerOptions, Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import { Cursor } from 'rethinkdb-ts/lib/response/cursor';
import { RethinkDBServerConnectionOptions } from 'rethinkdb-ts/lib/connection/types';

let connection: RethinkDBConnection;

const RETHINKDB_URL =
  process.env.RETHINKDB_URL || 'rethinkdb://localhost:28015';

async function connectToDB() {
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
  connection = await connect(connectionOptions, options);
}
connectToDB();

type LocalSocket = Socket & { changeQueries: Record<string, Cursor> };

@WebSocketGateway<Partial<ServerOptions>>({
  serveClient: false,
  path: '/socket.io/',
})
export class EventsGateway
  implements OnGatewayDisconnect<LocalSocket>, OnGatewayConnection<LocalSocket>
{
  handleConnection(client: LocalSocket): any {
    client.changeQueries = {};
  }

  async handleDisconnect(client: LocalSocket): Promise<void> {
    Object.values(client.changeQueries).forEach((cursor) => {
      cursor.close();
    });
  }

  @SubscribeMessage('query')
  async handleQuery(
    client: LocalSocket,
    payload: TermJson,
  ): Promise<[boolean, unknown] | Observable<['feed' | boolean, unknown]>> {
    try {
      const data = await connection.run(toQuery(payload));
      if (data && data.type === 'Feed') {
        return from(fromStream(data)).pipe(
          map((data) => {
            return ['feed', data];
          }),
        );
      }
      return [true, data];
    } catch (error) {
      console.error('wtf', JSON.stringify(payload), error);
      return [false, error.message];
    }
  }

  @SubscribeMessage('changes')
  async handleChanges(
    client: LocalSocket,
    payloadString: string,
  ): Promise<[boolean, unknown] | Observable<['feed' | boolean, unknown]>> {
    const queryId = nanoid();
    const payload: TermJson = JSON.parse(payloadString) as TermJson;
    try {
      const cursor = await connection.run(toQuery(payload));
      if (cursor && cursor.type !== 'Feed') {
        return [false, 'Should be feed'];
      }
      client.changeQueries[queryId] = cursor;
      setTimeout(() => {
        cursor.on('data', (changesData: unknown) => {
          client.emit(queryId, changesData);
        });
      });
      return [true, queryId];
    } catch (error) {
      console.error(error);
      return [false, error.message];
    }
  }

  @SubscribeMessage('unsub')
  handleUnsub(client: LocalSocket, queryId: string): string {
    const cursor = client.changeQueries[queryId];
    if (cursor) {
      cursor.close();
      delete client.changeQueries[queryId];
      return 'ok';
    }
    return 'was closed';
  }

  @SubscribeMessage('me')
  async handleMe(): Promise<ServerInfo> {
    return connection.server();
  }
}
