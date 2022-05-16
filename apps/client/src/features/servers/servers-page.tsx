import React from 'react';
import { Paper } from '@mui/material';

import { CommonTitledLayout } from '../../layouts/page';

import { ServerList, useServerEntries } from './server-list';

function ServersPage() {
  const servers = useServerEntries();

  if (!Array.isArray(servers)) {
    return <div>loading</div>;
  }
  return (
    <CommonTitledLayout title="Servers connected to the cluster">
      <Paper sx={{ mt: 1, backgroundColor: 'background.paper' }}>
        <ServerList servers={servers} />
      </Paper>
    </CommonTitledLayout>
  );
}

export { ServersPage };
