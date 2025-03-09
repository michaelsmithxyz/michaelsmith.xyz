import { load } from '@std/dotenv';

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

type Config = ReturnType<typeof makeConfig>;
const makeConfig = () => ({
  port: orDefault(
    'SMITH_PIZZA_PORT',
    '1997',
  ),
  apiKeyHeader: 'X-Api-Key',
  hmacKey: require('SMITH_PIZZA_HMAC_KEY'),
  store: orDefault(
    'SMITH_PIZZA_STORE',
    'memory',
  ),
  kvPath: orDefault(
    'SMITH_PIZZA_KV_PATH',
    '',
  ),
});

export const loadConfig = async (
  envPath?: string,
) => {
  await load({ envPath, export: true });
};

export const config = (
  key: keyof Config,
): string => (
  makeConfig()[key]
);
