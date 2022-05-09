import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { TablesNumber } from './tables';
import { ServersConnected } from './servers-connected';
import { Issues } from './issues';
import { ConnectedTo } from './connected-to';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TopBar() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container spacing={3} justify="center">
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
