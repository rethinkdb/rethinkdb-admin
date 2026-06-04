import { RDatum } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { Stack, Typography } from '@mui/material';

import { admin, useRequest } from '../../rethinkdb';
import { pluralizeNoun } from '../../utils';

const { server_status: serverStatus, table_config: tableConfig } = admin;

const cList = [serverStatus.changes(), tableConfig.changes()];

const serversQuery = r.do(
  // All connected servers
  serverStatus('name').coerceTo('ARRAY'),
  // All servers assigned to tables
  tableConfig
    .concatMap((row) => row('shards').default([]))
    .concatMap((row) => row('replicas'))
    .distinct(),
  (connected_servers: RDatum, assigned_servers: RDatum) => ({
    servers_connected: connected_servers.count(),

    servers_missing: assigned_servers.setDifference(connected_servers),

    unknown_missing: tableConfig
      .filter((row: RDatum) => row.hasFields('shards').not())('name')
      .isEmpty()
      .not(),
  }),
);

export type ServerQueryResult = {
  servers_connected: number;
  servers_missing: string[];
  unknown_missing: boolean;
};

export const Servers = () => {
  const [serverResult] = useRequest<ServerQueryResult>(serversQuery, cList);
  if (!serverResult) {
    return <>loading</>;
  }
  return (
    <Stack minWidth="160px">
      <Typography>Servers</Typography>
      <Typography>
        {serverResult.servers_connected}{' '}
        {pluralizeNoun('server', serverResult.servers_connected)} connected
      </Typography>
      <Typography>
        {serverResult.servers_missing.length}{' '}
        {pluralizeNoun('server', serverResult.servers_missing.length)} missing
      </Typography>
    </Stack>
  );
};
