import React from 'react';
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
import { LocalDrawer } from './drawer';
import { StrictMode } from 'react';
import { store } from './store';
import { HashRouter as Router } from 'react-router-dom';
import { context } from '@reatom/react';

import { Routes } from './routes';
import './socket';
import { TopBar } from './top-bar/top-bar';
import { useTheme } from './features/theme';

const drawerWidth = 280;
const { Provider: StateProvider } = context;

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

function App() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };
  const theme = useTheme();

  return (
    <StrictMode>
      <Router>
        <StateProvider value={store}>
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
                  <Typography variant="h6" noWrap>
                    RethinkDB Administration Console
                  </Typography>
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
        </StateProvider>
      </Router>
    </StrictMode>
  );
}

export default App;
