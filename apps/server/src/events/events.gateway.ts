import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Inject } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RethinkDBConnection, ServerInfo, TermJson } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { toQuery } from 'rethinkdb-ts/lib/query-builder/query';
import { Cursor } from 'rethinkdb-ts/lib/response/cursor';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerOptions, Socket } from 'socket.io';
import { request } from 'undici';

import { fromStream } from '../from-stream';

type LocalSocket = Socket & { changeQueries: Record<string, Cursor> };

@WebSocketGateway<Partial<ServerOptions>>({
  serveClient: false,
  path: '/socket.io/',
})
export class EventsGateway
  implements OnGatewayDisconnect<LocalSocket>, OnGatewayConnection<LocalSocket>
{
  private connection: RethinkDBConnection;

  constructor(@Inject('RethinkdbProvider') connection: RethinkDBConnection) {
    this.connection = connection;
  }

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
      const data = await this.connection.run(toQuery(payload));
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
    payload: TermJson,
  ): Promise<[boolean, unknown] | Observable<['feed' | boolean, unknown]>> {
    const queryId = nanoid();
    try {
      const cursor = await this.connection.run(toQuery(payload));
      if (cursor && !cursor.type.includes('Feed')) {
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
  async handleUnsub(client: LocalSocket, queryId: string): Promise<string> {
    const cursor = client.changeQueries[queryId];
    if (cursor) {
      await cursor.close();
      delete client.changeQueries[queryId];
      return 'ok';
    }
    return 'was closed';
  }

  @SubscribeMessage('me')
  async handleMe(): Promise<ServerInfo> {
    return this.connection.server();
  }

  @SubscribeMessage('checkUpdates')
  async checkUpdates(): Promise<unknown> {
    const serverInfo = await this.connection.server();
    const version = await this.connection.run(
      r.db('rethinkdb').table('server_status').get(serverInfo.id)('process')(
        'version',
      ),
    );
    const versionString = version.split(' ')[1].split('~')[0];
    const { body } = await request(
      `https://update.rethinkdb.com/update_for/${versionString}`,
    );
    return body.json();
  }
}
