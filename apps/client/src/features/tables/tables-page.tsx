import React from 'react';

import { FullTableList, useTableEntries } from './db-table-list';
import { CreateDatabaseModal } from './create-database-modal';
import { CommonTitledLayout } from '../../layouts/page';

function TablesPage() {
  const tables = useTableEntries();

  if (!Array.isArray(tables)) {
    return <div>loading</div>;
  }

  return (
    <CommonTitledLayout
      title="Tables in the cluster"
      titleOptions={<CreateDatabaseModal />}
    >
      <FullTableList entries={tables} />
    </CommonTitledLayout>
  );
}

export { TablesPage };
