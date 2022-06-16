import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { LogList } from './log-list';

const RecentLogList = ({ server }: { server?: string }) => (
  <Paper
    sx={{
      mt: 1,
      width: '100%',
      backgroundColor: 'background.paper',
    }}
  >
    <Box display="flex" my={1}>
      <Typography my={1} flexGrow={1} variant="h5">
        Recent log entries
      </Typography>
      <Button
        component={NavLink}
        to="/logs"
        variant="contained"
        color="primary"
      >
        View All
      </Button>
    </Box>
    <LogList quantity={6} server={server} />
  </Paper>
);

export { RecentLogList };
