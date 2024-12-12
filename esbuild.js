import { build } from 'esbuild';

build({
  entryPoints: ['./src/index.ts'],
  outfile: './shared/logger/app.js',
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  external: ['better-sqlite3'],
}).then(() => {
  console.log('Build complete!');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});