import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './use-styles';
import { useIssues } from './data-hooks';

function Issues() {
  const classes = useStyles();
  const issues = useIssues();
  return (
    <Typography className={classes.text} variant="h5" component="h2">
      {typeof issues === 'number' && issues === 0
        ? 'No issues'
        : `Issues: ${issues}`}
    </Typography>
  );
}

export { Issues };
