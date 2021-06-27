import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './use-styles';
import { useConnectedTo } from './data-hooks';

const ConnectedTo = React.memo(() => {
  const classes = useStyles();
  const connectedToData = useConnectedTo();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.text} variant="h6" component="h2">
          {connectedToData && `Connected to ${connectedToData.name}`}
        </Typography>
      </CardContent>
    </Card>
  );
});

export { ConnectedTo };
