import { makeApp } from './app.ts';

const app = makeApp();
await app.listen({ port: 8080 });
