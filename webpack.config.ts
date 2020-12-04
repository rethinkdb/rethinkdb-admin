import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { RunScriptWebpackPlugin } from "run-script-webpack-plugin";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const env = { ...process.env };

const rootDir = process.cwd();

const appsDir = path.resolve(rootDir, 'apps');
const clientDirectory = path.resolve(appsDir, 'client');
const httpDirectory = path.resolve(appsDir, 'server');

const isProduction = env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const mode = isProduction ? 'production' : 'development';

const getHttpConfig = (): webpack.Configuration => ({
  context: httpDirectory,
  entry: {
    server: [isDevelopment && 'webpack/hot/poll?100', './src/main.ts'].filter(Boolean),
  },
  // @ts-ignore
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
    path: path.resolve(__dirname, 'build'),
  },
  // @ts-ignore
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    isDevelopment && new RunScriptWebpackPlugin({
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
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.[fullhash].js',
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: 'whm' } }),
    new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    // new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    new HtmlWebpackPlugin({
      title: 'Caching',
      template: 'static/index.html',
    }),
    // new CopyWebpackPlugin({ patterns: [{ from: 'static' }] }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  }
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
