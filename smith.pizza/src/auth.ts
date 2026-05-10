import { decodeContent, importApiKey, isRawSignedApiKey, isValidSignedApiKey } from './crypto.ts';
import type { Maybe } from './types.ts';

export type AdminRole = 'admin';
export type Role = AdminRole;

export type User = {
  id: string;
  roles: Role[];
};

const isUser = (value: unknown): value is User =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as User).id === 'string' &&
  Array.isArray((value as User).roles) &&
  (value as User).roles.every((role) => typeof role === 'string');

export const apiKeyToUser = async (apiKey: string): Promise<Maybe<User>> => {
  try {
    const parsedKey = JSON.parse(importApiKey(apiKey));
    if (!isRawSignedApiKey(parsedKey)) {
      return undefined;
    }

    if (!(await isValidSignedApiKey(parsedKey))) {
      return undefined;
    }

    const parsed = JSON.parse(decodeContent(parsedKey.content));
    if (!isUser(parsed)) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
};

export const apiKeyHasRole = async (apiKey: string, role: Role): Promise<boolean> => {
  const user = await apiKeyToUser(apiKey);
  if (!user) {
    return false;
  }
  return user.roles.includes(role);
};
