import React, { FunctionComponent } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import Link from '@mui/material/Link';

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
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Log" />
      </ListItemAvatar>
      <ListItemText
        primary={logItem.message}
        secondary={
          <Typography
            component="span"
            variant="body2"
            sx={{ display: 'inline' }}
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
