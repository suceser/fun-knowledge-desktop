import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      'main': path.resolve(__dirname, 'src/main'),
      'mservices': path.resolve(__dirname, 'src/main/services'),
      'renderer': path.resolve(__dirname, 'src/renderer'),
      'components': path.resolve(__dirname, 'src/renderer/components'),
      'hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      'rservices': path.resolve(__dirname, 'src/renderer/services'),
    }
  }
});
