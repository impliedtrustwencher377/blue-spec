import { describe, it, strict } from 'poku';
import { repairEntries } from '../../../src/hooks/repair/repair.js';
import { mapOf } from './__utils__.js';

describe('repairEntries realigns one entry per item', () => {
  it('registers everything new against an empty map', () => {
    const result = repairEntries(mapOf([]), [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(result.classifications.length, 1);
    strict.strictEqual(result.classifications[0].classification, 'new');
    strict.strictEqual(result.updatedMap.entries.length, 1);
    strict.strictEqual(result.unresolved.length, 0);
  });

  it('leaves an identical entry unchanged and the map intact', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const result = repairEntries(map, [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'unchanged');
    strict.deepStrictEqual(result.updatedMap.entries, map.entries);
    strict.strictEqual(result.unresolved.length, 0);
  });

  it('follows a moved path while identity holds', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const result = repairEntries(map, [
      { name: 'Leaked secret', paths: ['src/settings/config.ts'] },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'moved');
    strict.strictEqual(result.classifications[0].name, 'Leaked secret');
    strict.deepStrictEqual(result.updatedMap.entries[0].paths, [
      'src/settings/config.ts',
    ]);
    strict.strictEqual(result.unresolved.length, 0);
  });

  it('surfaces an unreported item as orphan, never dropping it', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const result = repairEntries(map, []);

    strict.strictEqual(result.unresolved.length, 1);
    strict.strictEqual(result.unresolved[0].reason, 'orphan');
    strict.strictEqual(result.unresolved[0].name, 'Leaked secret');
    strict.strictEqual(result.updatedMap.entries.length, 1);
  });

  it('flags a same-paths entry under a new name as a rename candidate', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const result = repairEntries(map, [
      { name: 'Exposed API key', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(
      result.classifications[0].classification,
      'new',
      'the new name registers as a fresh item'
    );
    strict.strictEqual(result.unresolved.length, 1);
    strict.strictEqual(result.unresolved[0].reason, 'renamed-candidate');
    strict.strictEqual(result.unresolved[0].name, 'Leaked secret');
    strict(
      result.updatedMap.entries.some((entry) => entry.name === 'Leaked secret'),
      'the original entry stays in the map for the agent to decide'
    );
  });
});

describe('a moved file is corrected once for the whole map', () => {
  it('corrects the path on the one entry while its name holds', () => {
    const map = mapOf([
      { name: 'Path traversal in file serving', paths: ['src/server.js'] },
    ]);

    const result = repairEntries(map, [
      { name: 'Path traversal in file serving', paths: ['src/app.js'] },
    ]);

    strict.strictEqual(result.updatedMap.entries.length, 1);
    const entry = result.updatedMap.entries[0];
    strict.strictEqual(entry.name, 'Path traversal in file serving');
    strict.deepStrictEqual(entry.paths, ['src/app.js'], 'paths corrected once');
    strict.strictEqual(result.unresolved.length, 0);
  });
});
