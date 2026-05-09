import { env } from 'cloudflare:workers';

export const hmacKeyAlgorithm: SubtleCryptoImportKeyAlgorithm = {
  name: 'HMAC',
  hash: 'SHA-512',
};
export const hmacKeyUsages: string[] = ['sign', 'verify'];

const encodeBase64 = (data: ArrayBuffer | Uint8Array | string): string => {
  if (typeof data === 'string') {
    return Buffer.from(data, 'utf8').toString('base64');
  }
  const view = data instanceof Uint8Array ? data : new Uint8Array(data);
  return Buffer.from(view).toString('base64');
};

const decodeBase64 = (data: string): Uint8Array => (
  new Uint8Array(Buffer.from(data, 'base64'))
);

const getHmacKey = async () => {
  const jwk = env.SMITH_PIZZA_HMAC_KEY;
  if (!jwk) {
    throw new Error('SMITH_PIZZA_HMAC_KEY is not configured');
  }
  return await crypto.subtle.importKey(
    'jwk',
    JSON.parse(jwk),
    hmacKeyAlgorithm,
    true,
    hmacKeyUsages,
  );
};

export type RawSignedApiKey = {
  content: string;
  signature: string;
};

export const isRawSignedApiKey = (
  value: unknown,
): value is RawSignedApiKey => (
  typeof value === 'object' &&
  value !== null &&
  typeof (value as RawSignedApiKey).content === 'string' &&
  typeof (value as RawSignedApiKey).signature === 'string'
);

export const signApiKey = async (
  content: Record<string, unknown>,
): Promise<RawSignedApiKey> => {
  const data = new TextEncoder().encode(JSON.stringify(content));
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

export const exportApiKey = (key: RawSignedApiKey): string => (
  encodeBase64(JSON.stringify(key))
);

export const importApiKey = (apiKey: string): string => (
  new TextDecoder().decode(decodeBase64(apiKey))
);

export const decodeContent = (content: string): string => (
  new TextDecoder().decode(decodeBase64(content))
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
