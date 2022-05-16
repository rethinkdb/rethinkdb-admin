import { FunctionComponent } from 'react';
import { Divider, Paper, Stack, styled } from '@mui/material';
import { Servers } from './panel/servers';
import { Tables } from './panel/tables';
import { Indexes } from './panel/indexes';
import { Stats } from './panel/stats';

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

export const Panel: FunctionComponent = () => {
  return (
    <Paper my={1} elevation={4}>
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
};
