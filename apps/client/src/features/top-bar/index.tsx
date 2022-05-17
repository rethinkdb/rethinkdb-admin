import React from 'react';
import { Divider, Paper, Stack } from '@mui/material';

import { ConnectedTo } from './connected-to';
import { Issues } from './issues';
import { ServersConnected } from './servers-connected';
import { TablesNumber } from './tables';

export const TopBar = () => (
  <Paper variant="outlined" square>
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      justifyContent="space-evenly"
    >
      <ConnectedTo />
      <Issues />
      <ServersConnected />
      <TablesNumber />
    </Stack>
  </Paper>
);
