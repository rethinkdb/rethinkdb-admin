import React, { FunctionComponent } from 'react';
import { styled, Typography } from '@mui/material';

const H2Typography: FunctionComponent = (props) => (
  <Typography variant="h5" component="h2" {...props} />
);

export const StyledTypography = styled(H2Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
