import { load } from './deps/std.ts';

await load({ export: true });

const require = (key: string): string => {
  const val = Deno.env.get(key);
  if (val === undefined) {
    throw new Error(`Required env: ${key}`);
  }
  return val;
};

const orDefault = (
  key: string,
  defaultValue: string,
): string => (
  Deno.env.get(key) ?? defaultValue
);

export const config = {
  apiKeyHeader: 'X-Api-Key',
  hmacKey: require('SMITH_PIZZA_HMAC_KEY'),
  store: orDefault(
    'SMITH_PIZZA_STORE',
    'memory',
  ),
  postgresHost: orDefault(
    'SMITH_PIZZA_POSTGRES_HOST',
    '',
  ),
  postgresPort: orDefault(
    'SMITH_PIZZA_POSTGRES_PORT',
    '',
  ),
  postgresDatabase: orDefault(
    'SMITH_PIZZA_POSTGRES_DATABASE',
    '',
  ),
  postgresUser: orDefault(
    'SMITH_PIZZA_POSTGRES_USER',
    '',
  ),
  postgresPassword: orDefault(
    'SMITH_PIZZA_POSTGRES_PASSWORD',
    '',
  ),
  postgresTable: orDefault(
    'SMITH_PIZZA_POSTGRES_TABLE',
    'smith-pizza',
  ),
  postgresCertificate: orDefault(
    'SMITH_PIZZA_POSTGRES_CERTIFICATE',
    '',
  ),
};

export const requireConfig = (key: keyof typeof config) => {
  if (config[key] === '') {
    throw new Error(`${key} is required`);
  }
};
