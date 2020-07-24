import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { CheckerPlugin } from 'awesome-typescript-loader';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import StartServerPlugin from 'start-server-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const env = { ...process.env };

const rootDir = process.cwd();

const appsDir = path.resolve(rootDir, 'apps');
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
  // @ts-ignore
  externals: [nodeExternals({ allowlist: ['webpack/hot/poll?100'] })],
  mode,
  module: {
    rules: [
      {
        test: /.*((?!spec).).ts$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CheckerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new StartServerPlugin({ keyboard: true }),
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
  // @ts-ignore
  externals: [nodeExternals({ allowlist: ['webpack/hot/poll?100'] })],
  mode,
  module: {
    rules: [
      {
        test: /.*((?!spec).).tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new StartServerPlugin({
      keyboard: true,
      nodeArgs: ['--unhandled-rejections=strict'],
    }),
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
  devServer: {
    open: true,
    hot: true,
  },
  devtool: 'inline-source-map',
  entry: ['react-hot-loader/patch', './src'],
  mode,
  module: {
    rules: [
      {
        test: /.*((?!spec).).tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.[hash].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    new HtmlWebpackPlugin({
      title: 'Caching',
      template: 'static/index.html',
    }),
    // new CopyWebpackPlugin({ patterns: [{ from: 'static' }] }),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
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

export { getClientConfig };
export default setupConfig;
