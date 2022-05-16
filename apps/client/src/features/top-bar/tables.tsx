import React from 'react';

import DataArrayIcon from '@mui/icons-material/DataArray';

import { useTablesNumber } from './data-hooks';
import { TopBarItem } from './top-bar-item';

export const TablesNumber = () => {
  const tablesData = useTablesNumber();
  const text =
    tablesData && `${tablesData.tablesReady}/${tablesData.tables} ready`;
  return <TopBarItem icon={DataArrayIcon} label="Tables" text={text} />;
};
