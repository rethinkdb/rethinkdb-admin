import React from 'react';

import { TableEntry } from './types';
import { TableListItem } from './table-item';
import { Divider, List, styled } from '@mui/material';

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

export const TableList = React.memo(({ tables }: { tables: TableEntry[] }) => (
  <StyledList>
    {tables.map((table, index) => (
      <React.Fragment key={table.id}>
        <TableListItem table={table} />
        {tables.length > index + 1 && (
          <Divider variant="inset" component="li" />
        )}
      </React.Fragment>
    ))}
  </StyledList>
));
