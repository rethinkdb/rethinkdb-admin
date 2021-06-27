import { resolve } from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const rootDir = process.cwd();

const appsDir = resolve(rootDir, 'apps');
const clientDirectory = resolve(appsDir, 'client');
const httpDirectory = resolve(appsDir, 'server');
const buildDirectory = resolve(rootDir, 'build');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const mode = isProduction ? 'production' : 'development';

const getHttpConfig = (): webpack.Configuration => ({
  context: httpDirectory,
  entry: {
    server: [isDevelopment && 'webpack/hot/poll?100', './src/main.ts'].filter(
      Boolean,
    ),
  },
  externals: [nodeExternals({ allowlist: ['webpack/hot/poll?100'] })],
  mode,
  module: {
    rules: [
      {
        test: /.*((?!spec).).tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: buildDirectory,
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment &&
      new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    isDevelopment &&
      new RunScriptWebpackPlugin({
        name: 'server.js',
        keyboard: true,
        nodeArgs: ['--unhandled-rejections=strict'],
      }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  target: 'node',
});

const getClientConfig = (): webpack.Configuration => ({
  context: clientDirectory,
  // @ts-ignore
  devServer: {
    open: isDevelopment,
    hot: isDevelopment,
  },
  devtool: 'inline-source-map',
  entry: [isDevelopment && 'react-refresh/runtime', './src'].filter(Boolean),
  mode,
  module: {
    rules: [
      {
        test: /.*((?!spec).).tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  output: {
    path: buildDirectory,
    filename: 'app.[fullhash].js',
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment &&
      new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: 'whm' } }),
    isDevelopment &&
      new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    // new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    new HtmlWebpackPlugin({
      inject: false,
      title: 'RethinkDB Administration Console',
      template: 'templates/index.ejs',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyWebpackPlugin({ patterns: [{ from: 'static' }] }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
});

function setupConfig() {
  const configs = [getHttpConfig()];
  if (isProduction) {
    configs.push(getClientConfig());
  }
  return configs;
}

export { getClientConfig };
export default setupConfig;
