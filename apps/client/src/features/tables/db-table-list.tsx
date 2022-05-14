import React, { useEffect, useState, FunctionComponent } from 'react';
import { CardActions, Chip, Paper, styled, Typography } from '@mui/material';

import { request } from '../rethinkdb/socket';
import { useChangesRequest } from '../top-bar/data-hooks';

import { CreateTableModal } from './create-table-modal';
import { dbConfigQuery, tableListQuery, tableStatusQuery } from './queries';
import { RemoveDatabaseModal } from './remove-database-modal';
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

const NoTablePaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey['200'],
  padding: theme.spacing(1),
}));

export const FullTableList: FunctionComponent<{
  entries: EnrichedDatabaseEntry[];
}> = React.memo(({ entries }) => {
  if (!Array.isArray(entries)) {
    return <div>loading</div>;
  }
  return entries.map((entry) => {
    return (
      <Paper
        key={entry.id}
        sx={{
          marginBottom: 2,
          marginTop: 1,
          padding: 1,
          width: '100%',
        }}
      >
        <Typography gutterBottom variant="h5" component="h2">
          <Chip color="primary" label="DATABASE" sx={{ marginRight: 1 }} />
          {entry.name}
        </Typography>
        {entry.tables.length > 0 ? (
          <TableList tables={entry.tables} />
        ) : (
          <NoTablePaper elevation={3}>
            There are no tables in this database
          </NoTablePaper>
        )}
        <CardActions>
          <CreateTableModal dbName={entry.name} />
          <RemoveDatabaseModal dbName={entry.name} />
        </CardActions>
      </Paper>
    );
  });
});
