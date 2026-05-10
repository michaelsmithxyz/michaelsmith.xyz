import type { Maybe } from './types.ts';

export type Store = {
  get(key: string): Promise<Maybe<string>>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
};

export class InMemoryStore implements Store {
  private readonly map = new Map<string, string>();

  async get(key: string): Promise<Maybe<string>> {
    return this.map.get(key);
  }

  async set(key: string, value: string) {
    this.map.set(key, value);
  }

  async delete(key: string) {
    this.map.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return this.map.has(key);
  }
}

export class WorkersKvStore implements Store {
  private readonly kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  async get(key: string): Promise<Maybe<string>> {
    const value = await this.kv.get(key);
    return value ?? undefined;
  }

  async set(key: string, value: string) {
    await this.kv.put(key, value);
  }

  async delete(key: string) {
    await this.kv.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }
}

export const getStore = (env: Env): Store => {
  if (env.REDIRECTS) {
    return new WorkersKvStore(env.REDIRECTS);
  }
  return new InMemoryStore();
};
