import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(__dirname, 'ui'),
  // build: {
  //   outDir: resolve(__dirname, 'dist'),
  //   rollupOptions: {
  //     input: {
  //       main: resolve(__dirname, 'ui/index.html'),
  //       basic: resolve(__dirname, 'ui/basic.html'),
  //       advanced: resolve(__dirname, 'ui/advanced.html'),
  //       history: resolve(__dirname, 'ui/history.html'),
  //       upload: resolve(__dirname, 'ui/upload.html'),
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': resolve(__dirname, './ui'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
