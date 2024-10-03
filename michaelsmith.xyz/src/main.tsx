import { render } from 'preact-render-to-string';
import { Application, Router } from '@oak/oak';
import { Home } from '../src/Home.tsx';
import { assetsMiddleware } from './middleware/assets.ts';

export const makeApp = (): Application => {
  const app = new Application();
  const router = new Router();

  router.get('/', ({ response }) => {
    response.type = 'html';
    response.body = render(<Home />);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(assetsMiddleware());

  return app;
};

const app = makeApp();
await app.listen({ port: 1997 });
