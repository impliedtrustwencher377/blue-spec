import {
  loadTrackingMap,
  parseNamePayload,
  removeEntries,
  serializeTrackingMap,
  writeTrackingMap,
} from '../../core/tracking.js';

/** Removes findings from the tracking map by name, never touching the prose */
export const untrack = async (
  targetDir: string,
  payload: string
): Promise<string> => {
  const names = parseNamePayload(payload);

  if (names.length === 0)
    throw new Error('untrack input needs `names`, a list of finding names');

  const map = await loadTrackingMap(targetDir);
  const result = removeEntries(map, names);

  if (serializeTrackingMap(map) !== serializeTrackingMap(result.updatedMap))
    await writeTrackingMap(targetDir, result.updatedMap);

  return `${JSON.stringify(
    { removed: result.removed, notFound: result.notFound },
    null,
    2
  )}\n`;
};
