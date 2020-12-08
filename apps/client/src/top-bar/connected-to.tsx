import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { requestMe } from '../socket';
import { useStyles } from './use-styles';

function useConnectedTo(): null | unknown {
  const [state, setState] = useState(null);
  useEffect(() => {
    requestMe().then((data) => {
      setState(data);
    });
  }, []);
  return state;
}

function ConnectedTo() {
  const classes = useStyles();
  const connectedToData = useConnectedTo();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.text} variant="h5" component="h2">
          {connectedToData ? (
            <>Connected to {JSON.stringify(connectedToData.name, null, 2)}</>
          ) : (
            'tablesData'
          )}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export { ConnectedTo };
