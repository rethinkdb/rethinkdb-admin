import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useGuaranteedQuery } from '../requests';
import { useStyles } from './use-styles';

function ServersConnected() {
  const classes = useStyles();
  const queryResult = useGuaranteedQuery();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.text} variant="h5" component="h2">
          ServersConnected:{queryResult && queryResult.num_servers}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export { ServersConnected };
