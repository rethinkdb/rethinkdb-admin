import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({ inline: { display: 'inline' } });

export type Server = {
  id: string;
  name: string;
  tags: string[];
  timeStarted: string;
  hostname: string
  cacheSize: string;
  primaryCount: number;
  secondaryCount: number;
};

export interface IServerItem {
  serverItem: Server;
}

function ServerItem({ serverItem }: IServerItem) {
  const classes = useStyles();

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Server" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={serverItem.name}
        secondary={
          <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >
            {serverItem.tags.join(',')} | {serverItem.primaryCount} primary, {serverItem.secondaryCount} secondaries | {serverItem.hostname} started at {serverItem.timeStarted}
          </Typography>
        }
      />
    </ListItem>
  );
}

export { ServerItem };
