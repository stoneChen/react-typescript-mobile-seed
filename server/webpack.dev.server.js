const log = require('fary-log');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

function start() {
  return new Promise((resolve, reject) => {
    const logger = log('app:webpack.dev.server');
    const serverConfig = require('../server.config');
    const webpackDevConfig = require('../webpack.client.dev.conf');

    const port = serverConfig.port + 100;
    const options = {
      // clientLogLevel: 'warning',
      compress: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      hot: true,
      // host与port必须，否则热替换的host会有问题，因为socket服务与app主服务不是同一个
      host: require('ip').address(),
      port,
      open: false,
      overlay: true,
      publicPath: webpackDevConfig.output.publicPath,
      quiet: true,
      stats: {
        chunks: false,
        colors: true,
      },
    };

    // 热替换必须
    WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, options);
    const compiler = webpack(webpackDevConfig);
    const devServer = new WebpackDevServer(compiler, options);
    // 这里host设置为0.0.0.0是为了node发请求过来，使用localhost比较方便
    devServer.listen(port, '0.0.0.0', (err) => {
      if (err) {
        reject(err);
      } else {
        logger.info(`Webpack dev server is listening at ${port}...`);
        resolve();
      }
    });
  });
}

// start();
module.exports = {
  start,
}