import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './use-styles';
import { useTablesNumber } from './data-hooks';

const TablesNumber = React.memo(() => {
  const classes = useStyles();
  const tablesData = useTablesNumber();
  return (
    <Typography className={classes.text} variant="h5" component="h2">
      {tablesData &&
        `Tables: ${tablesData.tablesReady}/${tablesData.tables}`}
    </Typography>
  );
});

export { TablesNumber };
