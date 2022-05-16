import React from 'react';

import { Stack } from '@mui/material';

import { RecentLogList } from '../logs/recent-log-list';
import { Panel } from './panel';
import { CommonTitledLayout } from '../../layouts/page';

const DashboardPage = () => (
  <CommonTitledLayout title="Dashboard page">
    <Stack spacing={1}>
      <Panel />
      <RecentLogList />
    </Stack>
  </CommonTitledLayout>
);

export { DashboardPage };
