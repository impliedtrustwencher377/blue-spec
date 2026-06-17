import type { SkillCatalogEntry } from '../../types/core.js';

/** Formats the catalog as a readable listing, one sub-skill per line with its tags */
export const list = (catalog: SkillCatalogEntry[]): string => {
  if (catalog.length === 0) return 'No sub-skills available.\n';

  const lines = catalog.map(
    (entry) => `${entry.name}: ${entry.tags.join(', ')}`
  );

  return `${lines.join('\n')}\n`;
};
