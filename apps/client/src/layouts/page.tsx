import React, { FunctionComponent } from 'react';
import { Box, styled, Typography } from '@mui/material';

export const CommonLayout = styled('div')({
  margin: 1,
});

export const CommonTitledLayout: FunctionComponent<{
  children?: React.ReactElement;
  title: string;
  titleOptions?: React.ReactElement;
}> = ({ children, title, titleOptions }) => (
  <CommonLayout>
    <Box display="flex" m={1}>
      <Typography sx={{ flexGrow: 1 }} variant="h4" noWrap>
        {title}
      </Typography>
      {titleOptions}
    </Box>
    <Box m={1}>{children}</Box>
  </CommonLayout>
);
