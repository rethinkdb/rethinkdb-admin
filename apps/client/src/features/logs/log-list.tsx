import React, { useEffect, useState, FunctionComponent, ReactNode, useCallback } from "react";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { request } from '../../socket';
import { getAllLogsQuery } from '../../app-driver';
import { Button, Grid, Paper } from "@material-ui/core";
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }),
);

type Log = {
  id: string[];
  level: string;
  message: string;
  server: string;
  server_id: string;
  timestamp: string;
  uptime: number;
};
function useLogEntries(limit? = 20): null | Log[] {
  const [state, setState] = useState(null);
  useEffect(() => {
    request(getAllLogsQuery(limit).term).then(setState);
  }, [limit]);
  return state;
}

interface ILogItem {
  logItem: Log;
}

const ServerLink: FunctionComponent<{ logItem: Log }> = ({ logItem }) => (
  <>
    Posted by{' '}
    <Link component={NavLink} to={`/servers/${logItem.server_id}`}>
      {logItem.server}
    </Link>
  </>
);

function LogItem({ logItem }: ILogItem) {
  const classes = useStyles();
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Log" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={logItem.message}
        secondary={
          <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >
            <ServerLink logItem={logItem} /> | {logItem.timestamp}
          </Typography>
        }
      />
    </ListItem>
  );
}

const LogList: FunctionComponent = () => {
  const [count, setCount] = useState<number>(20);
  const logs = useLogEntries(count);

  const onButtonUpCount = useCallback(() => setCount(count => count + 20), []);

  if (!Array.isArray(logs)) {
    return <div>loading</div>;
  }
  return (
    <>
      {logs.length} of requested {count}
      {logs.map((logItem, index) => (
        <>
          <LogItem
            key={logItem.id[1]}
            logItem={logItem}
            primary={logItem.message}
            secondary={<ServerLink logItem={logItem} />}
          />
          {logs.length > index + 1 && (
            <Divider variant="inset" component="li" />
          )}
        </>
      ))}
      <Grid justify="center" item>
        {count <= logs.length && <Button onClick={onButtonUpCount}>Older log entries >></Button>}
      </Grid>
    </>
  );
};

function Logs() {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <List>
        <LogList />
      </List>
    </Paper>
  );
}

export { Logs };
