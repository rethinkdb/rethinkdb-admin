import React from 'react';
import { CardActions, Chip, Paper, styled, Typography } from '@mui/material';

import { useRequest } from '../rethinkdb';

import { CreateTableModal } from './create-table-modal';
import { dbConfigQuery, tableListQuery, tableStatusQuery } from './queries';
import { RemoveDatabaseModal } from './remove-database-modal';
import { TableList } from './table-list';
import { EnrichedDatabaseEntry } from './types';

const dbFeed = dbConfigQuery.changes();
const tableFeed = tableStatusQuery.changes();

const cList = [dbFeed, tableFeed];

export function useTableEntries(): null | EnrichedDatabaseEntry[] {
  const [state] = useRequest<EnrichedDatabaseEntry[]>(tableListQuery, cList);
  return state;
}

const NoTablePaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey['200'],
  padding: theme.spacing(1),
}));

export const FullTableList = React.memo(
  ({ entries }: { entries: EnrichedDatabaseEntry[] }) => {
    if (!Array.isArray(entries)) {
      return <div>loading</div>;
    }
    return (
      <>
        {entries.map((entry) => (
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
        ))}
      </>
    );
  },
);
