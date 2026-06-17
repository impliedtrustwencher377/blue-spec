import { readdir } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../src/hooks/skills/catalog.js';
import { list } from '../../../src/hooks/skills/skills.js';

const packageRoot = new URL('../../../', import.meta.url);

describe('list formats the catalog as a readable listing', () => {
  it('prints one line per sub-skill with its name and tags', () => {
    const output = list([
      { name: 'alpha', tags: ['one', 'two'] },
      { name: 'beta', tags: ['three'] },
    ]);

    strict.strictEqual(output, 'alpha: one, two\nbeta: three\n');
  });

  for (const entry of SKILLS_CATALOG)
    it('never repeats the name inside its own tags', () => {
      strict(
        !entry.tags.includes(entry.name),
        `${entry.name} should not list its own name as a tag`
      );
    });

  it('reports plainly when the catalog is empty', () => {
    strict.strictEqual(list([]), 'No sub-skills available.\n');
  });
});

await describe('the catalog and the sub-skill files stay in sync', async () => {
  const skillFiles = (
    await readdir(new URL('spec/skills/', packageRoot))
  ).filter((entry) => entry.endsWith('.md'));
  const fileNames = new Set(
    skillFiles.map((file) => file.replace(/\.md$/, ''))
  );
  const catalogNames = new Set(SKILLS_CATALOG.map((entry) => entry.name));

  for (const name of catalogNames)
    it('points every catalog entry at an existing sub-skill file', () => {
      strict(fileNames.has(name), `${name} has no spec/skills/${name}.md`);
    });

  for (const name of fileNames)
    it('lists every sub-skill file in the catalog', () => {
      strict(
        catalogNames.has(name),
        `spec/skills/${name}.md is not in the catalog`
      );
    });
});
