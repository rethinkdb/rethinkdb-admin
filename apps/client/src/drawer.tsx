import React, { FunctionComponent } from 'react';

import {
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';

import ComputerIcon from '@mui/icons-material/Computer';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import ExploreIcon from '@mui/icons-material/Explore';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { NavLink } from 'react-router-dom';

const drawerWidth = 280;

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const Kek = styled('div')({ flexGrow: 1 });

const Links = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
  '& > * + *': {
    marginLeft: theme.spacing(2),
  },
}));

interface LocalDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const menuList = [
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    url: '/',
    exact: true,
  },
  {
    icon: DataUsageIcon,
    title: 'Tables',
    url: '/tables',
  },
  {
    icon: ComputerIcon,
    title: 'Servers',
    url: '/servers',
  },
  {
    icon: ListIcon,
    title: 'Logs',
    url: '/logs',
  },
  {
    icon: ExploreIcon,
    title: 'Data Explorer',
    url: '/dataexplorer',
  },
];

const LocalDrawer: FunctionComponent<LocalDrawerProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const drawerContent = (
    <>
      <Offset />
      <Divider />
      <List>
        {menuList.map(({ exact, title, icon: Icon, url }) => (
          <ListItem
            component={NavLink}
            button
            key={title}
            activeClassName="Mui-selected"
            to={url}
            exact={!!exact}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
      <Kek />
      <Divider />
      <Links>
        <Link
          href="http://rethinkdb.com/docs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </Link>
        <Link
          href="http://rethinkdb.com/api/"
          target="_blank"
          rel="noopener noreferrer"
        >
          API
        </Link>
        <Link
          href="http://groups.google.com/group/rethinkdb"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Groups
        </Link>
        <Link
          href="irc://chat.freenode.net/#rethinkdb"
          target="_blank"
          rel="noopener noreferrer"
        >
          #rethinkdb on freenode
        </Link>
        <Link
          href="https://github.com/rethinkdb/rethinkdb/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </Link>
        <Link
          href="http://rethinkdb.com/community/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Community
        </Link>
      </Links>
    </>
  );
  return (
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
          {drawerContent}
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
          {drawerContent}
        </Drawer>
      </Hidden>
    </Box>
  );
};

export { LocalDrawer };
