import { runHook } from '../../cli/run-hook.js';
import { check, parseLimit } from './regex.js';

/**
 * @example node ./.bluespec/hooks/regex.mjs '(a+)+'      // => unsafe
 * @example node ./.bluespec/hooks/regex.mjs 'a?a?a?' 2   // => unsafe (custom limit)
 */
await runHook(import.meta.url, (args) => {
  if (args[0] === undefined)
    throw new Error('regex hook needs a pattern as its first argument');

  return `${check(args[0], { repetitionLimit: parseLimit(args[1]) })}\n`;
});
