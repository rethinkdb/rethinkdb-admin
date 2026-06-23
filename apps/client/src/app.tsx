import React, { StrictMode } from 'react';

import { HashRouter as Router } from 'react-router-dom';
import {
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  styled,
  SvgIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { reatomContext, useAtom } from '@reatom/react';

import { AppBar, Drawer, drawerWidth } from './features/navigation';
import { AppRoutes } from './features/routes';
import { store } from './features/store';
import { useTheme } from './features/theme';
import { TopBar } from './features/top-bar';

import './features/rethinkdb';
import {useConnectedState} from './features/connection/use-connected-state';
import {ThemeButton} from './features/theme/theme-button';
import { themeAtom } from './features/theme/state';
import { HasUpdate } from './features/update/has-update';

const { Provider: StateProvider } = reatomContext;

const Root = styled('div')`
  display: flex;
`;

const ContentWrapper = styled('main')`
  flex-grow: 1;
  width: calc(100% - ${drawerWidth}px);
`;

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const App = () => (
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
  const connState = useConnectedState();

  return (
    <Root>
      <CssBaseline />
      <AppBar position="fixed">
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
          <SvgIcon>
            {connState === 'connected' ? <CheckIcon /> : <DoDisturbIcon   />}
          </SvgIcon>
          <ThemeButton
            state={themeState}
            onClick={() => {
              store.dispatch(themeAtom.changeThemeState());
            }}
          />
        </Toolbar>
      </AppBar>
      <Drawer handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
      <ContentWrapper>
        <Offset />
        <HasUpdate />
        <TopBar />
        <AppRoutes />
      </ContentWrapper>
    </Root>
  );
};

export default App;
