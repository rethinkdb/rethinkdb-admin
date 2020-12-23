import io from 'socket.io-client';
// TODO when socket.io v3 works
// import { io } from 'socket.io-client';
import { TermJson } from 'rethinkdb-kek/lib/internal-types';

const socket = io('/', { path: '/api/socket.io' });

socket.on('connect', () => {
  console.log(`connect ${socket.id}`);
});
function request(term: TermJson): Promise<unknown> {
  return new Promise((resolve, reject) => {
    socket.emit('query', term, ([success, data]: [boolean, unknown]) => {
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

export { socket, request, requestMe };
