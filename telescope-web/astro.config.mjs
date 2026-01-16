// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 4321,
      },
    },
    ssr: {
      // Allow Node.js modules in SSR for development
      external: [],
      noExternal: ['fs', 'path']
    }
  },
  output: 'server'
});