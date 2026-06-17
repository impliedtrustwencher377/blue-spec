#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { loadPlugin } from '../src/plugin.js';
import { renderTemplate } from '../src/render.js';

const [command, ...rest] = process.argv.slice(2);

if (command === 'render') {
  const [file, ...pairs] = rest;
  const template = await readFile(file, 'utf8');
  const data = Object.fromEntries(
    pairs.map((pair) => {
      const index = pair.indexOf('=');
      return [pair.slice(0, index), pair.slice(index + 1)];
    })
  );
  process.stdout.write(renderTemplate(template, data));
} else if (command === 'plugin') {
  const [name, input] = rest;
  const plugin = await loadPlugin(name);
  process.stdout.write(String(plugin(input)));
} else {
  process.stdout.write('Usage: tmpl <render|plugin> ...\n');
}
