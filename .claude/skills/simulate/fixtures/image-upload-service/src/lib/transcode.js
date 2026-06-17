import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

const ALLOWED_FORMATS = new Set(['png', 'jpg', 'webp']);
const SAFE_NAME = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;

export const transcode = async (inputName, format) => {
  if (!SAFE_NAME.test(inputName)) {
    throw new Error('Invalid input name');
  }
  if (!ALLOWED_FORMATS.has(format)) {
    throw new Error('Unsupported format');
  }

  const { stdout } = await run('convert', [
    `uploads/${inputName}`,
    '-resize',
    '800x600',
    `output/${inputName}.${format}`,
  ]);
  return stdout;
};
