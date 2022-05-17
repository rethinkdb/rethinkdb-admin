import React from 'react';
import { Divider, Paper, Stack, styled } from '@mui/material';

import { Indexes } from './panel/indexes';
import { Servers } from './panel/servers';
import { Stats } from './panel/stats';
import { Tables } from './panel/tables';

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

export const Panel = () => (
  <Paper elevation={4}>
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      justifyContent="space-evenly"
    >
      <Item>
        <Servers />
      </Item>
      <Item>
        <Tables />
      </Item>
      <Item>
        <Indexes />
      </Item>
      <Item>
        <Stats />
      </Item>
    </Stack>
  </Paper>
);
