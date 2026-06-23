import React from 'react';
import { Divider, Link, List } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { admin, useRequest } from '../rethinkdb';

import { Server, ServerItem } from './server-item';
import { getServerListQuery } from './queries';

const cList = [admin.server_config.changes()];

export function useServerEntries(): null | Server[] {
  const [state] = useRequest<Server[]>(getServerListQuery, cList);
  return state;
}

export const ServerList = React.memo(({ servers }: { servers: Server[] }) => {
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
});
