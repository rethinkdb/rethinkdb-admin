import { Codemirror } from 'react-codemirror-ts';
import 'codemirror/lib/codemirror.css';
import { r } from 'rethinkdb-kek/lib/query-builder/r';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import React, { useState } from 'react';
import { Button, Paper, Typography } from '@material-ui/core';
import { request } from './socket';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    text: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    grid: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  }),
);

function evalInContext(js: string, context: unknown) {
  return function () {
    return eval(js);
  }.call(context);
}
function DataExplorer() {
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const [lastRunTime, setLastRunTime] = useState<Date>(null);
  const [data, setData] = useState<string>();
  async function onRequestClick() {
    setLastRunTime(new Date());
    try {
      const data = evalInContext(`const r = this.r;${value}`, { r });
      if (!data) {
        setData('You have to input anything');
        return;
      }
      request(data.term).then(
        (data) => setData(JSON.stringify(data, null, 2)),
        setData,
      );
    } catch (error) {
      setData(`TypeError: ${error.message}`);
    }
  }
  return (
    <Paper elevation={2}>
      <Codemirror
        defaultValue=""
        value=""
        name={'kek'}
        path={'kek'}
        options={{
          lineNumbers: true,
          mode: 'javascript',
          extraKeys: {
            'Ctrl-Space': 'autocomplete',
          },
          matchBrackets: true,
          lineWrapping: true,
          tabSize: 2,
        }}
        onChange={(value, options) => {
          setValue(value);
        }}
      />
      <Grid className={classes.grid} container spacing={1}>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" onClick={onRequestClick}>
            Request
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Typography>Last run timestamp: {lastRunTime && +lastRunTime}</Typography>
        </Grid>
      </Grid>
      <Typography className={classes.root} component="pre">
        {data}
      </Typography>
    </Paper>
  );
}

export { DataExplorer };
