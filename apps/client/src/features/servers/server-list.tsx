import React, { useEffect, useState, FunctionComponent } from 'react';
import { Divider, Link, List } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { request } from '../rethinkdb/socket';
import { useChangesRequest } from '../top-bar/data-hooks';

import { Server, ServerItem } from './server-item';
import { serverConfigQuery, getServerListQuery } from '../rethinkdb/servers';

export function useServerEntries(): null | Server[] {
  const [state, setState] = useState(null);
  const lastServer = useChangesRequest(serverConfigQuery);

  useEffect(() => {
    request(getServerListQuery).then(setState);
  }, [lastServer.length]);
  return state;
}

export const ServerList: FunctionComponent<{ servers: Server[] }> = React.memo(
  ({ servers }) => {
    if (!Array.isArray(servers)) {
      return <div>loading</div>;
    }
    return (
      <List>
        {servers.map((serverItem, index) => (
          <React.Fragment key={serverItem.id}>
            <Link component={NavLink} to={`/servers/${serverItem.id}`}>
              <ServerItem key={serverItem.id[1]} serverItem={serverItem} />
            </Link>

            {servers.length > index + 1 && (
              <Divider
                key={`${serverItem.id[1]}-divider`}
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
