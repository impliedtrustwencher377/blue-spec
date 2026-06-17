import type { SpecTokenCount } from '../types/core.js';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { get_encoding } from 'tiktoken';

const listMarkdownFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)));

  return files.sort((left, right) => left.localeCompare(right));
};

export const countSpecTokens = async (
  specDir: string
): Promise<SpecTokenCount[]> => {
  const files = await listMarkdownFiles(specDir);
  const encoding = get_encoding('o200k_base');

  try {
    return await Promise.all(
      files.map(async (file) => {
        const contents = await readFile(join(specDir, file), 'utf8');

        return {
          relativePath: file.split(sep).join('/'),
          tokens: encoding.encode(contents).length,
        };
      })
    );
  } finally {
    encoding.free();
  }
};
