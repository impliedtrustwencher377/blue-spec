import { runHook } from '../../cli/run-hook.js';
import { SKILLS_CATALOG } from './catalog.js';
import { list } from './skills.js';

/**
 * @example node ./.bluespec/hooks/skills.mjs   // lists every sub-skill and its tags
 */
await runHook(import.meta.url, () => list(SKILLS_CATALOG));
