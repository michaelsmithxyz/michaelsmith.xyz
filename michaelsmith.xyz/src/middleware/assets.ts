import { Middleware } from '@oak/oak';

const staticRoot = new URL(import.meta.resolve('@static')).pathname;

export const assetsMiddleware = (): Middleware => (
  async (ctx, next) => {
    if (ctx.request.url.pathname.startsWith('/static')) {
      try {
        const path = ctx.request.url.pathname.replace(/^\/static\//, '');
        await ctx.send({
          path,
          root: staticRoot,
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
