import React from 'react';

import { styled } from '@mui/material';

import { FullTableList, useTableEntries } from './db-table-list';

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
      <FullTableList entries={tables} />
    </PageRoot>
  );
}

export { TablesPage };
