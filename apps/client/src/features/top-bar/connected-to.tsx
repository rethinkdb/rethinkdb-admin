import React from 'react';


import {StyledTypography} from './styled-typography';
import { useConnectedTo } from './data-hooks';

const ConnectedTo = React.memo(() => {
  const connectedToData = useConnectedTo();
  return (
    <StyledTypography>
      {connectedToData && `Connected to ${connectedToData.name}`}
    </StyledTypography>
  );
});

export { ConnectedTo };
