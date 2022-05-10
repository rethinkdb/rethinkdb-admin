import React, { useEffect, useState, FunctionComponent } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { Divider, List } from '@material-ui/core';

import { getAllLogsQuery } from '../rethinkdb/app-driver';
import { request } from '../rethinkdb/socket';
import { useChangesRequest } from '../top-bar/data-hooks';
import { system_db } from '../rethinkdb';

import { Log, LogItem } from './log-item';

const logChangesQuery = r
  .db(system_db)
  .table('logs', { identifierFormat: 'uuid' })
  .orderBy({ index: r.desc('id') })
  .changes();

export function useLogEntries(limit = 20): null | Log[] {
  const [state, setState] = useState(null);
  const lastLog = useChangesRequest(logChangesQuery);

  useEffect(() => {
    request(getAllLogsQuery(limit)).then(setState);
  }, [limit, lastLog.length]);
  return state;
}

export const LogList: FunctionComponent<{ quantity: number }> = React.memo(
  ({ quantity }) => {
    const logs = useLogEntries(quantity);

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
  },
);
