import { spawn } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace } from './__utils__.js';

const runRegex = (workspace: string, ...args: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, ['.bluespec/hooks/regex.mjs', ...args], {
      cwd: workspace,
    });
    const chunks: string[] = [];

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => chunks.push(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(chunks.join('').trim());
        return;
      }

      reject(new Error(`regex hook exited with code ${code}`));
    });
  });

await describe('the scaffolded regex hook runs without install', async () => {
  await it('classifies patterns as unsafe, safe, or invalid', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    strict.strictEqual(await runRegex(workspace, '(a+)+$'), 'unsafe');
    strict.strictEqual(await runRegex(workspace, 'boundary=(.+)$'), 'unsafe');
    strict.strictEqual(
      await runRegex(workspace, 'filename="([^"]*)"'),
      'unsafe'
    );
    strict.strictEqual(await runRegex(workspace, '(a+)+'), 'safe');
    strict.strictEqual(await runRegex(workspace, '^abc$'), 'safe');
    strict.strictEqual(await runRegex(workspace, '('), 'invalid regex');
  });
});
