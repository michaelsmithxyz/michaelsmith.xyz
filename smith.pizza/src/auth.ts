import { decodeBase64 } from '@std/encoding/base64';
import { isRawSignedApiKey, isValidSignedApiKey } from './crypto.ts';
import { Maybe } from './types.ts';

export type AdminRole = 'admin';
export type Role = AdminRole;

export type User = {
  id: string;
  roles: Role[];
};

const isUser = (
  // deno-lint-ignore no-explicit-any
  value: any,
): value is User => (
  typeof value === 'object' &&
  typeof value.id === 'string' &&
  Array.isArray(value.roles) &&
  value.roles.every(
    // deno-lint-ignore no-explicit-any
    (role: any) => typeof role === 'string',
  )
);

export const apiKeyToUser = async (
  apiKey: string,
): Promise<Maybe<User>> => {
  try {
    const decoder = new TextDecoder();
    const parsedKey = JSON.parse(decoder.decode(decodeBase64(apiKey)));
    if (!isRawSignedApiKey(parsedKey)) {
      return undefined;
    }

    const isValid = await isValidSignedApiKey(parsedKey);
    if (!isValid) {
      return undefined;
    }

    const parsed = JSON.parse(decoder.decode(decodeBase64(parsedKey.content)));
    if (!isUser(parsed)) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
};

export const apiKeyHasRole = async (
  apiKey: string,
  role: Role,
): Promise<boolean> => {
  const user = await apiKeyToUser(
    apiKey,
  );
  if (!user) {
    return false;
  }
  return user.roles.includes(role);
};
