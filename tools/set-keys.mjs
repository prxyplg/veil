import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const prompt = createInterface({ input: stdin, output: stdout });
try {
  console.log('Set your activation keys locally. Input is visible in this terminal. Only SHA-256 hashes are saved.');
  const normal = (await prompt.question('Member activation key (at least 8 characters): ')).trim();
  const plus = (await prompt.question('Premium activation key (at least 8 characters): ')).trim();
  const owner = (await prompt.question('Owner activation key (at least 8 characters): ')).trim();
  if ([normal, plus, owner].some(key => key.length < 8) || new Set([normal, plus, owner]).size !== 3) throw new Error('Use three different keys, each at least 8 characters.');
  const path = new URL('../config.js', import.meta.url);
  let source = await readFile(path, 'utf8');
  const hash = value => createHash('sha256').update(value).digest('hex');
  source = source.replace(/normalKeySha256: '[^']*'/, `normalKeySha256: '${hash(normal)}'`).replace(/plusKeySha256: '[^']*'/, `plusKeySha256: '${hash(plus)}'`);
  source = source.replace(/ownerKeySha256: '[^']*'/, `ownerKeySha256: '${hash(owner)}'`);
  await writeFile(path, source);
  console.log('All three activation key hashes saved in config.js.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { prompt.close(); }
