import React from 'react';
import { Button, Paper } from '@material-ui/core';
import { LogList, useStyles } from './log-list';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

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
