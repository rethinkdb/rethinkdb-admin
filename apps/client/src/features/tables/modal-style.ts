import { Card, CardProps, styled } from '@mui/material';

export const ModalCard = styled(Card)<CardProps & { width?: number }>(
  ({ theme, width }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: width || 400,
    bgcolor: theme.palette.background.paper,
    pt: theme.spacing(2),
    px: theme.spacing(4),
    pb: theme.spacing(3),
  }),
);
