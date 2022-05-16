import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Paper, Typography } from '@mui/material';

import { CommonTitledLayout } from '../../layouts/page';
import { request } from '../rethinkdb/socket';
import { humanizeTableStatus } from '../utils/rethinkdb';

import { guaranteedQuery } from './queries';

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

  if (!table) {
    return <div>loading</div>;
  }

  return (
    <CommonTitledLayout title={`Table overview for ${table.db}.${table.name}`}>
      <Paper sx={{ padding: 1 }}>
        <Typography fontSize={14} color="textSecondary" gutterBottom>
          Statistics: {humanizeTableStatus(table.status)}
        </Typography>
        <Typography fontSize={14} color="textSecondary" gutterBottom>
          {table.num_primary_replicas}/{table.num_shards} primary replicas
        </Typography>
        <Typography fontSize={14} color="textSecondary" gutterBottom>
          {table.num_available_replicas}/{table.num_replicas} replicas available
        </Typography>
        <Typography fontSize={14} color="textSecondary" gutterBottom>
          About 0 documents Sharding and replication 1 shard 1 replica per shard
          Reconfigure Secondary indexes No secondary indexes found. Create a new
          secondary index → Servers used by this table Shard 1 ~0 documents kek2
          Primary replica ready Table Viewer Lookup: Empty result set
        </Typography>
      </Paper>
      <pre>The table is {JSON.stringify(table, null, 2)}</pre>
    </CommonTitledLayout>
  );
};
