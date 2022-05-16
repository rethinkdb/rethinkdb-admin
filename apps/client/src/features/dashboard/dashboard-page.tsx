import React from 'react';

import { Box, Stack } from '@mui/material';

import { RecentLogList } from '../logs/recent-log-list';
import { Panel } from './panel';
import { CommonTitledLayout } from '../../layouts/page';

const DashboardPage = () => (
  <CommonTitledLayout title="Dashboard page">
    <Stack spacing={1}>
      <Box mb={2}>
        <Panel />
      </Box>
      <RecentLogList />
    </Stack>
  </CommonTitledLayout>
);

export { DashboardPage };
