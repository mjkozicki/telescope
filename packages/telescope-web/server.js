import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function createServer() {
  const app = express();

  let vite;
  
  if (!isProduction) {
    // Create Vite dev server - must be before static file serving
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: resolve(__dirname, './ui'),
    });
    // Use vite's connect instance as middleware - handles TypeScript, etc.
    app.use(vite.middlewares);
  }

  // Serve static assets (only after Vite middleware in dev mode)
  app.use('/img', express.static(resolve(__dirname, './ui/img')));
  app.use('/styles', express.static(resolve(__dirname, './ui/styles')));

  if (isProduction) {
    app.use(express.static(resolve(__dirname, './ui')));
  }

  // Serve index.html for all routes (SPA routing)
  app.get('*', async (req, res) => {
    try {
      let template;
      const indexPath = resolve(__dirname, './ui/index.html');
      const content = readFileSync(indexPath, 'utf-8').toString();

      if (isProduction) {
        template = content;
      } else {
        template = await vite.transformIndexHtml(req.url, content);
      }
      
      res.setHeader('Content-Type', 'text/html');
      res.send(template);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send(`<pre>${error.message}\n${error.stack}</pre>`);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Mode: ${isProduction ? 'production' : 'development'}`);
  });
}

createServer();
