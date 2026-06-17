import { spawn } from 'node:child_process';
import { execPath } from 'node:process';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace } from './__utils__.js';

const runSkills = (workspace: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, ['.bluespec/hooks/skills.mjs'], {
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

      reject(new Error(`skills hook exited with code ${code}`));
    });
  });

await describe('the scaffolded skills hook runs without install', async () => {
  await it('lists the available sub-skills', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const output = await runSkills(workspace);

    strict(
      output.includes('regex'),
      'the listing should mention the regex sub-skill'
    );
  });
});
