import { encode } from './deps/std.ts';
import { nanoid } from './deps/deps.ts';
import { Maybe } from './types.ts';
import { Store } from './store.ts';

export const generateRedirectID = () => (
  nanoid(16)
);

const storeKey = (
  key: string,
): string => (
  encode(key)
);

export const getRedirect = async (
  store: Store,
  key: string,
): Promise<Maybe<string>> => (
  await store.get(storeKey(key))
);

export const hasRedirect = async (
  store: Store,
  key: string,
): Promise<boolean> => (
  await store.has(storeKey(key))
);

export const setRedirect = async (
  store: Store,
  key: string,
  target: string,
): Promise<void> => {
  await store.set(storeKey(key), target);
};
