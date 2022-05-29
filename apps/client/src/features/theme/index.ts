import React from 'react';

import { createTheme, Theme, useMediaQuery } from '@mui/material';
import { useAtom } from '@reatom/react';

import { themeAtom } from './state';
import { blueGrey, common } from '@mui/material/colors';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: blueGrey['900'],
    },
  },
});
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blueGrey['900'],
    },
    text: {
      primary: common.white,
    },
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
