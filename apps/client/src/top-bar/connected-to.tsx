import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { MeResponse, requestMe } from "../socket";
import { useStyles } from './use-styles';

function useConnectedTo(): null | MeResponse {
  const [state, setState] = useState<MeResponse>(null);
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
        <Typography className={classes.text} variant="h6" component="h2">
          {connectedToData && `Connected to ${connectedToData.name}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export { ConnectedTo };
