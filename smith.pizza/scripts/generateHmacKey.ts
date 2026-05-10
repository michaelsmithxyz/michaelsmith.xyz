const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, [
  'sign',
  'verify',
]);

const exported = await crypto.subtle.exportKey('jwk', key as CryptoKey);

console.log(JSON.stringify(exported));
