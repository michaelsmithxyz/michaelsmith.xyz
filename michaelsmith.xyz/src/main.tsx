import { render } from 'preact-render-to-string';
import { Application, Router } from '@oak/oak';
import { Home } from './Home.tsx';

const app = new Application();
const router = new Router();

router.get('/', ({ response }) => {
  response.type = 'html';
  response.body = render(<Home />);
});

app.use(router.routes());
app.use(router.allowedMethods());

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
