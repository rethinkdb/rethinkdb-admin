import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      marginTop: theme.spacing(1),
    }
  }),
);
