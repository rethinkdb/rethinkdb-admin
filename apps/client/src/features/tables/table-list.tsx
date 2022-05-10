import React, { FunctionComponent } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import Checkbox from '@material-ui/core/Checkbox';

import { TableEntry } from './types';
import { TableListItem } from './table-item';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }),
);

export const TableList: FunctionComponent<{ tables: TableEntry[] }> =
  React.memo(({ tables }) => {
    const classes = useStyles();

    return (
      <List className={classes.root}>
        {tables.map((table, index) => (
          <React.Fragment key={table.id}>
            <TableListItem table={table} />
            {tables.length > index + 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    );
  });
