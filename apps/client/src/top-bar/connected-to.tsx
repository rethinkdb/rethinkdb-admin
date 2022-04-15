import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useConnectedTo } from './data-hooks';

const ConnectedTo = React.memo(() => {
  const connectedToData = useConnectedTo();
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography
          sx={{
            padding: 2,
            textAlign: 'center',
            color: 'text.secondary',
          }}
          variant="h6"
          component="h2"
        >
          {connectedToData && `Connected to ${connectedToData.name}`}
        </Typography>
      </CardContent>
    </Card>
  );
});

export { ConnectedTo };
