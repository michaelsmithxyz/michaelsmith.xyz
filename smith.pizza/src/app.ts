import { Application, Request, Response, Router, Status } from '@oak/oak';
import { apiKeyHasRole } from './auth.ts';
import {
  deleteRedirect,
  generateRedirectID,
  getRedirect,
  hasRedirect,
  setRedirect,
} from './redirects.ts';
import { getStore } from './store.ts';
import { Maybe } from './types.ts';

const API_KEY_HEADER = 'X-Api-Key';

type CreateRedirectMessage = {
  target: string;
};

const isCreateRedirectMessage = (
  value: unknown,
): value is CreateRedirectMessage => (
  typeof value === 'object' &&
  value !== null &&
  Object.hasOwn(value, 'target')
);

const getApiKey = (headers: Headers): Maybe<string> => (
  headers.get(API_KEY_HEADER) ?? undefined
);

const isAuthenticatedAsAdmin = async (
  request: Request,
): Promise<boolean> => {
  const apiKey = getApiKey(request.headers);
  if (!apiKey) {
    return false;
  }
  return await apiKeyHasRole(apiKey, 'admin');
};

const badRequest = (response: Response) => {
  response.status = Status.BadRequest;
  response.body = 'Bad request';
};

const conflict = (response: Response) => {
  response.status = Status.Conflict;
  response.body = 'Conflict';
};

const created = (response: Response, body: Response['body']) => {
  response.status = Status.Created;
  response.body = body;
};

const deleted = (response: Response) => {
  response.status = Status.NoContent;
};

const forbidden = (response: Response) => {
  response.status = Status.Forbidden;
  response.body = 'Forbidden';
};

const notFound = (response: Response) => {
  response.status = Status.NotFound;
  response.body = 'Not found';
};

const permanentRedirect = (response: Response, location: string) => {
  response.status = Status.PermanentRedirect;
  response.headers.append('Location', location);
};

const indexContent = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Nothing to see here!</title>
    </head>
    <body>
        🍕 Nothing to see here!
    </body>
</html>
`;

export const makeApp = (env: Env): Application => {
  const store = getStore(env);
  const app = new Application();
  const router = new Router();

  router.get('/', ({ response }) => {
    response.type = 'html';
    response.body = indexContent;
  });

  router.get('/:key', async ({ params, response }) => {
    const { key } = params;
    const url = await getRedirect(store, key);
    if (!url) {
      return notFound(response);
    }
    console.info(`Redirect request: "${key}" => "${url}"`);
    return permanentRedirect(response, url);
  });

  router.put('/:key', async ({ params, request, response }) => {
    if (!(await isAuthenticatedAsAdmin(request))) {
      return forbidden(response);
    }

    const { key } = params;
    if (await hasRedirect(store, key)) {
      return conflict(response);
    }

    const body = await request.body.json();
    if (!isCreateRedirectMessage(body)) {
      return badRequest(response);
    }

    console.info(`Setting redirect: "${key}" => "${body.target}"`);
    await setRedirect(store, key, body.target);

    return created(response, { location: key });
  });

  router.delete('/:key', async ({ params, request, response }) => {
    if (!(await isAuthenticatedAsAdmin(request))) {
      return forbidden(response);
    }

    const { key } = params;
    if (!(await hasRedirect(store, key))) {
      return notFound(response);
    }

    console.info(`Deleting redirect: "${key}"`);
    await deleteRedirect(store, key);

    return deleted(response);
  });

  router.post('/', async ({ request, response }) => {
    if (!(await isAuthenticatedAsAdmin(request))) {
      return forbidden(response);
    }

    const body = await request.body.json();
    if (!isCreateRedirectMessage(body)) {
      return badRequest(response);
    }

    const key = generateRedirectID();
    console.info(`Setting redirect: "${key}" => "${body.target}"`);
    await setRedirect(store, key, body.target);
    return created(response, { location: key });
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
