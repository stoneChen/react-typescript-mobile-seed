import * as createApp from 'fary';
import * as serverConfig from '../server.config';
import spaMiddleware from './middlewares/spa';
import routesMiddleware from './routes';

createApp({
  middlewares: [
    spaMiddleware(),
    routesMiddleware(),
  ],
}, () => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  const ip = require('ip').address();
  require('react-dev-utils/openBrowser')(`http://${ip}:${serverConfig.port}`);
});
