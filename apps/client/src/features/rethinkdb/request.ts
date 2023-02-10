import { RQuery } from 'rethinkdb-ts/lib/query-builder/query';
import { TermJson } from 'rethinkdb-ts/lib/types';

import { socket } from '../connection/socket';

export function request<Req = unknown, Res = unknown>(
  eventName: string,
  data?: Req,
): Promise<Res> {
  return new Promise((resolve) => {
    socket.emit(eventName, data, (response: Res) => {
      resolve(response);
    });
  });
}

export async function requestQuery<T = unknown>(query: RQuery): Promise<T> {
  const [success, data] = await request<TermJson, [boolean, T]>(
    'query',
    query.term,
  );
  if (success) {
    return data;
  }
  throw data;
}

export async function requestChanges<T = unknown>(
  query: RQuery,
  cb: (data: T) => void,
): Promise<() => void> {
  const { term } = query;
  const [success, queryId] = await request<TermJson, [boolean, string]>(
    'sub',
    term,
  );
  if (!success) {
    throw new Error(queryId);
  }

  const onDataCb = (data: T) => {
    cb(data);
  };

  socket.on(queryId, onDataCb);

  return () => {
    socket.off(queryId, onDataCb);
    socket.emit('unsub', queryId);
  };
}
