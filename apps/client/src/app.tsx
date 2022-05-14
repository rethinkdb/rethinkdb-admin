import React, { FunctionComponent, StrictMode } from 'react';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Theme,
  createStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import styled from 'styled-components';
import { HashRouter as Router } from 'react-router-dom';
import { reatomContext, useAtom } from '@reatom/react';

import { LocalDrawer } from './drawer';
import { useTheme } from './features/theme';
import { Routes } from './features/routes';
import { store } from './store';
import { TopBar } from './features/top-bar/top-bar';

import './features/rethinkdb/socket';
import { ThemeButton } from './features/theme/theme-button';
import { themeAtom } from './features/theme/state';

const drawerWidth = 280;
const { Provider: StateProvider } = reatomContext;

const Root = styled.div`
  display: flex;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    title: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      padding: theme.spacing(3),
    },
  }),
);

const App: FunctionComponent = () => {
  return (
    <StrictMode>
      <Router>
        <StateProvider value={store}>
          <AppContent />
        </StateProvider>
      </Router>
    </StrictMode>
  );
};

export const AppContent = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };
  const [themeState] = useAtom(themeAtom);
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <Root>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
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
        <ContentWrapper className={classes.content}>
          <div className={classes.toolbar} />
          <TopBar />
          <Routes />
        </ContentWrapper>
      </Root>
    </ThemeProvider>
  );
};

export default App;
