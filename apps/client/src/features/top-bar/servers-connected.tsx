import React from 'react';

import { Typography } from '@mui/material';

import { useServersNumber } from './data-hooks';

function ServersConnected() {
  const serversNumber = useServersNumber();
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}
    >
      Servers: {serversNumber} connected
    </Typography>
  );
}

export { ServersConnected };
