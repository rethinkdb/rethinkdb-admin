import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import StartServerPlugin from 'start-server-webpack-plugin';

const env = { ...process.env };

const appsDir = path.resolve(__dirname, 'apps');
const clientDirectory = path.resolve(appsDir, 'client');
const httpDirectory = path.resolve(appsDir, 'server');
const electronDirectory = path.resolve(appsDir, 'electron');

const PRODUCTION = env.NODE_ENV === 'production';

const mode = PRODUCTION ? 'production' : 'development';

const getElectronConfig = (): webpack.Configuration => ({
  context: electronDirectory,
  entry: {
    electron: ['webpack/hot/poll?100', './src/main.ts'],
  },
  externals: [nodeExternals({whitelist: ['webpack/hot/poll?100']})],
  mode,
  module: {
    rules: [{test: /.*((?!spec).).tsx?$/, use: 'ts-loader', exclude: /node_modules/}],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  parallelism: 5,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new StartServerPlugin({keyboard: true}),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  target: 'electron-main',
  watch: true,
  watchOptions: {
    aggregateTimeout: 600,
  },
});

const getHttpConfig = (): webpack.Configuration => ({
  context: httpDirectory,
  entry: {
    server: ['webpack/hot/poll?100', './src/main.ts'],
  },
  externals: [nodeExternals({whitelist: ['webpack/hot/poll?100']})],
  mode,
  module: {
    rules: [{test: /.*((?!spec).).tsx?$/, use: 'ts-loader', exclude: /node_modules/}],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  parallelism: 5,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new StartServerPlugin({ keyboard: true }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  target: 'node',
  watch: true,
  watchOptions: {
    aggregateTimeout: 600,
  },
});

const getClientConfig = (): webpack.Configuration => ({
  context: clientDirectory,
  entry: {
    client: ['webpack/hot/poll?100', './src/main.ts'],
  },
  externals: [nodeExternals({whitelist: ['webpack/hot/poll?100']})],
  mode,
  module: {
    rules: [{test: /.*((?!spec).).tsx?$/, use: 'ts-loader', exclude: /node_modules/}],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  parallelism: 5,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  watch: true,
});

function setupConfig() {
  const isElectron = env.ENV === 'electron';
  const isHttp = env.ENV === 'http';
  console.log('isElectron', isElectron);
  console.log('isHttp', isHttp);

  const configs = [getClientConfig()];
  if (isElectron) {
    configs.push(getElectronConfig());
  }
  if (isHttp) {
    configs.push(getHttpConfig());
  }
  return configs;
}

export default setupConfig;
