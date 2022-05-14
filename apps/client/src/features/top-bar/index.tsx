import React from 'react';
import { Card, CardContent, Divider, Grid } from '@mui/material';

import { ConnectedTo } from './connected-to';
import { Issues } from './issues';
import { ServersConnected } from './servers-connected';
import { TablesNumber } from './tables';

function TopBar() {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={2}>
            <ConnectedTo />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={2}>
            <Issues />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={2}>
            <ServersConnected />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={2}>
            <TablesNumber />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export { TopBar };
