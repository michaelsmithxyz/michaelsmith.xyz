import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    data: { type: 'string' },
    'hmac-key': { type: 'string' },
  },
});

const hmacKey = values['hmac-key'] ?? process.env.SMITH_PIZZA_HMAC_KEY;
if (!hmacKey) {
  console.error('`--hmac-key` flag or SMITH_PIZZA_HMAC_KEY env var is required');
  process.exit(1);
}

if (!values.data) {
  console.error('`--data` is required');
  process.exit(1);
}

const algorithm = { name: 'HMAC', hash: 'SHA-512' };
const importedKey = await crypto.subtle.importKey('jwk', JSON.parse(hmacKey), algorithm, true, [
  'sign',
  'verify',
]);

const data = new TextEncoder().encode(values.data);
const signature = await crypto.subtle.sign(algorithm, importedKey, data);

const signed = {
  content: Buffer.from(data).toString('base64'),
  signature: Buffer.from(signature).toString('base64'),
};

console.log(Buffer.from(JSON.stringify(signed)).toString('base64'));
