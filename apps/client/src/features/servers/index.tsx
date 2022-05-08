import React from 'react';
import { Paper } from '@material-ui/core';

import {ServerList, useServerEntries} from './server-list';
import { useStyles } from './styles';

function ServersPage() {
  const classes = useStyles();
  const servers = useServerEntries();

  if (!Array.isArray(servers)) {
    return <div>loading</div>;
  }
  return (
    <Paper className={classes.root}>
      <ServerList servers={servers}/>
    </Paper>
  );
}

export { ServersPage };
