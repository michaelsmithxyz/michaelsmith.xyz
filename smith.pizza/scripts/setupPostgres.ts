import { PostgresStore } from '../src/store.ts';

const store = new PostgresStore();
await store.setup();
