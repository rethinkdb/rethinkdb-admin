import React from 'react';

import { FullTableList, useTableEntries } from './db-table-list';
import { useStyles } from './styles';

function TablesPage() {
  const classes = useStyles();
  const tables = useTableEntries();

  if (!Array.isArray(tables)) {
    return <div>loading</div>;
  }

  return (
    <div className={classes.root}>
      <FullTableList entries={tables} />
    </div>
  );
}

export { TablesPage };
