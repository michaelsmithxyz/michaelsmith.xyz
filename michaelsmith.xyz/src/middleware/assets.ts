import { Middleware } from '@oak/oak';

export const assetsMiddleware = (): Middleware => (
  async (ctx, next) => {
    if (ctx.request.url.pathname.startsWith('/static')) {
      try {
        const path = ctx.request.url.pathname.replace(/^\/static\//, '');
        await ctx.send({
          path,
          root: `${Deno.cwd()}/static/`,
        });
        return;
      } catch (error) {
        console.log(error);
      }
    }

    next();
  }
);

export const assetRef = (s: string) => `/static/${s}`;
