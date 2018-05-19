import * as Router from 'koa-router';
import feed from './feed';

const router = new Router();

const apiRouter = router.prefix('/ps');

[
  feed,
].forEach((moduleRoute: (router: Router) => void) => {
  moduleRoute(apiRouter);
});

export default () => router.middleware();
