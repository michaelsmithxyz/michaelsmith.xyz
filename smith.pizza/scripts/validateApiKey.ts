import { parseArgs } from '@std/cli/parse-args';
import { apiKeyToUser } from '../src/auth.ts';

const flags = parseArgs(Deno.args, {
  string: ['key'],
});

if (!flags.key) {
  console.error('`key` is required');
  Deno.exit(1);
}

const validationResult = await apiKeyToUser(flags.key);
if (!validationResult) {
  console.error('Invalid key');
  Deno.exit(1);
}

console.log('Valid key:', validationResult);
