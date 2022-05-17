import { io } from 'socket.io-client';

export const socket = io({ transports: ['websocket', 'polling'] });

socket.io.on('error', (error) => {
  console.error(error);
});
