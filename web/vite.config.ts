import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import AdmZip from 'adm-zip'
import busboy from 'busboy'
import { generateManifest } from './generate-manifest.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'results-index-endpoint',
      configureServer: (server) => {
        server.middlewares.use('/results/index.json', async (req, res) => {
          // Only handle GET requests
          if (req.method !== 'GET') {
            res.writeHead(405, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          try {
            const resultsDir = path.join(__dirname, 'public', 'results')

            // Check if results directory exists
            if (!fs.existsSync(resultsDir)) {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify([]))
              return
            }

            // Read directory contents
            const entries = fs.readdirSync(resultsDir, { withFileTypes: true })

            // Filter for directories only and exclude index.json if it exists as a file
            const testIds = entries
              .filter(entry => entry.isDirectory())
              .map(entry => entry.name)
              .sort()

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(testIds))
          } catch (error) {
            console.error('Error reading results directory:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error'
            }))
          }
        })
      }
    },
    {
      name: 'submit-test-endpoint',
      configureServer: (server) => {
        server.middlewares.use('/api/submit-test', async (req, res) => {
          // Only handle POST requests
          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          try {
            // Parse JSON body
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })

            req.on('end', () => {
              try {
                const testData = JSON.parse(body)

                if (!testData.url) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'URL is required' }))
                  return
                }

                // Generate a unique test ID with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
                const randomId = Math.random().toString(36).substring(2, 10)
                const testId = `${timestamp}_${randomId}`

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

                fs.writeFileSync(testFilePath, JSON.stringify(requestData, null, 2))

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  success: true,
                  testId,
                  redirectUrl: `/running?testId=${testId}`
                }))
              } catch (parseError) {
                console.error('Error parsing JSON:', parseError)
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  error: 'Invalid JSON',
                  message: parseError instanceof Error ? parseError.message : 'Unknown error'
                }))
              }
            })

            req.on('error', (error) => {
              console.error('Request error:', error)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
              }))
            })
          } catch (error) {
            console.error('Submit test error:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error'
            }))
          }
        })
      }
    },
    {
      name: 'upload-endpoint',
      configureServer: (server) => {
        server.middlewares.use('/api/upload', async (req, res) => {
          // Only handle POST requests
          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          try {
            // Parse multipart/form-data using busboy
            const contentType = req.headers['content-type'] || ''
            if (!contentType.includes('multipart/form-data')) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Invalid content type' }))
              return
            }

            let zipBuffer: Buffer | null = null
            let filename = ''

            try {
              await new Promise<void>((resolve, reject) => {
                const bb = busboy({ headers: req.headers })

                bb.on('file', (name, file, info) => {
                  const { filename: fileFilename } = info
                  filename = fileFilename

                  const chunks: Buffer[] = []
                  file.on('data', (chunk: Buffer) => {
                    chunks.push(chunk)
                  })

                  file.on('end', () => {
                    zipBuffer = Buffer.concat(chunks)
                  })

                  file.on('error', (err: Error) => {
                    reject(err)
                  })
                })

                bb.on('error', (err: Error) => {
                  reject(err)
                })

                bb.on('finish', () => {
                  resolve()
                })

                req.pipe(bb)
              })
            } catch (parseErr) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                error: 'Error parsing form data',
                message: parseErr instanceof Error ? parseErr.message : 'Unknown error'
              }))
              return
            }

            if (!zipBuffer || !filename) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'No file uploaded' }))
              return
            }

            // Extract testId from filename (remove .zip extension)
            const testId = filename.replace(/\.zip$/i, '')
            if (!testId) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Invalid filename' }))
              return
            }

            // Check if directory already exists
            const resultsDir = path.join(__dirname, 'public', 'results')
            const testDir = path.join(resultsDir, testId)

            if (fs.existsSync(testDir)) {
              res.writeHead(409, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                error: 'Directory already exists',
                testId
              }))
              return
            }

            // Create directory
            fs.mkdirSync(testDir, { recursive: true })

            // Unzip the file
            const zip = new AdmZip(zipBuffer)
            zip.extractAllTo(testDir, true)

            // Generate manifest
            const manifest = generateManifest(testId, 'public/results')

            // Return success response
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              success: true,
              testId,
              manifest,
              url: `/results/${testId}/overview`
            }))

          } catch (error) {
            console.error('Upload error:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error'
            }))
          }
        })
      }
    },
    {
      name: 'manifest-endpoint',
      configureServer: (server) => {
        server.middlewares.use(async (req, res, next) => {
          // Only handle GET requests to /results/*/manifest.json
          if (req.method !== 'GET' || !req.url) {
            return next()
          }

          // Match URLs like /results/{testId}/manifest.json
          const manifestMatch = req.url.match(/^\/results\/([^/]+)\/manifest\.json/)
          if (!manifestMatch) {
            return next()
          }

          const testId = manifestMatch[1]
          try {
            // Check if the results directory exists
            const testDir = path.join(__dirname, 'public', 'results', testId)

            console.log('manifest endpoint', testDir);
            if (!fs.existsSync(testDir)) {
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Test results not found' }))
              return
            }

            const manifest = fs.readFileSync(path.join(testDir, 'manifest.json'), 'utf-8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(manifest)
          } catch (error) {
            console.error('Error generating manifest:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error'
            }))
          }
        })
      }
    },
    {
      name: 'spa-fallback',
      configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const urlPath = req.url.split('?')[0] // Remove query string
            const hasExtension = path.extname(urlPath) !== ''

            // If it's a route (no file extension), serve index.html for SPA routing
            // But allow actual files to be served (e.g., /results/one/config.json)
            // Also exclude Vite internal routes and API endpoints
            if (!hasExtension &&
              !urlPath.startsWith('/@') &&
              !urlPath.startsWith('/node_modules') &&
              !urlPath.startsWith('/api/') &&
              urlPath !== '/favicon.ico') {
              req.url = '/index.html'
            }
            //console.log('req.url - ', req.url, 'hasExtension:', hasExtension, 'urlPath:', urlPath)
          }
          next()
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    copyPublicDir: true
  },
  publicDir: 'public',
  server: {
    port: 4056,
    open: true
  },
  preview: {
    port: 4056
  }
})

