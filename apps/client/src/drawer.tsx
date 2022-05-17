import React from 'react';

import {
  Box,
  Divider,
  Drawer,
  Grid,
  Hidden,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';

import {
  Dashboard,
  DataArray,
  Explore,
  Storage,
  TextSnippet,
} from '@mui/icons-material';

import { NavLink } from 'react-router-dom';

const drawerWidth = 280;

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const Kek = styled('div')({ flexGrow: 1 });

interface LocalDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const menuList = [
  {
    title: 'Dashboard',
    icon: Dashboard,
    url: '/',
    exact: true,
  },
  {
    icon: DataArray,
    title: 'Tables',
    url: '/tables',
  },
  {
    icon: Storage,
    title: 'Servers',
    url: '/servers',
  },
  {
    icon: TextSnippet,
    title: 'Logs',
    url: '/logs',
  },
  {
    icon: Explore,
    title: 'Data Explorer',
    url: '/dataexplorer',
  },
];
const DrawerContent = () => (
  <>
    <Offset />
    <Divider />
    <List>
      {menuList.map(({ exact, title, icon: Icon, url }) => (
        <ListItemButton
          component={NavLink}
          key={title}
          activeClassName="Mui-selected"
          to={url}
          exact={!!exact}
        >
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      ))}
    </List>
    <Kek />
    <Divider />
    <Grid container spacing={0.5}>
      <Grid item xs="auto">
        <Link
          href="https://rethinkdb.com/docs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </Link>
      </Grid>
      <Grid item xs="auto">
        <Link
          href="https://rethinkdb.com/api/"
          target="_blank"
          rel="noopener noreferrer"
        >
          API
        </Link>
      </Grid>
      <Grid item xs="auto">
        <Link
          href="https://groups.google.com/group/rethinkdb"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Groups
        </Link>
      </Grid>
      <Grid item xs="auto">
        <Link
          href="irc://chat.freenode.net/#rethinkdb"
          target="_blank"
          rel="noopener noreferrer"
        >
          #rethinkdb on freenode
        </Link>
      </Grid>
      <Grid item xs="auto">
        <Link
          href="https://github.com/rethinkdb/rethinkdb/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </Link>
      </Grid>
      <Grid item xs="auto">
        <Link
          href="https://rethinkdb.com/community/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Community
        </Link>
      </Grid>
    </Grid>
  </>
);

const LocalDrawer = ({ mobileOpen, handleDrawerToggle }: LocalDrawerProps) => (
  <Box
    component="nav"
    width={{ sm: drawerWidth }}
    flexShrink={{ sm: 0 }}
    aria-label="mailbox folders"
  >
    <Hidden smUp implementation="css">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <DrawerContent />
      </Drawer>
    </Hidden>
    <Hidden xsDown implementation="css">
      <Drawer
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        variant="permanent"
        open
      >
        <DrawerContent />
      </Drawer>
    </Hidden>
  </Box>
);

export { LocalDrawer };
