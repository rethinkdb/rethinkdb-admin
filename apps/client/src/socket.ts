// import io from 'socket.io-client';
// TODO when socket.io v3 works
import { io } from 'socket.io-client';
import { RQuery } from 'rethinkdb-ts/lib/query-builder/query';

const socket = io({ transports: ['websocket', 'polling'] });

window.socket = socket;

socket.onAny((event) => {
  console.log(event);
  debugger;
})

socket.on('connect', () => {
  console.log(`connect ${socket.id}`);
});
socket.io.on("error", (error) => {
  debugger;
});

function request<T = unknown>(query: RQuery): Promise<T> {
  const { term } = query;
  return new Promise((resolve, reject) => {
    socket.emit('query', term, ([success, data]: [boolean, T]) => {
      debugger;
      if (success) {
        resolve(data);
        return;
      }
      reject(data);
    });
  });
}

export type MeResponse = {
  id: string;
  name: string;
  proxy: boolean;
};

function requestMe(): Promise<MeResponse> {
  return new Promise((resolve) => {
    socket.emit('me', (data: MeResponse) => {
      resolve(data);
    });
  });
}

function requestChanges<T = unknown>(
  query: RQuery,
  cb: (data: T) => void,
): Promise<() => void> {
  const { term } = query;
  return new Promise((resolve, reject) => {
    socket.emit(
      'changes',
      JSON.stringify(term),
      ([success, queryId]: [boolean, string]) => {
        if (!success) {
          reject(new Error(queryId));
        }
        const onDataCb = (data: T) => {
          cb(data);
        };
        socket.on(queryId, onDataCb);
        resolve(() => {
          socket.off(queryId, onDataCb);
          socket.emit('unsub', queryId);
        });
      },
    );
  });
}

export { socket, request, requestChanges, requestMe };
