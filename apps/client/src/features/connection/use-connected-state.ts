import React from 'react';

import { socket } from "./socket";

export type ConnectionState = 'connected' | 'disconnected';

export const useConnectedState = (): ConnectionState => {
  const [state, useState] = React.useState<ConnectionState>(socket.connected ? 'connected': 'disconnected');
  React.useEffect(() => {
    const onConnFunc = () => {
      useState('connected')
    };
      socket.on('connect', onConnFunc);
    const onDisconnFunc = () => {
      useState('disconnected')
    };
    socket.on('disconnect', onDisconnFunc);
    return () => {
      socket.off('connect', onConnFunc);
      socket.off('disconnect', onDisconnFunc);
    }
  }, [])
  return state;
}
