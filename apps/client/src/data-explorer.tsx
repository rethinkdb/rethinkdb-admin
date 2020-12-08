import { Codemirror } from 'react-codemirror-ts';
import 'codemirror/lib/codemirror.css';
import { r } from 'rethinkdb-kek/lib/query-builder/r';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import { useState } from 'react';
import { Button, Paper, Typography } from '@material-ui/core';
import { request } from './socket';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
  }),
);

function evalInContext(js: string, context: unknown) {
  //# Return the results of the in-line anonymous function we .call with the passed context
  return function () {
    return eval(js);
  }.call(context);
}
function DataExplorer() {
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<string>();
  async function onRequestClick() {
    request(evalInContext(`const r = this.r;${value}`, { r }).term).then(
      setData,
    );
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
      <Button onClick={onRequestClick}>Request</Button>
      <Typography className={classes.root} component="pre">
        {JSON.stringify(data, null, 2)}
      </Typography>
    </Paper>
  );
}

export { DataExplorer };
