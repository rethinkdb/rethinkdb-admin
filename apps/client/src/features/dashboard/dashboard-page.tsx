import React from 'react';

import { RecentLogList } from '../logs/recent-log-list';
import { Panel } from './panel';
import { Stack, Typography } from '@mui/material';

function DashboardPage() {
  return (
    <Stack sx={{ m: 1 }} spacing={1}>
      <Typography sx={{ m: 1 }} variant="h3">
        Dashboard page
      </Typography>
      <Panel />
      <RecentLogList />
    </Stack>
  );
}

export { DashboardPage };
