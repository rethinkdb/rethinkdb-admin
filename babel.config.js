module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      !api.env('production') && 'react-refresh/babel',
    ].filter(Boolean),
    presets: [
      ['@babel/env', { targets: { node: 'current' } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
  };
};
