import type { TrackingEntry, TrackingMap } from '../../../src/types/core.js';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach } from 'poku';

const workspaces: string[] = [];

export const newWorkspace = async (): Promise<string> => {
  const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-track-'));

  workspaces.push(workspace);
  return workspace;
};

export const mapOf = (entries: TrackingEntry[]): TrackingMap => ({
  name: 'blue-spec',
  entries,
});

afterEach(async () => {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true })
    )
  );

  workspaces.length = 0;
});
