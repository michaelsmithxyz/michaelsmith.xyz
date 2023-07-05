import {
  crypto,
  decode,
  encode,
} from './deps/std.ts';
import { config } from './config.ts';

export const hmacKeyAlgorithm: HmacImportParams = {
  name: 'HMAC',
  hash: 'SHA-512',
};
export const hmacKeyUsages: KeyUsage[] = [
  'sign',
  'verify',
];

const hmacKey = await crypto.subtle.importKey(
  'jwk',
  JSON.parse(config.hmacKey),
  hmacKeyAlgorithm,
  true,
  hmacKeyUsages,
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
    hmacKey,
    data,
  );
  return {
    content: encode(data),
    signature: encode(signature),
  };
};

export const exportApiKey = (
  key: RawSignedApiKey,
) => (
  encode(JSON.stringify(key))
);

export const isValidSignedApiKey = (
  apiKey: RawSignedApiKey,
): Promise<boolean> => (
  crypto.subtle.verify(
    hmacKeyAlgorithm,
    hmacKey,
    decode(apiKey.signature),
    decode(apiKey.content),
  )
);
