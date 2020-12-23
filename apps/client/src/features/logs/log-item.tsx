import React, { FunctionComponent } from "react";
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles({ inline: { display: 'inline' } });

export type Log = {
  id: string[];
  level: string;
  message: string;
  server: string;
  server_id: string;
  timestamp: string;
  uptime: number;
};

export interface ILogItem {
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

export { LogItem }
