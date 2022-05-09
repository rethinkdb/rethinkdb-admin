import React, { FunctionComponent } from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import ComputerIcon from '@material-ui/icons/Computer';
import DashboardIcon from '@material-ui/icons/Dashboard';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';
import ExploreIcon from '@material-ui/icons/Explore';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { Link } from '@material-ui/core';

const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    links: {
      margin: theme.spacing(2),
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    kek: {
      flexGrow: 1,
    },
  }),
);

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
  const classes = useStyles();

  const drawerContent = (
    <>
      <div className={classes.toolbar} />
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
      <div className={classes.kek} />
      <Divider />
      <div className={classes.links}>
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
      </div>
    </>
  );
  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{ paper: classes.drawerPaper }}
          variant="permanent"
          open
        >
          {drawerContent}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export { LocalDrawer };
