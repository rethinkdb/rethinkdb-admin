import React from 'react';

import Storage from '@mui/icons-material/Storage';

import { useServersNumber } from './data-hooks';
import { TopBarItem } from './top-bar-item';

export const ServersConnected = () => {
  const serversNumber = useServersNumber();
  const text = `${serversNumber} connected`;
  return <TopBarItem icon={Storage} label="Servers" text={text} />;
};
