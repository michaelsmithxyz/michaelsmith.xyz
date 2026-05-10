import { Hono } from 'hono';
import { Home } from './Home.tsx';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<Home />);
});

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/static/')) {
      const assetUrl = new URL(
        url.pathname.slice('/static'.length) + url.search,
        url.origin,
      );
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }
    return await app.fetch(request, env as never, ctx);
  },
} satisfies ExportedHandler<Env>;
