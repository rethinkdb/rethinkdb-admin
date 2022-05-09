import React, { FunctionComponent } from 'react';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { IconButton } from '@material-ui/core';

import { ThemeState } from './state';

export type iThemeButton = {
  state: ThemeState;
  onClick: () => void;
};

export const ThemeIcon: FunctionComponent<{ state: ThemeState }> = ({
  state,
}) => {
  if (state === 'light') {
    return <Brightness7Icon />;
  }
  if (state === 'dark') {
    return <Brightness4Icon />;
  }
  return <BrightnessAutoIcon />;
};

export const ThemeButton: FunctionComponent<iThemeButton> = ({
  onClick,
  state,
}) => {
  return (
    <IconButton onClick={onClick}>
      <ThemeIcon state={state} />
    </IconButton>
  );
};
