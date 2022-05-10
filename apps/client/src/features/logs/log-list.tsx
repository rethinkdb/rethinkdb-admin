import React, { useEffect, useState, FunctionComponent } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { Divider, List } from '@material-ui/core';
import { RQuery } from 'rethinkdb-ts/lib/query-builder/query';

import { request } from '../rethinkdb/socket';
import { useChangesRequest } from '../top-bar/data-hooks';

import { Log, LogItem } from './log-item';
import {
  allLogChangesQuery,
  allServerChangesQuery,
  getAllLogsQuery,
  serverLogs,
} from './queries';

export function useLogEntries(limit = 20, server?: string): null | Log[] {
  const [state, setState] = useState(null);
  const changesQuery = server ? allServerChangesQuery(server) : allLogChangesQuery;
  const lastLog = useChangesRequest(changesQuery);

  useEffect(() => {
    request(server ? serverLogs(limit, server) : getAllLogsQuery(limit)).then(
      setState,
    );
  }, [server, limit, lastLog.length]);
  return state;
}

export const LogList: FunctionComponent<{ server?: string; quantity: number }> =
  React.memo(({ quantity, server }) => {
    const logs = useLogEntries(quantity, server);

    if (!Array.isArray(logs)) {
      return <div>loading</div>;
    }
    return (
      <List>
        {logs.map((logItem, index) => (
          <React.Fragment key={logItem.id[1]}>
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
  });
