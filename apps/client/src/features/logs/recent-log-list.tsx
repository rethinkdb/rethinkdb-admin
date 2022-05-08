import React from 'react';
import { Button, Paper, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import { LogList } from './log-list';
import { useStyles } from './styles';

function RecentLogList() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography>Recent log entries</Typography>
      <Button
        component={NavLink}
        to="/logs"
        variant="contained"
        color="primary"
      >
        View All
      </Button>
      <LogList quantity={6} />
    </Paper>
  );
}

export { RecentLogList };
