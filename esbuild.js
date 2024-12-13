import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

const packageJsonPath = './package.json';
const distPath = './dist/package.json';

fs.copyFileSync(packageJsonPath, distPath);

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/app.js',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  external: ['*'],
  minify: true,
  sourcemap: true,
}).then(() => {
  console.log('Build complete!');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});