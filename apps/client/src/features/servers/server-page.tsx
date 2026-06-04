import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CachedIcon from '@mui/icons-material/Cached';
import DifferenceIcon from '@mui/icons-material/Difference';
import LanIcon from '@mui/icons-material/Lan';
import StorageIcon from '@mui/icons-material/Storage';
import StyleIcon from '@mui/icons-material/Style';

import { CommonTitledLayout } from '../../layouts/page';

import { LineChart } from '../chart';
import { LogList } from '../logs/log-list';
import { useRequest } from '../rethinkdb';
import { ComparableTime } from '../time/relative';

import { ExpandedServer, fetchServer, ShardedTable } from './queries';

const replicaRolename = ({
  configured_primary: configured,
  currently_primary: currently,
  nonvoting,
}: {
  configured_primary: boolean;
  currently_primary: boolean;
  nonvoting: boolean;
}) => {
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

export type IShardedTableItem = {
  table: ShardedTable;
};

export const TableShardItem = React.memo(({ table }: IShardedTableItem) => {
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
});

export const TableShards = ({ tables }: { tables: ShardedTable[] }) => (
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

const ServerOverview = ({ data }: { data: ExpandedServer }) => (
  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
    <ListItem dense>
      <ListItemAvatar>
        <Avatar>
          <DifferenceIcon />
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
          <LanIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={data.profile.hostname} secondary="hostname" />
    </ListItem>
    <ListItem dense>
      <ListItemAvatar>
        <Avatar>
          <StyleIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={data.profile.tags} secondary="tags" />
    </ListItem>
    <ListItem dense>
      <ListItemAvatar>
        <Avatar>
          <AccessTimeIcon />
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
          <CachedIcon />
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

export const ServerPage = () => {
  const params = useParams<{ id: string }>();
  const [data] = useRequest<ExpandedServer>(fetchServer(params.id));

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
          <Paper sx={{ p: 1 }}>
            <Typography variant="h6">Table shards on this server</Typography>
            <TableShards tables={data.tables} />
          </Paper>
        </Grid>
        <Grid item md={8}>
          <Paper sx={{ p: 1 }}>
            <Typography variant="h6">Recent Log Entries</Typography>
            <LogList quantity={6} server={params.id} />
          </Paper>
        </Grid>
      </Grid>
    </CommonTitledLayout>
  );
};
