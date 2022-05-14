import React from 'react';
import {StyledTypography} from './styled-typography';
import { useIssues } from './data-hooks';

function Issues() {
  const issues = useIssues();
  return (
    <StyledTypography>
      {typeof issues === 'number' && issues === 0
        ? 'No issues'
        : `Issues: ${issues}`}
    </StyledTypography>
  );
}

export { Issues };
