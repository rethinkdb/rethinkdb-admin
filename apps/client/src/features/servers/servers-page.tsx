import React from 'react';
import { Paper, Typography } from '@mui/material';

import { ServerList, useServerEntries } from './server-list';

function ServersPage() {
  const servers = useServerEntries();

  if (!Array.isArray(servers)) {
    return <div>loading</div>;
  }
  return (
    <>
      <Typography sx={{ marginTop: 1 }} variant="h6" noWrap>
        Servers connected to the cluster
      </Typography>
      <Paper
        sx={{
          marginTop: 1,
          width: '100%',
          backgroundColor: 'background.paper',
        }}
      >
        <ServerList servers={servers} />
      </Paper>
    </>
  );
}

export { ServersPage };
