import React from 'react';

import { Typography } from '@mui/material';
import { useConnectedTo } from './data-hooks';

const ConnectedTo = React.memo(() => {
  const connectedToData = useConnectedTo();
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}
    >
      {connectedToData && `Connected to ${connectedToData.name}`}
    </Typography>
  );
});

export { ConnectedTo };
