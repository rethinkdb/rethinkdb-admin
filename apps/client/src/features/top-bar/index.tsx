import React from 'react';
import { Divider, Paper, Stack, Icon } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import { ConnectedTo } from './connected-to';
import { Issues } from './issues';
import { ServersConnected } from './servers-connected';
import { TablesNumber } from './tables';

function TopBar() {
  return (
    <Paper variant="outlined" square>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-evenly"
      >
        <div>
          <ConnectedTo />
        </div>
        <div item xs={3}>
          <Issues />
        </div>
        <div item xs={3}>
          <ServersConnected />
        </div>
        <div item xs={3}>
          <TablesNumber />
        </div>
      </Stack>
    </Paper>
  );
}

export { TopBar };
