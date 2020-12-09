import io from 'socket.io-client';
import { TermJson } from 'rethinkdb-kek/lib/internal-types';

const socket = io('/', { path: '/api/socket.io' });

function request(term: TermJson): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit('query', term, ([success, data]) => {
      if (success) {
        resolve(data);
        return;
      }
      reject(data);
    });
  });
}
function requestMe(): Promise<any> {
  return new Promise((resolve) => {
    socket.emit('me', (data) => {
      resolve(data);
    });
  });
}

export { socket, request, requestMe };
