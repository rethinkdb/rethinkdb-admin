import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useIssues } from './data-hooks';

const Issues = React.memo(() => {
  const issues = useIssues();
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
          {typeof issues === 'number' && issues === 0
            ? 'No issues'
            : `Issues: ${issues}`}
        </Typography>
      </CardContent>
    </Card>
  );
});

export { Issues };
