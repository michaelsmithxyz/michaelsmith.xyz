import { makeApp } from './app.ts';
import { config, loadConfig } from './config.ts';

await loadConfig();

const app = makeApp();
await app.listen({ port: Number(config('port')) });
