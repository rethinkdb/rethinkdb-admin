import React, { FunctionComponent } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

import { TableEntry, TableStatus } from './types';
import {RemoveTableModal} from "./remove-table-modal";

export interface ITableItem {
  table: TableEntry;
}

export const TableListItem: FunctionComponent<ITableItem> = React.memo(
  ({ table }) => {
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
                sx={{ display: 'inline' }}
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
          <RemoveTableModal dbName={table.db} tableName={table.name}/>
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
