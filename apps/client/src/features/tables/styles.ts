import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      width: '100%',
      // backgroundColor: theme.palette.background.paper,
    },
    dbEnrichedRoot: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
      width: '100%',
    },
    chip: {
      marginRight: theme.spacing(1),
    },
  }),
);
