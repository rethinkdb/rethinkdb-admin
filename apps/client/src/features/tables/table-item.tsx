import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  ListItem,
  ListItemText,
  Typography,
  ListItemButton,
} from '@mui/material';

import { Done as DoneIcon, Clear as ClearIcon } from '@mui/icons-material';

import { humanizeTableReadiness } from '../utils/rethinkdb';

import { TableEntry } from './types';
import { RemoveTableModal } from './remove-table-modal';

export interface ITableItem {
  table: TableEntry;
}

export const TableListItem = React.memo(({ table }: ITableItem) => {
  const humanizedReadiness = humanizeTableReadiness(
    table.status,
    table.replicas,
    table.replicas_ready,
  );
  return (
    <ListItem
      role={undefined}
      dense
      disablePadding
      secondaryAction={
        <RemoveTableModal dbName={table.db} tableName={table.name} />
      }
    >
      <ListItemButton component={NavLink} to={`/tables/${table.id}`}>
        <ListItemText
          primary={table.name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                display="inline"
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
      </ListItemButton>
    </ListItem>
  );
});
