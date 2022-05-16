import React from 'react';

import BuildIcon from '@mui/icons-material/Build';

import { useIssues } from './data-hooks';
import { TopBarItem } from './top-bar-item';

export const Issues = () => {
  const issues = useIssues();
  const text =
    typeof issues === 'number' && issues === 0
      ? 'No issues'
      : `Issues: ${issues}`;
  return <TopBarItem icon={BuildIcon} label="Issues" text={text} />;
};
