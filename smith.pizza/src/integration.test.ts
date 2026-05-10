import { Status } from '@michaelsmith.xyz/utils/http';
import { exports } from 'cloudflare:workers';
import { beforeAll, describe, expect, it } from 'vitest';

import { exportApiKey, signApiKey } from './crypto.ts';

let admin_api_key = '';
let not_admin_api_key = '';

beforeAll(async () => {
  admin_api_key = exportApiKey(await signApiKey({ id: 'admin', roles: ['admin'] }));

  not_admin_api_key = exportApiKey(await signApiKey({ id: 'not_admin', roles: [] }));
});

describe('smith.pizza integration tests', () => {
  it('returns 404 when a key is not found', async () => {
    const response = await exports.default.fetch('https://example.com/notARealKey');
    expect(response.status).toBe(Status.NotFound);
  });

  it('assigns a new key when a key is not specified', async () => {
    const postResponse = await exports.default.fetch('https://example.com/', {
      method: 'POST',
      body: JSON.stringify({ target: 'https://google.com' }),
      headers: { 'X-Api-Key': admin_api_key },
    });

    expect(postResponse.status).toBe(Status.Created);

    const postResponseBody = (await postResponse.json()) as { location: string };
    expect(typeof postResponseBody.location).toBe('string');

    const getResponse = await exports.default.fetch(
      `https://example.com/${postResponseBody.location}`,
      { method: 'GET', redirect: 'manual' },
    );

    expect(getResponse.status).toBe(Status.PermanentRedirect);
    expect(getResponse.headers.get('location')).toBe('https://google.com');
  });

  it('assigns to the specified key', async () => {
    const putResponse = await exports.default.fetch('https://example.com/google', {
      method: 'PUT',
      body: JSON.stringify({ target: 'https://google.com' }),
      headers: { 'X-Api-Key': admin_api_key },
    });

    expect(putResponse.status).toBe(Status.Created);

    const putResponseBody = (await putResponse.json()) as { location: string };
    expect(putResponseBody.location).toBe('google');

    const getResponse = await exports.default.fetch('https://example.com/google', {
      method: 'GET',
      redirect: 'manual',
    });

    expect(getResponse.status).toBe(Status.PermanentRedirect);
    expect(getResponse.headers.get('location')).toBe('https://google.com');
  });

  it('deletes a specified key', async () => {
    const putResponse = await exports.default.fetch('https://example.com/toDelete', {
      method: 'PUT',
      body: JSON.stringify({ target: 'https://google.com' }),
      headers: { 'X-Api-Key': admin_api_key },
    });
    expect(putResponse.status).toBe(Status.Created);

    const deleteResponse = await exports.default.fetch('https://example.com/toDelete', {
      method: 'DELETE',
      headers: { 'X-Api-Key': admin_api_key },
    });
    expect(deleteResponse.status).toBe(Status.NoContent);

    const getResponse = await exports.default.fetch('https://example.com/toDelete', {
      method: 'GET',
      redirect: 'manual',
    });
    expect(getResponse.status).toBe(Status.NotFound);
  });

  describe('authentication', () => {
    it('requires an API key to post a new key', async () => {
      const response = await exports.default.fetch('https://example.com/', {
        method: 'POST',
        body: JSON.stringify({ target: 'https://google.com' }),
      });
      expect(response.status).toBe(Status.Forbidden);
    });

    it('requires an API key to put a new key', async () => {
      const response = await exports.default.fetch('https://example.com/key', {
        method: 'PUT',
        body: JSON.stringify({ target: 'https://google.com' }),
      });
      expect(response.status).toBe(Status.Forbidden);
    });

    it('requires an API key to delete a key', async () => {
      const response = await exports.default.fetch('https://example.com/key', {
        method: 'DELETE',
      });
      expect(response.status).toBe(Status.Forbidden);
    });

    it('requires an admin API key to post a new key', async () => {
      const response = await exports.default.fetch('https://example.com/', {
        method: 'POST',
        body: JSON.stringify({ target: 'https://google.com' }),
        headers: { 'X-Api-Key': not_admin_api_key },
      });
      expect(response.status).toBe(Status.Forbidden);
    });

    it('requires an admin API key to put a new key', async () => {
      const response = await exports.default.fetch('https://example.com/key', {
        method: 'PUT',
        body: JSON.stringify({ target: 'https://google.com' }),
        headers: { 'X-Api-Key': not_admin_api_key },
      });
      expect(response.status).toBe(Status.Forbidden);
    });

    it('requires an admin API key to delete a key', async () => {
      const response = await exports.default.fetch('https://example.com/key', {
        method: 'DELETE',
        headers: { 'X-Api-Key': not_admin_api_key },
      });
      expect(response.status).toBe(Status.Forbidden);
    });
  });
});
