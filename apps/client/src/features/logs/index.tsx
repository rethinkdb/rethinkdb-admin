import React, {
  useState,
  useCallback,
} from 'react';
import { Button, Grid, Paper } from '@material-ui/core';

import { LogList, useLogEntries } from './log-list';
import { useStyles } from './styles';

function LogsPage() {
  const classes = useStyles();
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
    <Paper className={classes.root}>
      {logs.length} of requested {count}
  <LogList quantity={count} />
  <Grid justify="center" item>
  {count <= logs.length && (
    <Button onClick={onButtonUpCount}>Older log entries</Button>
)}
  </Grid>
  </Paper>
);
}

export { LogsPage };
