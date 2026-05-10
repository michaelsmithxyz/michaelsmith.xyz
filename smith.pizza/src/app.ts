import { Status } from '@michaelsmith.xyz/utils/http';
import { type Context, Hono } from 'hono';

import { apiKeyHasRole } from './auth.ts';
import {
  deleteRedirect,
  generateRedirectID,
  getRedirect,
  hasRedirect,
  setRedirect,
} from './redirects.ts';
import { getStore } from './store.ts';

const API_KEY_HEADER = 'X-Api-Key';

type CreateRedirectMessage = {
  target: string;
};

const isCreateRedirectMessage = (value: unknown): value is CreateRedirectMessage =>
  typeof value === 'object' && value !== null && Object.hasOwn(value, 'target');

const isAuthenticatedAsAdmin = async (c: Context): Promise<boolean> => {
  const apiKey = c.req.header(API_KEY_HEADER);
  if (!apiKey) {
    return false;
  }
  return await apiKeyHasRole(apiKey, 'admin');
};

const badRequest = (c: Context) => {
  c.status(Status.BadRequest);
  return c.text('Bad request');
};

const conflict = (c: Context) => {
  c.status(Status.Conflict);
  return c.text('Conflict');
};

const created = <T extends object>(c: Context, body: T) => {
  c.status(Status.Created);
  return c.json(body);
};

const deleted = (c: Context) => {
  c.status(Status.NoContent);
  return c.body(null);
};

const forbidden = (c: Context) => {
  c.status(Status.Forbidden);
  return c.text('Forbidden');
};

const notFound = (c: Context) => {
  c.status(Status.NotFound);
  return c.text('Not found');
};

const permanentRedirect = (c: Context, location: string) =>
  c.redirect(location, Status.PermanentRedirect);

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

export const makeApp = (env: Env): Hono => {
  const store = getStore(env);
  const app = new Hono();

  app.get('/', (c) => c.html(indexContent));

  app.get('/:key', async (c) => {
    const key = c.req.param('key');
    const url = await getRedirect(store, key);
    if (!url) {
      return notFound(c);
    }
    console.info(`Redirect request: "${key}" => "${url}"`);
    return permanentRedirect(c, url);
  });

  app.put('/:key', async (c) => {
    if (!(await isAuthenticatedAsAdmin(c))) {
      return forbidden(c);
    }

    const key = c.req.param('key');
    if (await hasRedirect(store, key)) {
      return conflict(c);
    }

    const body = await c.req.json();
    if (!isCreateRedirectMessage(body)) {
      return badRequest(c);
    }

    console.info(`Setting redirect: "${key}" => "${body.target}"`);
    await setRedirect(store, key, body.target);

    return created(c, { location: key });
  });

  app.delete('/:key', async (c) => {
    if (!(await isAuthenticatedAsAdmin(c))) {
      return forbidden(c);
    }

    const key = c.req.param('key');
    if (!(await hasRedirect(store, key))) {
      return notFound(c);
    }

    console.info(`Deleting redirect: "${key}"`);
    await deleteRedirect(store, key);

    return deleted(c);
  });

  app.post('/', async (c) => {
    if (!(await isAuthenticatedAsAdmin(c))) {
      return forbidden(c);
    }

    const body = await c.req.json();
    if (!isCreateRedirectMessage(body)) {
      return badRequest(c);
    }

    const key = generateRedirectID();
    console.info(`Setting redirect: "${key}" => "${body.target}"`);
    await setRedirect(store, key, body.target);
    return created(c, { location: key });
  });

  return app;
};
