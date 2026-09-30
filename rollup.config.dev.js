import config from './rollup.config.js';
import serve from 'rollup-plugin-serve';
export default {
  ...config,
  plugins: [
    ...config.plugins,
    serve({ contentBase: '.', host: 'localhost', port: 5001, headers: { 'Cache-Control': 'no-store' } }),
  ],
};
