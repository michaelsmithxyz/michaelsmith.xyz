import { env } from 'cloudflare:workers';
import { makeApp } from './app.ts';

const app = makeApp(env);

export default {
  async fetch(request, env, ctx): Promise<Response> {
    return await app.fetch(request, env as unknown as Record<string, string>, ctx);
  },
} satisfies ExportedHandler<Env>;
