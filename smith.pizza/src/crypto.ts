import { crypto } from '@std/crypto';
import { decodeBase64, encodeBase64 } from '@std/encoding';
import { config } from './config.ts';

export const hmacKeyAlgorithm: HmacImportParams = {
  name: 'HMAC',
  hash: 'SHA-512',
};
export const hmacKeyUsages: KeyUsage[] = [
  'sign',
  'verify',
];

const getHmacKey = async () => (
  await crypto.subtle.importKey(
    'jwk',
    JSON.parse(config('hmacKey')),
    hmacKeyAlgorithm,
    true,
    hmacKeyUsages,
  )
);

export type RawSignedApiKey = {
  content: string;
  signature: string;
};

export const isRawSignedApiKey = (
  // deno-lint-ignore no-explicit-any
  value: any,
): value is RawSignedApiKey => (
  typeof value === 'object' &&
  typeof value.content === 'string' &&
  typeof value.signature === 'string'
);

export const signApiKey = async (
  content: Record<string, unknown>,
): Promise<RawSignedApiKey> => {
  const serialized = JSON.stringify(content);
  const encoder = new TextEncoder();
  const data = encoder.encode(serialized);
  const signature = await crypto.subtle.sign(
    hmacKeyAlgorithm,
    await getHmacKey(),
    data,
  );
  return {
    content: encodeBase64(data),
    signature: encodeBase64(signature),
  };
};

export const exportApiKey = (
  key: RawSignedApiKey,
) => (
  encodeBase64(JSON.stringify(key))
);

export const isValidSignedApiKey = async (
  apiKey: RawSignedApiKey,
): Promise<boolean> => (
  crypto.subtle.verify(
    hmacKeyAlgorithm,
    await getHmacKey(),
    decodeBase64(apiKey.signature),
    decodeBase64(apiKey.content),
  )
);
