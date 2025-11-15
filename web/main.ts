import './styles/main.css'
import './styles/single/overview.css'
import './styles/single/bottlenecks.css'
import './styles/single/console.css'
import './styles/single/resources.css'
import './styles/single/video.css'
import './styles/single/filmstrip.css'
import './styles/single/config.css'
import './styles/single/metrics.css'
import './styles/single/waterfall.css'
import './styles/start/simple.css'
import './styles/start/advanced.css'
import './styles/start/running.css'
import './styles/upload.css'
import { App } from './app'
import { Upload } from './scripts/upload'
import { Simple } from './scripts/start/simple'
import { Advanced } from './scripts/start/advanced'
import { Running } from './scripts/start/running'

// Check if we're on the upload page
const path = window.location.pathname
const appContainer = document.getElementById('app')

if (appContainer) {
  if (path === '/upload' || path.startsWith('/upload/')) {
    // Show upload page
    const upload = new Upload(appContainer)
    upload.render()
  } else if (path === '/' || path === '/start') {
    // Show simple form page
    const simple = new Simple(appContainer)
    simple.render()
  } else if (path === '/advanced') {
    // Show advanced form page
    const advanced = new Advanced(appContainer)
    advanced.render()
  } else if (path === '/running') {
    // Show running page
    const running = new Running(appContainer)
    running.render()
  } else {
    // Show main app with results
    const app = new App(appContainer)
    app.init()
  }
}

