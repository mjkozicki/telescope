// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  vite: {
    ssr: {
      // Allow Node.js modules in SSR for development
      external: [],
      noExternal: ['fs', 'path']
    }
  },
  output: 'server'
});