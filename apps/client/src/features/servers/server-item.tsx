import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { ComparableTime, compareToNow } from '../time/relative';

const useStyles = makeStyles({ inline: { display: 'inline' } });

export type Server = {
  id: string;
  name: string;
  tags: string[];
  timeStarted: string;
  hostname: string;
  cacheSize: string;
  primaryCount: number;
  secondaryCount: number;
};

export interface IServerItem {
  serverItem: Server;
}

const ServerItem: FunctionComponent<IServerItem> = ({
  serverItem,
}: IServerItem) => {
  const classes = useStyles();
  const { primaryCount, secondaryCount } = serverItem;
  const primaryRow = (
    <>
      {serverItem.name}
      <div style={{ display: 'inline', marginLeft: '8px' }}>
        {serverItem.tags.map((tag) => (
          <Chip key={tag} color="primary" label={tag} size="small" />
        ))}
      </div>
    </>
  );
  const secondaryRow = (
    <Typography
      component="span"
      variant="body2"
      className={classes.inline}
      color="textPrimary"
    >
      {primaryCount} primary, {secondaryCount} secondaries
    </Typography>
  );
  const rightRow = (
    <Typography
      component="span"
      variant="body2"
      className={classes.inline}
      color="textPrimary"
    >
      {serverItem.hostname} started{' '}
      <ComparableTime date={new Date(serverItem.timeStarted)} /> ago
    </Typography>
  );
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Server" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText primary={primaryRow} secondary={secondaryRow} />
      <ListItemSecondaryAction>{rightRow}</ListItemSecondaryAction>
    </ListItem>
  );
};

export { ServerItem };
