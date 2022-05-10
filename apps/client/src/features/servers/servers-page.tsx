import React from 'react';
import { Paper, Typography } from '@material-ui/core';

import { ServerList, useServerEntries } from './server-list';
import { useStyles } from './styles';

function ServersPage() {
  const classes = useStyles();
  const servers = useServerEntries();

  if (!Array.isArray(servers)) {
    return <div>loading</div>;
  }
  return (
    <>
      <Typography className={classes.title} variant="h6" noWrap>
        Servers connected to the cluster
      </Typography>
      <Paper className={classes.root}>
        <ServerList servers={servers} />
      </Paper>
    </>
  );
}

export { ServersPage };
