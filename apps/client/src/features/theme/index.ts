import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { useAtom } from '@reatom/react';

import { themeAtom } from './state';

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});
const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function useTheme(): Theme {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeState] = useAtom(themeAtom);

  return React.useMemo(() => {
    if (themeState === 'light') {
      return lightTheme;
    }
    if (themeState === 'dark') {
      return darkTheme;
    }
    return prefersDarkMode ? darkTheme : lightTheme;
  }, [prefersDarkMode, themeState]);
}

export { lightTheme, darkTheme, useTheme };
