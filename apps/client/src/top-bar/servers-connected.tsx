import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './use-styles';
import { useServersNumber } from './data-hooks';

function ServersConnected() {
  const classes = useStyles();
  const serversNumber = useServersNumber();
  return (
    <Typography className={classes.text} variant="h5" component="h2">
      Servers: {serversNumber} connected
    </Typography>
  );
}

export { ServersConnected };
