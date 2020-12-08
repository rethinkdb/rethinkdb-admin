import io from 'socket.io-client';
import { TermJson } from 'rethinkdb-kek/lib/internal-types';

const socket = io('/', { path: '/api/socket.io' });

function request(term: TermJson): Promise<any> {
  return new Promise((resolve) => {
    socket.emit('query', term, (data) => {
      resolve(data);
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
