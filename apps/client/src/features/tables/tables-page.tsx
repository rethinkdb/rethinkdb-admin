import React from 'react';

import { Box, styled, Typography } from '@mui/material';

import { FullTableList, useTableEntries } from './db-table-list';
import { CreateDatabaseModal } from './create-database-modal';
import { CommonTitledLayout } from '../../layouts/page';

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
    <CommonTitledLayout
      title="Tables existing in the cluster"
      titleOptions={<CreateDatabaseModal />}
    >
      <FullTableList entries={tables} />
    </CommonTitledLayout>
  );
}

export { TablesPage };
