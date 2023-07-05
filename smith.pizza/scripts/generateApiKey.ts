import { parse } from '../src/deps/std.ts';
import { exportApiKey, signApiKey } from '../src/crypto.ts';

const flags = parse(Deno.args, {
  string: ['data'],
});

if (!flags.data) {
  console.error('`data` is required');
  Deno.exit(1);
}

const data = JSON.parse(flags.data);
const key = await signApiKey(data);
console.log(exportApiKey(key));
