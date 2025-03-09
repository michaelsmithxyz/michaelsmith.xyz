import { config } from './config.ts';
import { Maybe } from './types.ts';
import { unreachable } from './utils.ts';

type StoreType =
  | 'memory'
  | 'kv';

export interface Store {
  get(key: string): Promise<Maybe<string>>;

  set(key: string, value: string): Promise<void>;

  has(key: string): Promise<boolean>;
}

export class InMemoryStore implements Store {
  #map: Map<string, string>;

  constructor() {
    this.#map = new Map();
  }

  // deno-lint-ignore require-await
  async get(key: string): Promise<Maybe<string>> {
    return this.#map.get(key);
  }

  // deno-lint-ignore require-await
  async set(key: string, value: string) {
    this.#map.set(key, value);
  }

  // deno-lint-ignore require-await
  async has(key: string): Promise<boolean> {
    return this.#map.has(key);
  }
}

export class KvStore implements Store {
  #kv: Maybe<Deno.Kv>;

  constructor() {
  }

  #makeKey(key: string): string[] {
    return ['alias', key];
  }

  async #getKv(): Promise<Deno.Kv> {
    if (this.#kv) {
      return this.#kv;
    }
    const path = config('kvPath');
    if (path !== '') {
      return await Deno.openKv(path);
    }
    return await Deno.openKv();
  }

  async get(key: string): Promise<Maybe<string>> {
    const kv = await this.#getKv();
    const {
      value,
    } = await kv.get<string>(this.#makeKey(key));
    return value ?? undefined;
  }

  async set(key: string, value: string) {
    const kv = await this.#getKv();
    await kv.set(this.#makeKey(key), value);
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined;
  }
}

export const getStore = (): Store => {
  const type = config('store') as StoreType;
  console.log(`Store type = ${type}`);
  if (type === 'memory') {
    return new InMemoryStore();
  }
  if (type === 'kv') {
    return new KvStore();
  }
  throw unreachable(type);
};
