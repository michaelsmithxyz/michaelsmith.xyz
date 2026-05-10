import { env } from 'cloudflare:workers';
import { makeApp } from './app.ts';

const app = makeApp(env);

export default {
  fetch: app.fetch, 
} satisfies ExportedHandler<Env>;
