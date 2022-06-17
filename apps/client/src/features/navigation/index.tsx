import React from 'react';

import {
  AppBar as BaseAppBar,
  AppBarProps,
  Box,
  Divider,
  Drawer as BaseDrawer,
  Grid,
  Hidden,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

import { NavLink } from '../../atoms/link';
import { linkList, menuList } from './nav-lists';

const drawerWidth = 280;

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const FlexGrowDiv = styled('div')({ flexGrow: 1 });

export const AppBar = styled(BaseAppBar)<AppBarProps>(({ theme }) => ({
  [theme.breakpoints.up('md')]: { width: `calc(100% - ${drawerWidth}px)` },
  marginLeft: drawerWidth,
}));

type NavItemProps = {
  exact?: boolean;
  title: string;
  icon: SvgIconComponent;
  url: string;
};

const NavItem = ({ exact, title, icon: Icon, url }: NavItemProps) => (
  <ListItemButton component={NavLink} key={title} to={url} end={!!exact}>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={title} />
  </ListItemButton>
);

const DrawerContent = () => (
  <>
    <Offset />
    <Divider />
    <List>
      {menuList.map(({ exact, title, icon, url }) => (
        <NavItem exact={exact} title={title} icon={icon} url={url} />
      ))}
    </List>
    <FlexGrowDiv />
    <Divider />
    <Grid container spacing={0.5}>
      {linkList.map((item) => (
        <Grid item xs="auto" key={item.url}>
          <Link href={item.url} target="_blank" rel="noopener noreferrer">
            {item.text}
          </Link>
        </Grid>
      ))}
    </Grid>
  </>
);

const drawerSxStyles = {
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: drawerWidth,
  },
};

export type DrawerProps = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

export const Drawer = ({ mobileOpen, handleDrawerToggle }: DrawerProps) => (
  <Box component="nav" width={{ sm: drawerWidth }} flexShrink={{ sm: 0 }}>
    <Hidden smUp implementation="css">
      <BaseDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', sm: 'none' }, ...drawerSxStyles }}
        ModalProps={{ keepMounted: true }}
      >
        <DrawerContent />
      </BaseDrawer>
    </Hidden>
    <Hidden xsDown implementation="css">
      <BaseDrawer
        sx={{ display: { xs: 'none', sm: 'block' }, ...drawerSxStyles }}
        variant="permanent"
        open
      >
        <DrawerContent />
      </BaseDrawer>
    </Hidden>
  </Box>
);
