import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { ConnectedTo } from './connected-to';
import { Issues } from './issues';
import { ServersConnected } from './servers-connected';
import { TablesNumber } from './tables';

function TopBar() {
  return (
    <Box sx={{ flexGrow: 1, justify: 'center' }}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <ConnectedTo />
        </Grid>
        <Grid item xs={2}>
          <Issues />
        </Grid>
        <Grid item xs={2}>
          <ServersConnected />
        </Grid>
        <Grid item xs={2}>
          <TablesNumber />
        </Grid>
      </Grid>
    </Box>
  );
}

export { TopBar };
