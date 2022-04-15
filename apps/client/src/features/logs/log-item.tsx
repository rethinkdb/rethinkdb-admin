import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

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

export { LogItem };
