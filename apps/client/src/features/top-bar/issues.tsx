import React from 'react';

import { Box, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';

import { BorderedIcon } from './bordered-icon';
import { useIssues } from './data-hooks';

function Issues() {
  const issues = useIssues();
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <BorderedIcon color="primaryInverse" component={BuildIcon} />
      <Typography
        variant="h6"
        sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}
      >
        {typeof issues === 'number' && issues === 0
          ? 'No issues'
          : `Issues: ${issues}`}
      </Typography>
    </Box>
  );
}

export { Issues };
