import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import Busboy from 'busboy';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/test-results', express.static('test-results'));

// API Routes

// POST /api/submit-test
app.post('/api/submit-test', async (req, res) => {
  try {
    const testData = req.body;

    if (!testData.url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Generate unique test ID
    const date = new Date();
    const dateStr = `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}_${String(date.getDate()).padStart(2, '0')}`;
    const testId = `${dateStr}_${crypto.randomUUID().split('-')[0]}`;

    // Create requested directory
    const requestedDir = join(__dirname, 'requested');
    if (!existsSync(requestedDir)) {
      mkdirSync(requestedDir, { recursive: true });
    }

    // Save test request
    const testFilePath = join(requestedDir, `${testId}.json`);
    const requestData = {
      ...testData,
      testId,
      requestedAt: new Date().toISOString(),
      status: 'requested'
    };

    writeFileSync(testFilePath, JSON.stringify(requestData, null, 2));

    res.json({ success: true, testId });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

// GET /api/results
app.get('/api/results', (req, res) => {
  try {
    const resultsDir = join(__dirname, 'test-results');
    
    if (!existsSync(resultsDir)) {
      return res.json({ results: [] });
    }

    const results = [];
    const entries = readdirSync(resultsDir);

    for (const entry of entries) {
      const entryPath = join(resultsDir, entry);
      const stat = statSync(entryPath);

      if (stat.isDirectory()) {
        const configPath = join(entryPath, 'config.json');
        const harPath = join(entryPath, 'pageload.har');
        const screenshotPath = join(entryPath, 'screenshot.png');

        let config = {};
        let har = {};

        if (existsSync(configPath)) {
          config = JSON.parse(readFileSync(configPath, 'utf-8'));
        }

        if (existsSync(harPath)) {
          har = JSON.parse(readFileSync(harPath, 'utf-8'));
        }

        results.push({
          testId: entry,
          url: config.url || har?.log?.pages?.[0]?.title || 'Unknown',
          browser: config.browser || 'Unknown',
          timestamp: stat.mtime,
          screenshotUrl: existsSync(screenshotPath) ? `/test-results/${entry}/screenshot.png` : null
        });
      }
    }

    // Sort by timestamp descending
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ results });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// GET /api/results/:testId
app.get('/api/results/:testId', (req, res) => {
  try {
    const { testId } = req.params;
    const testDir = join(__dirname, 'test-results', testId);

    if (!existsSync(testDir)) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const data = {};
    const files = ['manifest.json', 'config.json', 'metrics.json', 'resources.json', 'console.json', 'pageload.har'];

    for (const file of files) {
      const filePath = join(testDir, file);
      if (existsSync(filePath)) {
        const key = file.replace('.json', '').replace('pageload.', '');
        data[key] = JSON.parse(readFileSync(filePath, 'utf-8'));
      }
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ error: 'Failed to fetch test result' });
  }
});

// POST /api/upload
app.post('/api/upload', (req, res) => {
  try {
    const busboy = Busboy({ headers: req.headers });
    let testId = null;
    let uploadPath = null;

    busboy.on('file', (fieldname, file, info) => {
      const { filename } = info;
      
      // Generate test ID from filename or create new one
      testId = filename.replace('.zip', '') || `upload_${Date.now()}`;
      const resultsDir = join(__dirname, 'test-results', testId);

      if (!existsSync(resultsDir)) {
        mkdirSync(resultsDir, { recursive: true });
      }

      uploadPath = join(resultsDir, 'upload.zip');
      const writeStream = createWriteStream(uploadPath);

      file.pipe(writeStream);

      writeStream.on('finish', () => {
        // Extract the zip file
        try {
          const zip = new AdmZip(uploadPath);
          zip.extractAllTo(resultsDir, true);

          // Check for manifest.json, if not present create a basic one
          const manifestPath = join(resultsDir, 'manifest.json');
          if (!existsSync(manifestPath)) {
            const manifest = {
              testId,
              uploadedAt: new Date().toISOString(),
              files: readdirSync(resultsDir)
            };
            writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
          }

          res.json({ success: true, testId });
        } catch (error) {
          console.error('Error extracting zip:', error);
          res.status(500).json({ error: 'Failed to extract archive' });
        }
      });
    });

    busboy.on('error', (error) => {
      console.error('Busboy error:', error);
      res.status(500).json({ error: 'Upload failed' });
    });

    req.pipe(busboy);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

