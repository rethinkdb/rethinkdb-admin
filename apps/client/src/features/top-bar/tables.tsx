import React from 'react';

import { useTablesNumber } from './data-hooks';
import { Typography } from '@mui/material';

const TablesNumber = React.memo(() => {
  const tablesData = useTablesNumber();
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}
    >
      {tablesData && `Tables: ${tablesData.tablesReady}/${tablesData.tables}`}
    </Typography>
  );
});

export { TablesNumber };
