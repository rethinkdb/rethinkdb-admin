import React, { FunctionComponent } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { ComparableTime } from '../time/relative';

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
      sx={{ display: 'inline' }}
      color="textPrimary"
    >
      {primaryCount} primary, {secondaryCount} secondaries
    </Typography>
  );
  const rightRow = (
    <Typography
      component="span"
      variant="body2"
      sx={{ display: 'inline' }}
      color="textPrimary"
    >
      {serverItem.hostname} started{' '}
      <ComparableTime date={new Date(serverItem.timeStarted)} />
    </Typography>
  );
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Server" />
      </ListItemAvatar>
      <ListItemText primary={primaryRow} secondary={secondaryRow} />
      <ListItemSecondaryAction>{rightRow}</ListItemSecondaryAction>
    </ListItem>
  );
};

export { ServerItem };
