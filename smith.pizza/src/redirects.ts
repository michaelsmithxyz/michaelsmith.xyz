import { nanoid } from 'nanoid';
import { Maybe } from './types.ts';
import { Store } from './store.ts';

export const generateRedirectID = (): string => nanoid(16);

export const getRedirect = async (
  store: Store,
  key: string,
): Promise<Maybe<string>> => (
  await store.get(key)
);

export const hasRedirect = async (
  store: Store,
  key: string,
): Promise<boolean> => (
  await store.has(key)
);

export const setRedirect = async (
  store: Store,
  key: string,
  target: string,
): Promise<void> => {
  await store.set(key, target);
};

export const deleteRedirect = async (
  store: Store,
  key: string,
): Promise<void> => {
  await store.delete(key);
};
