import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useServersNumber } from './data-hooks';

function ServersConnected() {
  const serversNumber = useServersNumber();
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography
          sx={{
            padding: 2,
            textAlign: 'center',
            color: 'text.secondary',
          }}
          variant="h5"
          component="h2"
        >
          Servers: {serversNumber} connected
        </Typography>
      </CardContent>
    </Card>
  );
}

export { ServersConnected };
