import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  loadTrackingMap,
  removeEntries,
  writeTrackingMap,
} from '../../../src/core/tracking.js';
import { untrack } from '../../../src/hooks/untrack/untrack.js';
import { mapOf, newWorkspace } from './__utils__.js';

describe('removeEntries drops items by name and reports what it removed', () => {
  it('removes one named entry, leaving the rest in place', () => {
    const map = mapOf([
      { name: 'Leaked secret', paths: ['src/config.ts'] },
      { name: 'Open redirect', paths: ['src/routes.ts'] },
    ]);

    const result = removeEntries(map, ['Leaked secret']);

    strict.deepStrictEqual(result.removed, ['Leaked secret']);
    strict.deepStrictEqual(
      result.updatedMap.entries.map((entry) => entry.name),
      ['Open redirect']
    );
  });

  it('removes a batch in one pass', () => {
    const map = mapOf([
      { name: 'Alpha', paths: ['a.ts'] },
      { name: 'Beta', paths: ['b.ts'] },
      { name: 'Gamma', paths: ['c.ts'] },
    ]);

    const result = removeEntries(map, ['Alpha', 'Gamma']);

    strict.deepStrictEqual(
      result.updatedMap.entries.map((entry) => entry.name),
      ['Beta'],
      'the unrequested item stays in place and in order'
    );
  });

  it('lists a requested name that the map does not hold under notFound', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const result = removeEntries(map, ['Missing finding']);

    strict.deepStrictEqual(result.removed, []);
    strict.deepStrictEqual(result.notFound, ['Missing finding']);
    strict.strictEqual(result.updatedMap.entries.length, 1);
  });

  it('removing every entry yields the empty map', () => {
    const map = mapOf([
      { name: 'Alpha', paths: ['a.ts'] },
      { name: 'Beta', paths: ['b.ts'] },
    ]);

    const result = removeEntries(map, ['Alpha', 'Beta']);

    strict.strictEqual(result.updatedMap.entries.length, 0);
  });

  it('is idempotent: re-removing a gone name is a no-op', () => {
    const map = mapOf([{ name: 'Open redirect', paths: ['src/routes.ts'] }]);

    const first = removeEntries(map, ['Leaked secret']);
    const second = removeEntries(first.updatedMap, ['Leaked secret']);

    strict.deepStrictEqual(second.removed, []);
    strict.deepStrictEqual(second.notFound, ['Leaked secret']);
    strict.deepStrictEqual(second.updatedMap.entries, first.updatedMap.entries);
  });
});

await describe('the untrack hook logic', async () => {
  await it('removes a named entry from a seeded map and emits JSON', async () => {
    const workspace = await newWorkspace();
    await writeTrackingMap(
      workspace,
      mapOf([
        { name: 'Leaked secret', paths: ['src/config.ts'] },
        { name: 'Open redirect', paths: ['src/routes.ts'] },
      ])
    );

    const output = await untrack(
      workspace,
      JSON.stringify({ names: ['Leaked secret'] })
    );
    const parsed: { removed: string[]; notFound: string[] } =
      JSON.parse(output);

    strict.deepStrictEqual(parsed.removed, ['Leaked secret']);

    const map = await loadTrackingMap(workspace);
    strict.deepStrictEqual(
      map.entries.map((entry) => entry.name),
      ['Open redirect']
    );
  });

  await it('rejects a payload with no names', async () => {
    const workspace = await newWorkspace();

    await strict.rejects(
      untrack(workspace, JSON.stringify({ names: [] })),
      /names/
    );
  });

  await it('fails closed on a non-string name', async () => {
    const workspace = await newWorkspace();
    await writeTrackingMap(
      workspace,
      mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }])
    );

    const output = await untrack(
      workspace,
      JSON.stringify({ names: [42, 'Leaked secret'] })
    );
    const parsed: { removed: string[] } = JSON.parse(output);

    strict.deepStrictEqual(
      parsed.removed,
      ['Leaked secret'],
      'the non-string name is filtered out, the valid one still removes'
    );
  });

  await it('does not rewrite the file when nothing changed', async () => {
    const workspace = await newWorkspace();
    await writeTrackingMap(
      workspace,
      mapOf([{ name: 'Open redirect', paths: ['src/routes.ts'] }])
    );
    const trackingPath = join(workspace, '.bluespec/tracking.json');
    const before = await stat(trackingPath);

    await untrack(workspace, JSON.stringify({ names: ['Missing finding'] }));
    const after = await stat(trackingPath);

    strict.strictEqual(
      after.mtimeMs,
      before.mtimeMs,
      'removing a name the map never held leaves the file untouched'
    );
  });
});
