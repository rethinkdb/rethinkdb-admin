import React from 'react';

import { useServersNumber } from './data-hooks';
import {StyledTypography} from "./styled-typography";

function ServersConnected() {
  const serversNumber = useServersNumber();
  return (
    <StyledTypography>
      Servers: {serversNumber} connected
    </StyledTypography>
  );
}

export { ServersConnected };
