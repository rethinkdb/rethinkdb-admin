import { useGuaranteedQuery } from '../requests';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { TablesNumber } from './tables';
import { ServersConnected } from './servers-connected';
import { Issues } from './issues';
import { ConnectedTo } from './connected-to';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TopBar() {
  const classes = useStyles();
  const queryResult = useGuaranteedQuery();
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
      <div>
        {queryResult ? (
          <pre>{JSON.stringify(queryResult, null, 2)}</pre>
        ) : (
          'kek'
        )}
      </div>
    </div>
  );
}

export { TopBar };
