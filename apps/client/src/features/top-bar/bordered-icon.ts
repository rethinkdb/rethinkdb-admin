import { FunctionComponent } from 'react';
import { Box, styled } from '@mui/material';

export type ContextColorProps =
  | 'primary'
  | 'primaryInverse'
  | 'textPrimary'
  | 'textPrimaryInverse'
  | 'textSecondary'
  | 'textSecondaryInverse';

export type ContextComponentProps = {
  color: ContextColorProps;
  component: FunctionComponent;
};

export const BorderedIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<ContextComponentProps>(({ theme, color }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  boxSizing: 'content-box',
  ...(color === 'primary' && {
    color: theme.palette.primary.main,
  }),
  ...(color === 'primaryInverse' && {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  }),
  ...(color === 'textPrimary' && {
    color: theme.palette.text.primary,
  }),
  ...(color === 'textPrimaryInverse' && {
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.text.primary,
  }),
  ...(color === 'textSecondary' && {
    color: theme.palette.text.secondary,
  }),
  ...(color === 'textSecondaryInverse' && {
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.text.secondary,
  }),
}));
