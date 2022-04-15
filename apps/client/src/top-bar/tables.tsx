import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useTablesNumber } from './data-hooks';

const TablesNumber = React.memo(() => {
  const tablesData = useTablesNumber();
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography
          sx={{
            padding: 2,
            textAlign: 'center',
            color: 'text.secondary',
          }}
          variant="h5"
          component="h2"
        >
          {tablesData &&
            `Tables: ${tablesData.tablesReady}/${tablesData.tables}`}
        </Typography>
      </CardContent>
    </Card>
  );
});

export { TablesNumber };
