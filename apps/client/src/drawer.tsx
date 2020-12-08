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
import DataUsageIcon from '@material-ui/icons/DataUsage';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

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
    url: '/'
  },
  {
    icon: DataUsageIcon,
    title: 'Tables',
    url: '/tables'
  },
  {
    icon: ComputerIcon,
    title: 'Servers',
    url: '/servers'
  },
  {
    icon: ListIcon,
    title: 'Logs',
    url: '/logs'
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
        {menuList.map(({ title, icon: Icon, url }) => (
          <ListItem component={NavLink} button key={title} activeClassName="Mui-selected" to={url}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
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
