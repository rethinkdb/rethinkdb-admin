import React from 'react';

import { Box, styled, Typography } from '@mui/material';

import { FullTableList, useTableEntries } from './db-table-list';
import { CreateDatabaseModal } from './create-database-modal';

const PageRoot = styled('div')({
  marginTop: 1,
  width: '100%',
});

function TablesPage() {
  const tables = useTableEntries();

  if (!Array.isArray(tables)) {
    return <div>loading</div>;
  }

  return (
    <PageRoot>
      <Box display="flex" my={1}>
        <Typography sx={{ marginTop: 1, flexGrow: 1 }} variant="h6" noWrap>
          Tables existing in the cluster
        </Typography>
        <CreateDatabaseModal />
      </Box>
      <FullTableList entries={tables} />
    </PageRoot>
  );
}

export { TablesPage };
