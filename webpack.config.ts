import { resolve } from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';
import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';

const rootDir = process.cwd();

const appsDir = resolve(rootDir, 'apps');
const clientDirectory = resolve(appsDir, 'client');
const httpDirectory = resolve(appsDir, 'server');
const buildDirectory = resolve(rootDir, 'build');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
const isAnalyzing = process.env.ANALYZE === 'true';
const mode = isProduction ? 'production' : 'development';

export const getBackendConfig = (): webpack.Configuration => ({
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
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
        use: 'ts-loader',
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

export const getClientConfig = (): webpack.Configuration & {
  devServer: any;
} => ({
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  context: clientDirectory,
  devServer: {
    open: isDevelopment,
    hot: isDevelopment,
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  entry: [
    isDevelopment && 'react-refresh/runtime',
    isDevelopment && 'webpack-hot-middleware/client',
    './src',
  ].filter(Boolean),
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
    isAnalyzing && new BundleAnalyzerPlugin(),
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
    fallback: { crypto: false },
  },
});

function setupConfig() {
  const configs = [getBackendConfig()];
  if (isProduction) {
    configs.push(getClientConfig());
  }
  return configs;
}

export default setupConfig;
