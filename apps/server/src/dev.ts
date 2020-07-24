import webpack from "webpack";
import webpackDevMiddleware from 'webpack-dev-middleware';

import { getClientConfig } from '../../../webpack.config';

const config = getClientConfig();

function initDev(app: any) {
  console.log(config.output.publicPath);
  const instance = webpackDevMiddleware(webpack(config));
  app.use(instance);
}

export { initDev };
