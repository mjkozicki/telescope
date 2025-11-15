import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { FileManifest } from '@/types/single/FileManifest'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function generateManifest(testId: string, resultsBasePath: string = 'public/results'): FileManifest {
  const testDir = path.join(__dirname, resultsBasePath, testId)
  if (!fs.existsSync(testDir)) {
    throw new Error(`Directory not found: ${testDir}`)
  }

  console.log(`Generating manifest for: ${testId}`)
  console.log(`Scanning directory: ${testDir}`)
  const files = fs.readdirSync(testDir)
  
  // Check if filmstrip directory exists
  const filmstripDir = path.join(testDir, 'filmstrip')
  const filmstripFiles: string[] = []
  if (fs.existsSync(filmstripDir)) {
    const filmstrips = fs.readdirSync(filmstripDir)
    filmstrips.forEach((file) => {
      filmstripFiles.push(path.join('filmstrip', file))
    })
  }

  const videoFiles = files.filter((file) => file.toLowerCase().endsWith('.webm'))
  const videoFile = !videoFiles.length ? null : videoFiles[0]
  const configFile = 'config.json'
  const consoleFile = 'console.json'
  const engineFile = 'engine.png'
  const metricsFile = 'metrics.json'
  const harFile = 'pageload.har'
  const resourcesFile = 'resources.json'
  const screenshotFile = 'screenshot.png'

  const manifest: FileManifest = {
    video: videoFile,
    config: configFile,
    console: consoleFile,
    engine: engineFile,
    filmstrip: filmstripFiles,
    metrics: metricsFile,
    har: harFile,
    resources: resourcesFile,
    screenshot: screenshotFile
  }

  const manifestPath = path.join(testDir, 'manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`✓ Manifest generated: ${manifestPath}`)
  
  return manifest
}

// Main execution (only when run directly)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const testId = args[0]
  const basePath = args[1] || 'public/results'
  generateManifest(testId, basePath)
}

