import React from 'react';

import { Box, Stack } from '@mui/material';

import { RecentLogList } from '../logs/recent-log-list';
import { CommonTitledLayout } from '../../layouts/page';
import { LineChart } from '../chart';

import { Panel } from './panel';

const DashboardPage = () => (
  <CommonTitledLayout title="Dashboard page">
    <Stack spacing={1}>
      <Box mb={2}>
        <Panel />
      </Box>
      <LineChart />
      <RecentLogList />
    </Stack>
  </CommonTitledLayout>
);

export { DashboardPage };
