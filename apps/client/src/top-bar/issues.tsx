import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './use-styles';
import { useIssues } from './data-hooks';

const Issues= React.memo(() => {
  const classes = useStyles();
  const issues = useIssues();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.text} variant="h5" component="h2">
          {typeof issues === 'number' && issues === 0
            ? 'No issues'
            : `Issues: ${issues}`}
        </Typography>
      </CardContent>
    </Card>
  );
});

export { Issues };
