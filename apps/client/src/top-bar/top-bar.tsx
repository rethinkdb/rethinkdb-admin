import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { ConnectedTo } from './connected-to';
import { Issues } from './issues';
import { ServersConnected } from './servers-connected';
import { TablesNumber } from './tables';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TopBar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
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
    </div>
  );
}

export { TopBar };
