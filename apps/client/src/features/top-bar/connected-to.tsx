import React from 'react';

import ComputerIcon from '@mui/icons-material/Computer';

import { useConnectedTo } from './data-hooks';
import { TopBarItem } from './top-bar-item';

export const ConnectedTo = () => {
  const connectedToData = useConnectedTo();
  const text = connectedToData && connectedToData.name;
  return <TopBarItem icon={ComputerIcon} text={text} label="Connected to" />;
};
