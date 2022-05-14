import React, { useState, useCallback } from 'react';
import { Button, Grid, Paper } from '@mui/material';

import { LogList, useLogEntries } from './log-list';

function LogsPage() {
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
    <Paper sx={{
      marginTop: 1,
      width: '100%',
      backgroundColor: 'background.paper',
    }}>
      {logs.length} of requested {count}
      <LogList quantity={count} />
      <Grid container justifyContent="center" item>
        {count <= logs.length && (
          <Button onClick={onButtonUpCount}>Older log entries</Button>
        )}
      </Grid>
    </Paper>
  );
}

export { LogsPage };
