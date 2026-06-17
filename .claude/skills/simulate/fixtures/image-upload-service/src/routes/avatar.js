import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

export const handleAvatarUpload = async (request, response, file) => {
  const destination = join(UPLOAD_DIR, file.filename);
  await writeFile(destination, file.data);

  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(
    JSON.stringify({
      url: `/uploads/${file.filename}`,
      type: file.declaredType,
    })
  );
};
