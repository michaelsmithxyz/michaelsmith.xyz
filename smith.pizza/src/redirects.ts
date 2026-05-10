import { nanoid } from 'nanoid';

import type { Store } from './store.ts';
import type { Maybe } from './types.ts';

const generatedIdLength = 16;
export const generateRedirectID = (): string => nanoid(generatedIdLength);

export const getRedirect = async (store: Store, key: string): Promise<Maybe<string>> =>
  await store.get(key);

export const hasRedirect = async (store: Store, key: string): Promise<boolean> =>
  await store.has(key);

export const setRedirect = async (store: Store, key: string, target: string): Promise<void> => {
  await store.set(key, target);
};

export const deleteRedirect = async (store: Store, key: string): Promise<void> => {
  await store.delete(key);
};
