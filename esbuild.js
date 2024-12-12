import { build } from 'esbuild';

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: './dist/app.js',
}).catch(() => process.exit(1));