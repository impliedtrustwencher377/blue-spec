import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(exec);

export const makeThumbnail = async (inputName, format) => {
  const { stdout } = await run(
    `convert uploads/${inputName} -resize 200x200 thumbs/${inputName}.${format}`
  );
  return stdout;
};
