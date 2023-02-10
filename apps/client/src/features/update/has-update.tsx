import React from 'react';
import { Alert, Link, Stack } from '@mui/material';

import {CheckUpdatesResponse, useUpdates} from '../top-bar/data-hooks';

export const HasUpdate = () => {
  const data: CheckUpdatesResponse | null = useUpdates();

  if (!data || data.isSameVersion) {
    return;
  }
  return (
    <Stack>
      <Alert severity="info">
        <strong>Update found:</strong> A new version of RethinkDB is available
        (version {data.latestVersion}): see the{' '}
        <Link href="https://github.com/rethinkdb/rethinkdb/releases" target="_blank">
          release announcement
        </Link>{' '}
        for details.
      </Alert>
    </Stack>
  );
};
