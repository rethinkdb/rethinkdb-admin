import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { r } from 'rethinkdb-kek/lib/query-builder/r';
import { request } from '../socket';
import { system_db } from '../requests';
import { useStyles } from './use-styles';

const issuesTerm = r.db(system_db).table('current_issues').count().term;

function useIssues(): null | unknown {
  const [state, setState] = useState(null);
  useEffect(() => {
    request(issuesTerm).then(setState);
  }, []);
  return state;
}

function Issues() {
  const classes = useStyles();
  const issues = useIssues();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.text} variant="h5" component="h2">
          Issues: {typeof issues === 'number' && issues}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export { Issues };
