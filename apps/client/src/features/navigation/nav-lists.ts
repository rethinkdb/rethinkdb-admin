import {
  Dashboard,
  DataArray,
  Explore,
  Storage,
  TextSnippet,
} from '@mui/icons-material';

export const menuList = [
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

export const linkList = [
  {
    url: 'https://rethinkdb.com/docs/',
    text: 'Documentation',
  },
  {
    url: 'https://rethinkdb.com/api/',
    text: 'API',
  },
  {
    url: 'https://groups.google.com/group/rethinkdb',
    text: 'Google Groups',
  },
  {
    url: 'irc://chat.freenode.net/#rethinkdb',
    text: '#rethinkdb on freenode',
  },
  {
    url: 'https://github.com/rethinkdb/rethinkdb',
    text: 'Github',
  },
  {
    url: 'https://rethinkdb.com/community/',
    text: 'Community',
  },
];
