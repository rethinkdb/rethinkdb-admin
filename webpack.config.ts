import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import StartServerPlugin from 'start-server-webpack-plugin';
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
    server: ['webpack/hot/poll?100', './src/main.ts'],
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
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
    // @ts-ignore
    // isDevelopment && new StartServerPlugin({
    //   keyboard: true,
    //   nodeArgs: ['--unhandled-rejections=strict'],
    // }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  target: 'node',
  watch: true,
});

const getClientConfig = (): webpack.Configuration => ({
  context: clientDirectory,
  devServer: {
    open: true,
    hot: true,
  },
  devtool: 'inline-source-map',
  entry: ['react-refresh/runtime', './src'],
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
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  watch: true,
});

function setupConfig(options: any) {
  return [getHttpConfig()];
}

export { getClientConfig };
export default setupConfig;
