import { decode } from './deps/std.ts';
import {
  Pool,
  type TLSOptions,
  type QueryArguments,
  type QueryObjectResult,
} from './deps/deps.ts';
import {
  config,
  requireConfig,
} from './config.ts';
import { Maybe } from './types.ts';

type StoreType =
  | 'memory'
  | 'postgres';

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

const decodeCertificate = (encoded: string) => {
  const decoded = decode(encoded);
  return (new TextDecoder()).decode(decoded);
}

export class PostgresStore implements Store {
  #pool: Pool;
  #poolSize = 3;
  #table: string;

  constructor() {
    requireConfig('postgresHost');
    requireConfig('postgresPort');
    requireConfig('postgresDatabase');
    requireConfig('postgresUser');
    requireConfig('postgresPassword');
    requireConfig('postgresTable');

    let tls: Partial<TLSOptions> | undefined = undefined;
    if (config.postgresCertificate !== '') {
      tls = {
        enabled: true,
        enforce: true,
        caCertificates: [
          decodeCertificate(config.postgresCertificate),
        ],
      };
    }

    this.#pool = new Pool(
      {
        hostname: config.postgresHost,
        port: config.postgresPort,
        database: config.postgresDatabase,
        user: config.postgresUser,
        password: config.postgresPassword,
        tls,
      },
      this.#poolSize,
      true, // lazy
    );
    this.#table = PostgresStore.#quoteIdentifier(
      config.postgresTable,
    );
  }

  static #quoteIdentifier(identifier: string): string {
    return `"${identifier}"`;
  }

  async #query<T>(
    query: string,
    args?: QueryArguments,
  ) {
    const client = await this.#pool.connect();
    let result: QueryObjectResult<T>;
    try {
      result = await client.queryObject<T>(query, args);
    } finally {
      client.release();
    }
    return result;
  }

  async setup() {
    await this.#query(`
      create table if not exists ${this.#table} (
        key text primary key not null,
        value text not null
      );
  `);
  }

  async get(key: string): Promise<Maybe<string>> {
    const result = await this.#query<{ value: string }>(
      `
      select value
      from ${this.#table}
      where key=$1
    `,
      [key],
    );
    return result.rowCount ? result.rows[0].value : undefined;
  }

  async set(key: string, value: string) {
    await this.#query(
      `
      insert into ${this.#table} (key, value)
      values ($1, $2)
      on conflict (key) do update
      set value = $2
    `,
      [key, value],
    );
  }

  async has(key: string): Promise<boolean> {
    const result = await this.#query(
      `
      select 1
      from ${this.#table}
      where key = $1
    `,
      [key],
    );
    return Boolean(result.rowCount);
  }
}

export const getStore = (): Store => {
  const type = config.store as StoreType;
  console.log(`Store type = ${type}`);
  if (type === 'memory') {
    return new InMemoryStore();
  }
  if (type === 'postgres') {
    return new PostgresStore();
  }
  throw new Error('Unknown store type');
};
