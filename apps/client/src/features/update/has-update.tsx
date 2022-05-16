import React, { FunctionComponent } from 'react';
import { Alert, Link, Stack } from '@mui/material';
import { useUpdates } from '../top-bar/data-hooks';

export type UpdateInfo = {
  status: 'need_update' | 'ok';
  last_version: string;
  link_changelog: string;
};

export const HasUpdate: FunctionComponent = () => {
  const data: UpdateInfo | null = useUpdates();

  if (!data || data.status === 'ok') {
    return;
  }
  return (
    <Stack>
      <Alert severity="info">
        <strong>Update found:</strong> A new version of RethinkDB is available
        (version {data.last_version}): see the{' '}
        <Link href={data.link_changelog} target="_blank">
          release announcement
        </Link>{' '}
        for details.
      </Alert>
    </Stack>
  );
};
