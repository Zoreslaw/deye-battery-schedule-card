import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
export default {
  input: 'src/deye-battery-schedule-card.ts',
  output: { file: 'dist/deye-battery-schedule-card.js', format: 'es', inlineDynamicImports: true },
  plugins: [nodeResolve(), typescript()],
};
