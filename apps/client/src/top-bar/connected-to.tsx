import React from 'react';

import { Typography } from '@material-ui/core';

import { useStyles } from './use-styles';
import { useConnectedTo } from './data-hooks';

const ConnectedTo = React.memo(() => {
  const classes = useStyles();
  const connectedToData = useConnectedTo();
  return (
    <Typography className={classes.text} variant="h6" component="h2">
      {connectedToData && `Connected to ${connectedToData.name}`}
    </Typography>
  );
});

export { ConnectedTo };
