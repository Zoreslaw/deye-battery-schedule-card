import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import { readFileSync } from 'node:fs';
export default {
  input: 'src/deye-battery-schedule-card.ts',
  output: {
    file: 'dist/deye-battery-schedule-card.js',
    format: 'es',
    inlineDynamicImports: true,
    banner: `/*! Bundled dependency: Flatpickr\n${readFileSync('node_modules/flatpickr/LICENSE.md', 'utf8')}*/`,
  },
  plugins: [nodeResolve(), typescript()],
};
