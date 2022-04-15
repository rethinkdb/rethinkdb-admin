import React from 'react';
import { Button, Paper } from '@mui/material';
import { LogList } from './log-list';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';

function RecentLogList() {
  return (
    <Paper sx={{
      margin: 1,
      width: '100%',
      backgroundColor: 'background.paper',
    }}>
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
