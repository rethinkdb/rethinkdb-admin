import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

import { TableEntry, TableStatus } from './types';

const useStyles = makeStyles({ inline: { display: 'inline' } });

export interface ITableItem {
  table: TableEntry;
}

export const TableListItem: FunctionComponent<ITableItem> = React.memo(
  ({ table }) => {
    const classes = useStyles();

    const humanizedReadiness = humanizeTableReadiness(
      table.status,
      table.replicas,
      table.replicas_ready,
    );
    return (
      <ListItem
        component={NavLink}
        to={`/tables/${table.id}`}
        role={undefined}
        dense
        button
        // onClick={handleToggle(value)}
      >
        {/*<ListItemIcon>*/}
        {/*  <Checkbox*/}
        {/*    edge="start"*/}
        {/*    checked={checked.indexOf(value) !== -1}*/}
        {/*    tabIndex={-1}*/}
        {/*    disableRipple*/}
        {/*    inputProps={{ 'aria-labelledby': labelId }}*/}
        {/*  />*/}
        {/*</ListItemIcon>*/}
        <ListItemText
          id={table.id}
          primary={table.name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {table.shards} shard(s), {table.replicas} replica(s)
              </Typography>
              {' - '}
              {humanizedReadiness.label === 'failure' ? (
                <ClearIcon fontSize="inherit" />
              ) : (
                <DoneIcon fontSize="inherit" />
              )}
              {humanizedReadiness.value}
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="comments">
            <CommentIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  },
);

export function humanizeTableStatus(status: TableStatus) {
  if (!status) return '';
  if (status.all_replicas_ready || status.ready_for_writes) return 'Ready';
  if (status.ready_for_reads) return 'Reads only';
  if (status.ready_for_outdated_reads) return 'Outdated reads';
  return 'Unavailable';
}

export type HumanizedReadiness = {
  label: 'failure' | 'success' | 'partial-success';
  value: string;
};
export function humanizeTableReadiness(
  status: TableStatus,
  replicas: number,
  replicasReady: number,
): HumanizedReadiness {
  if (!status) {
    return {
      label: 'failure',
      value: 'unknown',
    };
  }
  if (status.all_replicas_ready) {
    return {
      label: 'success',
      value: `${humanizeTableStatus(status)} ${replicas}/${replicasReady}`,
    };
  }
  if (status.ready_for_writes) {
    return {
      label: 'partial-success',
      value: `${humanizeTableStatus(status)} ${replicas}/${replicasReady}`,
    };
  }

  return {
    label: 'failure',
    value: humanizeTableStatus(status),
  };

  // return new Handlebars.SafeString(
  //   "<div class='status label label-#{label}'>#{value}</div>",
  // );
}
