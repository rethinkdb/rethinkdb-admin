import React from 'react';
import { Box, Typography } from '@mui/material';
import DataArrayIcon from '@mui/icons-material/DataArray';

import { BorderedIcon } from './bordered-icon';
import { useTablesNumber } from './data-hooks';

const TablesNumber = React.memo(() => {
  const tablesData = useTablesNumber();
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <BorderedIcon color="primaryInverse" component={DataArrayIcon} />
      <Typography variant="h6" py={2} textAlign="center" color="text.secondary">
        {tablesData && `Tables: ${tablesData.tablesReady}/${tablesData.tables}`}
      </Typography>
    </Box>
  );
});

export { TablesNumber };
