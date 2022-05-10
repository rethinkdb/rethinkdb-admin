import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { guaranteedQuery } from './queries';
import { request } from '../rethinkdb/socket';
import { useStyles as useRootStyles } from '../servers/styles';
import { humanizeTableStatus } from './table-item';
// import CardActions from '@material-ui/core/CardActions';
// import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginTop: theme.spacing(1),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export type TableGuaranteedData = {
  db: string;
  id: string;
  max_num_shards: number;
  max_shards: number;
  name: string;
  num_available_replicas: number;
  num_default_servers: number;
  num_primary_replicas: number;
  num_replicas: number;
  num_replicas_per_shard: number;
  num_servers: number;
  num_shards: number;
  raft_leader: string;
  status: {
    all_replicas_ready: boolean;
    ready_for_outdated_reads: boolean;
    ready_for_reads: boolean;
    ready_for_writes: boolean;
  };
};

const useTableData = (tableId: string): TableGuaranteedData | null => {
  const [state, setState] = useState(null);

  useEffect(() => {
    request(guaranteedQuery(tableId)).then(setState);
  }, [tableId]);
  return state;
};

export const TablePage = () => {
  const params = useParams<{ id: string }>();
  const table = useTableData(params.id);
  const classes = useStyles();
  const rootClasses = useRootStyles();

  if (!table) {
    return <div>loading</div>;
  }

  return (
    <>
      <Typography className={rootClasses.title} variant="h6" noWrap>
        Table overview for {table.db}.{table.name}
      </Typography>
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Statistics: {humanizeTableStatus(table.status)}
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {table.num_primary_replicas}/{table.num_shards} primary replicas
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {table.num_available_replicas}/{table.num_replicas} replicas
            available
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            About 0 documents Sharding and replication 1 shard 1 replica per
            shard Reconfigure Secondary indexes No secondary indexes found.
            Create a new secondary index → Servers used by this table Shard 1 ~0
            documents kek2 Primary replica ready Table Viewer Lookup: Empty
            result set
          </Typography>
          {/*<Typography variant="h5" component="h2">*/}
          {/*  {query.profile.hostname} hostname*/}
          {/*</Typography>*/}
          {/*<Typography className={classes.pos} color="textSecondary">*/}
          {/*  {query.profile.tags} tags*/}
          {/*</Typography>*/}
        </CardContent>
        {/*<CardActions>*/}
        {/*  <Button size="small">Learn More</Button>*/}
        {/*</CardActions>*/}
      </Card>
      <pre>The table is {JSON.stringify(table, null, 2)}</pre>
    </>
  );
};
