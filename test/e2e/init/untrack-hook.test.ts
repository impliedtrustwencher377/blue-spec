import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execPath } from 'node:process';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace } from './__utils__.js';

const runHook = (
  workspace: string,
  hook: string,
  payload: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, [`.bluespec/hooks/${hook}`, payload], {
      cwd: workspace,
    });
    const chunks: string[] = [];

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => chunks.push(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(chunks.join(''));
        return;
      }

      reject(new Error(`${hook} exited with code ${code}`));
    });
  });

const readTracking = async (
  workspace: string
): Promise<{ entries: { name: string; paths: string[] }[] }> =>
  JSON.parse(
    await readFile(join(workspace, '.bluespec/tracking.json'), 'utf8')
  );

await describe('the scaffolded untrack hook removes by name without install', async () => {
  await it('drops a closed finding from the map, leaving the rest', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    await runHook(
      workspace,
      'track.mjs',
      JSON.stringify({
        entries: [
          { name: 'Leaked secret', paths: ['src/config.ts'] },
          { name: 'Open redirect', paths: ['src/routes.ts'] },
        ],
      })
    );

    const output = await runHook(
      workspace,
      'untrack.mjs',
      JSON.stringify({ names: ['Leaked secret'] })
    );
    const parsed: { removed: string[]; notFound: string[] } =
      JSON.parse(output);
    strict.deepStrictEqual(parsed.removed, ['Leaked secret']);

    const map = await readTracking(workspace);
    strict.deepStrictEqual(
      map.entries.map((entry) => entry.name),
      ['Open redirect'],
      'the still-open finding stays, the closed one is gone'
    );
  });
});
