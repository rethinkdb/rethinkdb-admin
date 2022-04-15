import React, {
  useEffect,
  useState,
  FunctionComponent,
  useCallback,
} from 'react';
import { Button, Divider, Grid, List, Paper } from '@mui/material';

import { request } from '../../socket';
import { getAllLogsQuery } from '../../app-driver';
import { Log, LogItem } from './log-item';

export function useLogEntries(limit = 20): null | Log[] {
  const [state, setState] = useState(null);
  useEffect(() => {
    request(getAllLogsQuery(limit)).then(setState);
  }, [limit]);
  return state;
}

const LogList: FunctionComponent<{ quantity: number }> = React.memo(
  ({ quantity }) => {
    const logs = useLogEntries(quantity);

    if (!Array.isArray(logs)) {
      return <div>loading</div>;
    }
    return (
      <List>
        {logs.map((logItem, index) => (
          <>
            <LogItem key={logItem.id[1]} logItem={logItem} />
            {logs.length > index + 1 && (
              <Divider
                key={`${logItem.id[1]}-divider`}
                variant="inset"
                component="li"
              />
            )}
          </>
        ))}
      </List>
    );
  },
);

function Logs() {
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
      margin: 1,
      width: '100%',
      backgroundColor: 'background.paper',
    }}>
      {logs.length} of requested {count}
      <LogList quantity={count} />
      <Grid  justify="center" item>
        {count <= logs.length && (
          <Button onClick={onButtonUpCount}>Older log entries</Button>
        )}
      </Grid>
    </Paper>
  );
}

export { Logs, LogList };
