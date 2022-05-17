import React, { useState, useCallback } from 'react';
import { Button, Grid, Paper, Typography } from '@mui/material';

import { CommonTitledLayout } from '../../layouts/page';

import { LogList, useLogEntries } from './log-list';

export const LogsPage = () => {
  const [count, setCount] = useState<number>(20);
  const logs = useLogEntries(count);

  const onButtonUpCount = useCallback(
    () => setCount((count) => count + 20),
    [],
  );

  if (!Array.isArray(logs)) {
    return <div>loading</div>;
  }

  return (
    <CommonTitledLayout title="Logs">
      <Paper>
        <Typography p={1} variant="h6">
          {logs.length} of requested {count}
        </Typography>
        <LogList quantity={count} />
        <Grid container justifyContent="center" item>
          {count <= logs.length && (
            <Button onClick={onButtonUpCount}>Older log entries</Button>
          )}
        </Grid>
      </Paper>
    </CommonTitledLayout>
  );
};
