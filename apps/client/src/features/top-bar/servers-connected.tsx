import React from 'react';

import { Box, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { BorderedIcon } from './bordered-icon';
import { useServersNumber } from './data-hooks';

function ServersConnected() {
  const serversNumber = useServersNumber();
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <BorderedIcon color="primaryInverse" component={StorageIcon} />
      <Typography
        variant="h6"
        sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}
      >
        Servers: {serversNumber} connected
      </Typography>
    </Box>
  );
}

export { ServersConnected };
