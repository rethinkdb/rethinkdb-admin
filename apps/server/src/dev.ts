import { INestApplication } from '@nestjs/common';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { getClientConfig } from '../../../webpack.config';

function initDev(app: INestApplication) {
  const config = getClientConfig();
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler));
}

export { initDev };
