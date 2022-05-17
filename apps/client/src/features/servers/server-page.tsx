import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { RDatum, RSingleSelection, RValue } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import StorageIcon from '@mui/icons-material/Storage';
import {
  Avatar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

import { system_db } from '../rethinkdb';
import { request } from '../rethinkdb/socket';
import { ComparableTime } from '../time/relative';
import { LogList } from '../logs/log-list';
import { admin } from '../rethinkdb/app-driver';
import { CommonTitledLayout } from '../../layouts/page';
import { LineChart } from '../chart';

const { table_config: tableConfig, table_status: tableStatus } = admin;

function serverRespQuery(server_name: RValue) {
  return tableConfig
    .filter((i: RDatum) =>
      i('shards')('replicas')
        .concatMap((x) => x)
        .contains(server_name),
    )
    .map((config) => ({
      db: config('db'),
      name: config('name'),
      id: config('id'),
      shards: config('shards')
        .map(
          tableStatus.get(config('id'))('shards'),
          r.range(config.count()),
          function (sconfig: RValue, sstatus: RValue, shardId: RValue): RValue {
            return {
              shard_id: shardId.add(1),
              total_shards: config('shards').count(),
              inshard: sconfig('replicas').contains(server_name),
              currently_primary:
                sstatus('primary_replicas').contains(server_name),
              configured_primary: sconfig('primary_replica').eq(server_name),
              nonvoting: sconfig('nonvoting_replicas').contains(server_name),
            };
          },
        )
        .filter({ inshard: true })
        .without('inshard')
        .coerceTo('ARRAY'),
    }))
    .coerceTo('ARRAY');
}

function fetchServer(id: string) {
  return r.do(
    r.db(system_db).table('server_config').get(id),
    r.db(system_db).table('server_status').get(id),
    (
      server_config: RSingleSelection,
      server_status: RSingleSelection,
    ): RValue => {
      return {
        profile: {
          version: server_status('process')('version'),
          time_started: server_status('process')('time_started'),
          hostname: server_status('network')('hostname'),
          tags: server_config('tags'),
          cache_size: server_status('process')('cache_size_mb').mul(
            1024 * 1024,
          ),
        },
        main: {
          name: server_status('name'),
          id: server_status('id'),
        },
        tables: serverRespQuery(server_config('name')),
      };
    },
  );
}

export function useServer(id: string): ExpandedServer {
  const [state, setState] = useState(null);

  useEffect(() => {
    request(fetchServer(id)).then(setState);
  }, [id]);
  return state;
}

export type Shard = {
  configured_primary: boolean;
  currently_primary: boolean;
  nonvoting: boolean;
  shard_id: number;
  total_shards: number;
};

export type ShardedTable = {
  db: string;
  id: string;
  name: string;
  shards: Shard[];
};

export type ExpandedServer = {
  main: {
    id: string;
    name: string;
  };
  profile: {
    cache_size: number;
    hostname: string;
    tags: string[];
    time_started: string;
    version: string;
  };
  tables: ShardedTable[];
};

export type IShardedTableItem = {
  table: ShardedTable;
};

const replicaRolename = function ({
  configured_primary: configured,
  currently_primary: currently,
  nonvoting,
}: {
  configured_primary: boolean;
  currently_primary: boolean;
  nonvoting: boolean;
}) {
  if (configured && currently) {
    return 'Primary replica';
  } else if (configured && !currently) {
    return 'Goal primary replica';
  } else if (!configured && currently) {
    return 'Acting primary replica';
  } else if (nonvoting) {
    return 'Non-voting secondary replica';
  } else {
    return 'Secondary replica';
  }
};

export const TableShardItem: FunctionComponent<IShardedTableItem> = React.memo(
  ({ table }) => {
    const fullTableName = `${table.db}.${table.name}`;
    const secondary = (
      <React.Fragment>
        <Typography component="span" variant="body2" color="textPrimary">
          Shard {table.shards[0].shard_id}/{table.shards[0].total_shards} -{' '}
          <StorageIcon fontSize="inherit" />
          {replicaRolename(table.shards[0])}
        </Typography>
      </React.Fragment>
    );
    return (
      <ListItemButton dense component={NavLink} to={`/tables/${table.id}`}>
        <ListItemText
          id={table.id}
          primary={`Table ${fullTableName}`}
          secondary={secondary}
        />
      </ListItemButton>
    );
  },
);

export const TableShards: FunctionComponent<{ tables: ShardedTable[] }> = ({
  tables,
}) => (
  <List>
    {tables.map((table, index) => (
      <React.Fragment key={table.id}>
        <TableShardItem table={table} />
        {tables.length > index + 1 && (
          <Divider variant="inset" component="li" />
        )}
      </React.Fragment>
    ))}
  </List>
);

const ServerOverview = ({ data }: { data: ExpandedServer }) => {
  if (!data) {
    return <div>loading</div>;
  }
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem dense>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={data.profile.version.split(' ')[1]}
          secondary="version"
        />
      </ListItem>
      <ListItem dense>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={data.profile.hostname} secondary="hostname" />
      </ListItem>
      <ListItem dense>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={data.profile.tags} secondary="tags" />
      </ListItem>
      <ListItem dense>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <ComparableTime
              date={new Date(data.profile.time_started)}
              suffix={false}
            />
          }
          secondary="uptime"
        />
      </ListItem>
      <ListItem dense>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${Number(
            data.profile.cache_size / 1024 / 1024 / 1024,
          ).toFixed(2)} Gb`}
          secondary="cache size"
        />
      </ListItem>
    </List>
  );
};

export const ServerPage = () => {
  const params = useParams<{ id: string }>();
  const data = useServer(params.id);

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <CommonTitledLayout title={`Server overview for ${data.main.name}`}>
      <Paper>
        <Grid p={1} container direction="row" spacing={1}>
          <Grid item xs={3}>
            <ServerOverview data={data} />
          </Grid>
          <Grid item xs={9}>
            <LineChart />
          </Grid>
        </Grid>
      </Paper>
      <Grid mt={1} container direction="row" spacing={1}>
        <Grid item md={4}>
          <Paper sx={{ marginTop: 1, p: 1 }}>
            <Typography variant="h6">Table shards on this server</Typography>
            <TableShards tables={data.tables} />
          </Paper>
        </Grid>
        <Grid item md={8}>
          <Paper sx={{ marginTop: 1, p: 1 }}>
            <Typography variant="h6">Recent Log Entries</Typography>
            <LogList quantity={6} server={params.id} />
          </Paper>
        </Grid>
      </Grid>
    </CommonTitledLayout>
  );
};
