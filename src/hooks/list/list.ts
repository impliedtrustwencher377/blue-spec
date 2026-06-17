import type { TrackingMap } from '../../types/core.js';
import { loadTrackingMap } from '../../core/tracking.js';

/** Formats the tracked findings as a readable listing, one name per line */
export const formatFindings = (map: TrackingMap): string => {
  if (map.entries.length === 0) return 'No findings tracked yet.\n';

  const lines = map.entries.map((entry) => `- ${entry.name}`);

  return `Findings:\n${lines.join('\n')}\n`;
};

/** Lists the names tracked in .bluespec/tracking.json as findings */
export const list = async (targetDir: string): Promise<string> =>
  formatFindings(await loadTrackingMap(targetDir));
