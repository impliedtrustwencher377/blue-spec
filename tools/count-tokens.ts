import { stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import { countSpecTokens } from '../src/core/tokens.js';

const specDir = fileURLToPath(new URL('../spec', import.meta.url));
const counts = await countSpecTokens(specDir);

const pathWidth = counts.reduce(
  (widest, count) => Math.max(widest, count.relativePath.length),
  0
);

const lines = counts.map(
  (count) =>
    `${count.relativePath.padEnd(pathWidth)}  ${String(count.tokens).padStart(6)}`
);

const total = counts.reduce((sum, count) => sum + count.tokens, 0);

stdout.write(
  `${lines.join('\n')}\n${'total'.padEnd(pathWidth)}  ${String(total).padStart(6)}\n`
);
