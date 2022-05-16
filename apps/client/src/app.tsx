import React, { FunctionComponent, StrictMode } from 'react';

import { HashRouter as Router } from 'react-router-dom';
import {
  AppBar,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { reatomContext, useAtom } from '@reatom/react';

import { LocalDrawer } from './drawer';
import { Routes } from './features/routes';
import { store } from './features/store';
import { useTheme } from './features/theme';
import { TopBar } from './features/top-bar';

import './features/rethinkdb/socket';
import { ThemeButton } from './features/theme/theme-button';
import { themeAtom } from './features/theme/state';
import { HasUpdate } from './features/update/has-update';

const drawerWidth = 280;
const { Provider: StateProvider } = reatomContext;

const Root = styled('div')`
  display: flex;
`;

const ContentWrapper = styled('main')`
  flex-grow: 1;
`;

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const App: FunctionComponent = () => (
  <StrictMode>
    {/* TODO fix Router weird ts error */}
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
    <Router>
      <StateProvider value={store}>
        <ThemedContent />
      </StateProvider>
    </Router>
  </StrictMode>
);

export const ThemedContent = () => {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <AppInnerContent />
    </ThemeProvider>
  );
};

export const AppInnerContent = () => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };
  const [themeState] = useAtom(themeAtom);
  return (
    <Root>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          magrinLeft: drawerWidth,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              marginRight: 2,
              display: { sm: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography flexGrow={1} variant="h6" noWrap>
            RethinkDB Administration Console
          </Typography>
          <ThemeButton
            state={themeState}
            onClick={() => {
              store.dispatch(themeAtom.changeThemeState());
            }}
          />
        </Toolbar>
      </AppBar>
      <LocalDrawer
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />
      <ContentWrapper>
        <Offset />
        <HasUpdate />
        <TopBar />
        <Routes />
      </ContentWrapper>
    </Root>
  );
};

export default App;
