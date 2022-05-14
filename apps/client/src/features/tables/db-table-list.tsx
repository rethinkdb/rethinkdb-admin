import React, { useEffect, useState, FunctionComponent } from 'react';
import {
  Button,
  CardActions,
  Chip,
  Paper,
  Typography,
} from '@mui/material';

import { request } from '../rethinkdb/socket';
import { useChangesRequest } from '../top-bar/data-hooks';

import { dbConfigQuery, tableListQuery, tableStatusQuery } from './queries';
import { TableList } from './table-list';
import { EnrichedDatabaseEntry } from './types';

const dbFeed = dbConfigQuery.changes();
const tableFeed = tableStatusQuery.changes();

export function useTableEntries(): null | EnrichedDatabaseEntry[] {
  const [state, setState] = useState(null);
  const dbChanges = useChangesRequest(dbFeed);
  const tableChanges = useChangesRequest(tableFeed);

  useEffect(() => {
    request(tableListQuery).then(setState);
  }, [dbChanges.length, tableChanges.length]);
  return state;
}

export const FullTableList: FunctionComponent<{
  entries: EnrichedDatabaseEntry[];
}> = React.memo(({ entries }) => {
  if (!Array.isArray(entries)) {
    return <div>loading</div>;
  }
  return entries.map((entry) => {
    return (
      <Paper key={entry.id} sx={{
        marginBottom: 2,
        marginTop: 1,
        padding: 1,
        width: '100%',
      }}>
        <Typography gutterBottom variant="h5" component="h2">
          <Chip color="primary" label="DATABASE" sx={{marginRight: 1 }} />
          {entry.name}
        </Typography>
        {entry.tables.length > 0 ? (
          <TableList tables={entry.tables} />
        ) : (
          'There are no tables in this database'
        )}
        <CardActions>
          <Button size="small" color="primary">
            Add Table
          </Button>
          <Button size="small" color="secondary">
            Remove Database
          </Button>
        </CardActions>
      </Paper>
    );
  });
});
