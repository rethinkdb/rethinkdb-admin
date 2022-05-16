import React, { FunctionComponent } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { LogList } from './log-list';

const RecentLogList: FunctionComponent<{ server?: string }> = ({ server }) => (
  <Paper
    sx={{
      marginTop: 1,
      width: '100%',
      backgroundColor: 'background.paper',
    }}
  >
    <Typography>Recent log entries</Typography>
    <Button component={NavLink} to="/logs" variant="contained" color="primary">
      View All
    </Button>
    <LogList quantity={6} server={server} />
  </Paper>
);

export { RecentLogList };
