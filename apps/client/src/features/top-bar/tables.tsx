import React from 'react';

import { useTablesNumber } from './data-hooks';
import { StyledTypography } from './styled-typography';

const TablesNumber = React.memo(() => {
  const tablesData = useTablesNumber();
  return (
    <StyledTypography>
      {tablesData && `Tables: ${tablesData.tablesReady}/${tablesData.tables}`}
    </StyledTypography>
  );
});

export { TablesNumber };
