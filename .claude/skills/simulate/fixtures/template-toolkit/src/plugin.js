import { join } from 'node:path';

export const loadPlugin = async (name) => {
  const module = await import(join(process.cwd(), 'plugins', name));
  return module.default;
};

const REGISTRY = {
  markdown: () => import('./plugins/markdown.js'),
  slug: () => import('./plugins/slug.js'),
};

export const resolvePlugin = async (name) => {
  const loader = REGISTRY[name];
  if (!loader) throw new Error(`Unknown plugin: ${name}`);
  const module = await loader();
  return module.default;
};
