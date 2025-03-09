import { Status } from '@oak/oak';
import { after, before, describe, it } from 'jsr:@std/testing/bdd';
import { assertEquals } from '@std/assert';
import { makeApp } from './app.ts';
import { loadConfig } from './config.ts';
import { exportApiKey, signApiKey } from './crypto.ts';

await loadConfig('.env.test');

describe('smith.pizza integration tests', () => {
  let port = 0;
  const appAbortController = new AbortController();

  let admin_api_key = '';
  let not_admin_api_key = '';

  before(async () => {
    const app = makeApp();

    admin_api_key = exportApiKey(
      await signApiKey({
        id: 'admin',
        roles: [
          'admin',
        ],
      }),
    );

    not_admin_api_key = exportApiKey(
      await signApiKey({
        id: 'not_admin',
        roles: [],
      }),
    );

    await new Promise<void>((resolve) => {
      app.addEventListener('listen', (ev) => {
        port = ev.port;
        resolve();
      });

      app.listen({
        signal: appAbortController.signal,
      });
    });
  });

  after(() => {
    appAbortController.abort();
  });

  it('returns 404 when a key is not found', async () => {
    const response = await fetch(`http://localhost:${port}/notARealKey`);
    await response.body?.cancel();

    assertEquals(response.status, Status.NotFound);
  });

  it('assigns a new key when a key is not specified', async () => {
    const postResponse = await fetch(`http://localhost:${port}/`, {
      method: 'POST',
      body: JSON.stringify({
        target: 'https://google.com',
      }),
      headers: {
        'X-Api-Key': admin_api_key,
      },
    });

    assertEquals(postResponse.status, Status.Created);

    const postResponseBody = await postResponse.json();
    assertEquals('location' in postResponseBody, true);
    assertEquals(typeof postResponseBody.location, 'string');

    const getResponse = await fetch(
      `http://localhost:${port}/${postResponseBody.location}`,
      {
        method: 'GET',
        redirect: 'manual',
      },
    );
    await getResponse.body?.cancel();

    assertEquals(getResponse.status, Status.PermanentRedirect);
    assertEquals(getResponse.headers.get('location'), 'https://google.com');
  });

  it('assigns to the specified key', async () => {
    const putResponse = await fetch(`http://localhost:${port}/google`, {
      method: 'PUT',
      body: JSON.stringify({
        target: 'https://google.com',
      }),
      headers: {
        'X-Api-Key': admin_api_key,
      },
    });

    assertEquals(putResponse.status, Status.Created);

    const postResponseBody = await putResponse.json();
    assertEquals(postResponseBody.location, 'google');

    const getResponse = await fetch(`http://localhost:${port}/google`, {
      method: 'GET',
      redirect: 'manual',
    });
    await getResponse.body?.cancel();

    assertEquals(getResponse.status, Status.PermanentRedirect);
    assertEquals(getResponse.headers.get('location'), 'https://google.com');
  });

  it('deletes a specified key', async () => {
    const putResponse = await fetch(`http://localhost:${port}/toDelete`, {
      method: 'PUT',
      body: JSON.stringify({
        target: 'https://google.com',
      }),
      headers: {
        'X-Api-Key': admin_api_key,
      },
    });
    await putResponse.body?.cancel();

    assertEquals(putResponse.status, Status.Created);

    const deleteResponse = await fetch(`http://localhost:${port}/toDelete`, {
      method: 'DELETE',
      headers: {
        'X-Api-Key': admin_api_key,
      },
    });
    await deleteResponse.body?.cancel();

    assertEquals(deleteResponse.status, Status.NoContent);

    const getResponse = await fetch(`http://localhost:${port}/toDelete`, {
      method: 'GET',
      redirect: 'manual',
    });
    await getResponse.body?.cancel();

    assertEquals(getResponse.status, Status.NotFound);
  });

  describe('authentication', () => {
    it('requires an API key to post a new key', async () => {
      const postResponse = await fetch(`http://localhost:${port}/`, {
        method: 'POST',
        body: JSON.stringify({
          target: 'https://google.com',
        }),
      });
      await postResponse.body?.cancel();

      assertEquals(postResponse.status, Status.Forbidden);
    });

    it('requires an API key to put a new key', async () => {
      const putResponse = await fetch(`http://localhost:${port}/key`, {
        method: 'PUT',
        body: JSON.stringify({
          target: 'https://google.com',
        }),
      });
      await putResponse.body?.cancel();

      assertEquals(putResponse.status, Status.Forbidden);
    });

    it('requires an API key to put a delete a key', async () => {
      const deleteResponse = await fetch(`http://localhost:${port}/key`, {
        method: 'DELETE',
      });
      await deleteResponse.body?.cancel();

      assertEquals(deleteResponse.status, Status.Forbidden);
    });

    it('requires an admin API key to post a new key', async () => {
      const postResponse = await fetch(`http://localhost:${port}/`, {
        method: 'POST',
        body: JSON.stringify({
          target: 'https://google.com',
          headers: {
            'X-Api-Key': not_admin_api_key,
          },
        }),
      });
      await postResponse.body?.cancel();

      assertEquals(postResponse.status, Status.Forbidden);
    });

    it('requires an admin API key to put a new key', async () => {
      const putResponse = await fetch(`http://localhost:${port}/key`, {
        method: 'PUT',
        body: JSON.stringify({
          target: 'https://google.com',
          headers: {
            'X-Api-Key': not_admin_api_key,
          },
        }),
      });
      await putResponse.body?.cancel();

      assertEquals(putResponse.status, Status.Forbidden);
    });

    it('requires an admin API key to put a delete a key', async () => {
      const deleteResponse = await fetch(`http://localhost:${port}/key`, {
        method: 'DELETE',
        headers: {
          'X-Api-Key': not_admin_api_key,
        },
      });
      await deleteResponse.body?.cancel();

      assertEquals(deleteResponse.status, Status.Forbidden);
    });
  });
});
