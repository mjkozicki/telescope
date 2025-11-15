import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import busboy from 'busboy'
import { generateManifest } from './generate-manifest.js'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = process.env.PORT || 4056

const app = express()

// Parse JSON bodies for API requests
app.use('/api', express.json())

// Submit test endpoint
app.post('/api/submit-test', async (req, res) => {
  try {
    const testData = req.body

    if (!testData.url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Generate a unique test ID with timestamp

    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
  
    const testId = year + '_' + month + '_' + date + '_' + crypto.randomUUID();

    // Create requested directory if it doesn't exist
    const requestedDir = path.join(__dirname, 'public', 'requested')
    if (!fs.existsSync(requestedDir)) {
      fs.mkdirSync(requestedDir, { recursive: true })
    }

    // Save the test request data
    const testFilePath = path.join(requestedDir, `${testId}.json`)
    const requestData = {
      ...testData,
      testId,
      requestedAt: new Date().toISOString(),
      status: 'requested'
    }

    fs.writeFileSync(testFilePath, JSON.stringify(requestData, null, 2));
    // Read config.json to get agentUrl
    const configPath = path.join(__dirname, 'config.json')
    let agentUrl = null
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf-8')
      try {
        const config = JSON.parse(configData)
        agentUrl = config.agentUrl
      } catch (err) {
        console.error('Failed to parse config.json:', err)
      }
    }

    if (!agentUrl) {
      console.warn('agentUrl not found in config.json')
    } else {
      // Make HTTP POST request to agentUrl with test data
      try {
        var response = await fetch(agentUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        })
        var data = await response.json()
        console.log(data)
      } catch (err) {
        console.error('Failed HTTP call to agentUrl:', err)
      }
    }

    res.json({
      success: true,
      testId,
      redirectUrl: `/running?testId=${testId}`
    })
  } catch (error) {
    console.error('Submit test error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Results index endpoint (must be before static file serving)
app.get('/results/index.json', (req, res) => {
  try {
    const resultsDir = path.join(__dirname, 'public', 'results')

    if (!fs.existsSync(resultsDir)) {
      return res.json([])
    }

    const entries = fs.readdirSync(resultsDir, { withFileTypes: true })
    const testIds = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()

    res.json(testIds)
  } catch (error) {
    console.error('Error reading results directory:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Upload endpoint
app.post('/api/upload', async (req, res) => {
  console.log('upload endpoint');
  try {
    const contentType = req.headers['content-type'] || ''
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Invalid content type' })
    }

    let zipBuffer = null
    let filename = ''
console.log('starting upload');
    await new Promise((resolve, reject) => {
      const bb = busboy({ headers: req.headers })

      bb.on('file', (name, file, info) => {
        const { filename: fileFilename } = info
        filename = fileFilename

        const chunks = []
        file.on('data', (chunk) => {
          console.log('chunking..');
          chunks.push(chunk)
        })

        file.on('end', () => {
          console.log('chunking done');
          zipBuffer = Buffer.concat(chunks)
        })

        file.on('error', (err) => {
          console.log('chunking error');
          reject(err)
        })
      })

      bb.on('error', (err) => {
        console.log('busboy error');
        reject(err)
      })

      bb.on('finish', () => {
        console.log('busboy finish');
        resolve()
      })

      req.pipe(bb)
    }).catch((err) => {
      console.log('busboy error', err);
      return res.status(400).json({
        error: 'Error parsing form data',
        message: err instanceof Error ? err.message : 'Unknown error'
      })
    })

    if (!zipBuffer || !filename) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const testId = filename.replace(/\.zip$/i, '')
    if (!testId) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    const resultsDir = path.join(__dirname, 'public', 'results')
    const testDir = path.join(resultsDir, testId)

    if (fs.existsSync(testDir)) {
      return res.status(409).json({
        error: 'Directory already exists',
        testId
      })
    }

    fs.mkdirSync(testDir, { recursive: true })

    const zip = new AdmZip(zipBuffer)
    zip.extractAllTo(testDir, true)

    let manifest = null;
    const manifestPath = path.join(testDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      manifest = generateManifest(testId, 'public/results');
      fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf-8');
    } else {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    }

    res.json({
      success: true,
      testId,
      manifest,
      url: `/results/${testId}/overview`
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Serve static files (after API routes)
app.use(express.static(join(__dirname, 'dist')))

// Serve public directory for results (but not index.json which is handled above)
app.use('/results', express.static(join(__dirname, 'public', 'results'), {
  index: false // Don't serve index files
}))

// SPA fallback - serve index.html for all non-API routes
app.use((req, res, next) => {
  const url = req.originalUrl.split('?')[0] // Remove query string
  console.log('fallback', url);
  // Skip API routes
  if (url.startsWith('/api/')) {
    return res.status(404).send('Not found')
  }

  // For /results/* routes with file extensions, let Express handle 404 naturally
  // (static middleware already tried to serve it, so if we're here, it doesn't exist)
  if (url.startsWith('/results/') && path.extname(url) !== '') {
    return res.status(404).send('Not found')
  }
  // Serve SPA for all other routes (including /results/{testId}/{section})
  try {
    const template = fs.readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8')
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
  } catch (e) {
    console.error('Error serving index.html:', e)
    res.status(500).send('Internal server error')
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})

