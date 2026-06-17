import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MAX_BYTES = 5 * 1024 * 1024;

const detectImageType = (data) => {
  if (
    data.length >= 8 &&
    data
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { ext: 'png', mime: 'image/png' };
  }
  if (
    data.length >= 3 &&
    data[0] === 0xff &&
    data[1] === 0xd8 &&
    data[2] === 0xff
  ) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }
  if (
    data.length >= 6 &&
    /^GIF8[79]a$/.test(data.subarray(0, 6).toString('ascii'))
  ) {
    return { ext: 'gif', mime: 'image/gif' };
  }
  return null;
};

export const handlePhotoUpload = async (request, response, file) => {
  if (file.data.length > MAX_BYTES) {
    response.writeHead(413, { 'content-type': 'text/plain' });
    response.end('File too large');
    return;
  }

  const detected = detectImageType(file.data);
  if (!detected) {
    response.writeHead(415, { 'content-type': 'text/plain' });
    response.end('Only image files are accepted');
    return;
  }

  const safeName = `${randomUUID()}.${detected.ext}`;
  await writeFile(join(UPLOAD_DIR, safeName), file.data);

  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(
    JSON.stringify({ url: `/uploads/${safeName}`, type: detected.mime })
  );
};
