import React from 'react';

import { Typography } from '@mui/material';

import { useIssues } from './data-hooks';

function Issues() {
  const issues = useIssues();
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}
    >
      {typeof issues === 'number' && issues === 0
        ? 'No issues'
        : `Issues: ${issues}`}
    </Typography>
  );
}

export { Issues };
