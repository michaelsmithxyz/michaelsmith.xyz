import { nanoid } from 'nanoid';
import { encodeBase64 } from '@std/encoding';
import { Maybe } from './types.ts';
import { Store } from './store.ts';

export const generateRedirectID = () => (
  nanoid(16)
);

const storeKey = (
  key: string,
): string => (
  encodeBase64(key)
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
