import { cwd } from 'node:process';
import { runHook } from '../../cli/run-hook.js';
import { list } from './list.js';

/**
 * @example node ./.bluespec/hooks/list.mjs   // lists every tracked finding by name
 */
await runHook(import.meta.url, () => list(cwd()));
