import React from 'react';

import { Box, Typography } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';

import { BorderedIcon } from './bordered-icon';
import { useConnectedTo } from './data-hooks';

const ConnectedTo = React.memo(() => {
  const connectedToData = useConnectedTo();
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <BorderedIcon color="primaryInverse" component={ComputerIcon} />
      <Typography variant="h6" sx={{ py: 2, color: 'text.secondary' }}>
        {connectedToData && `Connected to ${connectedToData.name}`}
      </Typography>
    </Box>
  );
});

export { ConnectedTo };
