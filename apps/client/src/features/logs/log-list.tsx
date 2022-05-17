import React from 'react';
import { Divider, List } from '@mui/material';

import { useRequest } from '../rethinkdb';

import { Log, LogItem } from './log-item';
import {
  allLogChangesQuery,
  allServerChangesQuery,
  getAllLogsQuery,
  serverLogs,
} from './queries';

export function useLogEntries(limit = 20, server?: string): null | Log[] {
  const cList = React.useMemo(
    () => [server ? allServerChangesQuery(server) : allLogChangesQuery],
    [server],
  );
  const query = React.useMemo(
    () => (server ? serverLogs(limit, server) : getAllLogsQuery(limit)),
    [limit, server],
  );
  const [logs] = useRequest<Log[]>(query, cList);
  return logs;
}

export const LogList = React.memo(
  ({ quantity, server }: { server?: string; quantity: number }) => {
    const logs = useLogEntries(quantity, server);

    if (!Array.isArray(logs)) {
      return <div>loading</div>;
    }

    return (
      <List>
        {logs.map((logItem, index) => (
          <React.Fragment key={logItem.id.join()}>
            <LogItem logItem={logItem} />
            {logs.length > index + 1 && (
              <Divider
                key={`${logItem.id[1]}-divider`}
                variant="inset"
                component="li"
              />
            )}
          </React.Fragment>
        ))}
      </List>
    );
  },
);
