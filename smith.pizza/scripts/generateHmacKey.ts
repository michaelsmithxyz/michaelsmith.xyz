import { crypto } from '@std/crypto';
import { hmacKeyAlgorithm, hmacKeyUsages } from '../src/crypto.ts';

const key = await crypto.subtle.generateKey(
  hmacKeyAlgorithm,
  true,
  hmacKeyUsages,
);

const exported = await crypto.subtle.exportKey(
  'jwk',
  key,
);

console.log(JSON.stringify(exported));
