import { parseArgs } from '@std/cli/parse-args';
import { exportApiKey, signApiKey } from '../src/crypto.ts';

const flags = parseArgs(Deno.args, {
  string: ['data'],
});

if (!flags.data) {
  console.error('`data` is required');
  Deno.exit(1);
}

const data = JSON.parse(flags.data);
const key = await signApiKey(data);
console.log(exportApiKey(key));
