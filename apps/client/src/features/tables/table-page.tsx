import React from 'react';
import { useParams } from 'react-router-dom';
import { formatDuration, intervalToDuration } from 'date-fns';

import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import CardActions from '@material-ui/core/CardActions';
// import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginTop: theme.spacing(1),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

// take the first three nonzero units
const units = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
];
export const TablePage = () => {
  const params = useParams<{ id: string }>();
  const query = useTable(params.id);
  const classes = useStyles();

  if (!query) {
    return <div>loading</div>;
  }

  const duration = intervalToDuration({
    start: new Date(query.profile.time_started),
    end: new Date(),
  });

  const nonzero = Object.entries(duration)
    .filter(([_, value]) => value || 0 > 0)
    .map(([unit, _]) => unit);

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {query.profile.version.split(' ')[1]} version
          </Typography>
          <Typography variant="h5" component="h2">
            {query.profile.hostname} hostname
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {query.profile.tags} tags
          </Typography>
          <Typography variant="body2" component="p">
            {formatDuration(duration, {
              format: units.filter((i) => new Set(nonzero).has(i)).slice(0, 3),
              delimiter: ', ',
            })}
            uptime
            <br />
            {Number(query.profile.cache_size / 1024 / 1024 / 1024).toFixed(2)}Gb
            cache size
          </Typography>
        </CardContent>
        {/*<CardActions>*/}
        {/*  <Button size="small">Learn More</Button>*/}
        {/*</CardActions>*/}
      </Card>
      <pre>The table is {JSON.stringify(query, null, 2)}</pre>
    </div>
  );
};
