import React, { useEffect, useState, FunctionComponent } from 'react';
import { Divider, List } from '@material-ui/core';

import { request } from '../../socket';
import { useChangesRequest } from '../../top-bar/data-hooks';

import { Server, ServerItem } from './server-item';
import { serverConfigQuery, getServerListQuery } from '../queries/servers';
import Link from "@material-ui/core/Link";
import {NavLink} from "react-router-dom";

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
          <>
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
          </>
        ))}
      </List>
    );
  },
);
