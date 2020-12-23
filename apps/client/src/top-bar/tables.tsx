import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { r } from 'rethinkdb-kek/lib/query-builder/r';
import { RDatum } from 'rethinkdb-kek/lib/query-builder/new-query';
import { request } from '../socket';
import { system_db } from '../requests';
import { useStyles } from './use-styles';

function useTablesNumber(): null | { tablesReady: number; tables: number } {
  const [state, setState] = useState(null);
  useEffect(() => {
    request(
      r.do(
        r.db(system_db).table('table_config').count(),
        r
          .db(system_db)
          .table('table_status')('status')
          .filter((status: RDatum) => status('all_replicas_ready'))
          .count(),
        (tables, tablesReady) => ({
          tables,
          tablesReady,
        }),
      ).term,
    ).then((data) => {
      setState(data);
    });
  }, []);
  return state;
}

const TablesNumber = React.memo(() => {
  const classes = useStyles();
  const tablesData = useTablesNumber();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.text} variant="h5" component="h2">
          {tablesData &&
            `Tables: ${tablesData.tablesReady}/${tablesData.tables}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
});

export { TablesNumber };
