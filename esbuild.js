import { build } from 'esbuild';

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/app.js', // Компилируем в dist
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  external: ['*'], // Исключить все зависимости из node_modules
}).then(() => {
  console.log('Build complete!');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
