import React, { StrictMode } from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { reatomContext } from '@reatom/react';
import { HashRouter as Router } from 'react-router-dom';

import { LocalDrawer } from './drawer';
import { useTheme } from './features/theme';
import { AppRoutes } from './appRoutes';
import { store } from './store';
import { TopBar } from './top-bar/top-bar';
import './socket';
import { Box } from '@mui/material';

const drawerWidth = 280;
const { Provider: StateProvider } = reatomContext;

const useStyles = makeStyles((theme) =>
  createStyles({
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

export function AppContent() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            sx={{ display: { lg: 'none' } }}
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
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <div className={classes.toolbar} />
        <TopBar />
        <AppRoutes />
      </Box>
    </Box>
  );
}

export function App() {
  const theme = useTheme();

  return (
    <StrictMode>
      <Router>
        <StateProvider value={store}>
          <ThemeProvider theme={theme}>
            <AppContent />
          </ThemeProvider>
        </StateProvider>
      </Router>
    </StrictMode>
  );
}
