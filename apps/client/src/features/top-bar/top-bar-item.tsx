import React from 'react';

import { Avatar, Box, Stack, Typography } from '@mui/material';

export type TopBarItemProps = {
  icon: React.ComponentType;
  text: React.ReactNode;
  label: React.ReactNode;
};

export const TopBarItem = ({ label, icon: Icon, text }: TopBarItemProps) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexWrap="wrap"
  >
    <Avatar sx={{ bgcolor: 'primary.dark' }} variant="rounded">
      {<Icon />}
    </Avatar>
    <Stack py={1} pl={1} direction="column">
      <Typography
        pt={0.5}
        variant="subtitle1"
        lineHeight={1}
        textAlign="center"
        color="text.secondary"
      >
        {label}
      </Typography>
      <Typography variant="h6" lineHeight={1.2} textAlign="center">
        {text}
      </Typography>
    </Stack>
  </Box>
);
