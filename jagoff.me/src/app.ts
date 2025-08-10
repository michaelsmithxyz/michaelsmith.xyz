import { Application, Response, Router, Status } from '@oak/oak';

const temporaryRedirect = (
  response: Response,
  location: string,
) => {
  response.status = Status.TemporaryRedirect;
  response.headers.append('Location', location);
};

export const makeApp = (): Application => {
  const app = new Application();
  const router = new Router();

  router.get('/', ({ response }) => {
    return temporaryRedirect(
      response,
      'https://www.jaguars.com',
    );
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
