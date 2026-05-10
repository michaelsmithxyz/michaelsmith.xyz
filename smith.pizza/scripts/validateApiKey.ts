import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    key: { type: 'string' },
    'hmac-key': { type: 'string' },
  },
});

const hmacKey = values['hmac-key'] ?? process.env.SMITH_PIZZA_HMAC_KEY;
if (!hmacKey) {
  console.error('`--hmac-key` flag or SMITH_PIZZA_HMAC_KEY env var is required');
  process.exit(1);
}

if (!values.key) {
  console.error('`--key` is required');
  process.exit(1);
}

const algorithm = { name: 'HMAC', hash: 'SHA-512' };
const importedKey = await crypto.subtle.importKey(
  'jwk',
  JSON.parse(hmacKey),
  algorithm,
  true,
  ['sign', 'verify'],
);

const decode = (s: string) => new Uint8Array(Buffer.from(s, 'base64'));

const outer = JSON.parse(new TextDecoder().decode(decode(values.key)));
if (
  typeof outer !== 'object' || outer === null ||
  typeof outer.content !== 'string' || typeof outer.signature !== 'string'
) {
  console.error('Invalid key shape');
  process.exit(1);
}

const isValid = await crypto.subtle.verify(
  algorithm,
  importedKey,
  decode(outer.signature),
  decode(outer.content),
);
if (!isValid) {
  console.error('Invalid signature');
  process.exit(1);
}

const user = JSON.parse(new TextDecoder().decode(decode(outer.content)));
console.log('Valid key:', user);
