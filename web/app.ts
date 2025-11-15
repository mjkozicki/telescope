import Overview from './scripts/single/overview'
import Console from './scripts/single/console'
import Bottlenecks from './scripts/single/bottlenecks'
import Resources from './scripts/single/resources'
import Video from './scripts/single/video'
import Filmstrip from './scripts/single/filmstrip'
import Config from './scripts/single/config'
import Metrics from './scripts/single/metrics'
import Waterfall from './scripts/single/waterfall'
import { FileManifest } from '@/types/single/FileManifest'

type SectionName = 
  | 'bottlenecks'
  | 'config'
  | 'console'
  | 'filmstrip'
  | 'metrics'
  | 'overview'
  | 'resources'
  | 'video'
  | 'waterfall'

interface Section {
  id: SectionName
  name: string
  content: string
}

export class App {
  private container: HTMLElement
  private activeSection: SectionName = 'overview'
  private overviewSection: Overview | null = null
  private consoleSection: Console | null = null
  private bottlenecksSection: Bottlenecks | null = null
  private resourcesSection: Resources | null = null
  private videoSection: Video | null = null
  private filmstripSection: Filmstrip | null = null
  private configSection: Config | null = null
  private metricsSection: Metrics | null = null
  private waterfallSection: Waterfall | null = null
  private sections: Section[] = [
    { id: 'overview', name: 'Overview', content: 'Performance overview and summary' },
    { id: 'metrics', name: 'Metrics', content: 'Core Web Vitals and performance metrics' },
    { id: 'filmstrip', name: 'Filmstrip', content: 'Visual progression of page load' },
    { id: 'video', name: 'Video', content: 'Screen recording of page load' },
    { id: 'waterfall', name: 'Waterfall', content: 'Network request waterfall chart' },
    { id: 'resources', name: 'Resources', content: 'Resource loading details' },
    { id: 'console', name: 'Console', content: 'Browser console logs and errors' },
    { id: 'bottlenecks', name: 'Bottlenecks', content: 'Performance bottleneck analysis' },
    { id: 'config', name: 'Config', content: 'Test configuration and settings' },
  ]

  constructor(container: HTMLElement) {
    this.container = container
  }

  testId: string = ''
  basePath: string = '/results'
  private fileManifest: FileManifest | null = null

  private parseRoute(): { testId: string; section: SectionName } {
    const pathname = window.location.pathname
    
    // Parse route: /results/{testId}/{section}
    // Also handle root path and /results path (both show test list)
    const pathMatch = pathname.match(/^\/results\/([^\/]+)(?:\/([^\/]+))?$/)
    
    if (!pathMatch) {
      // No match means root path, /results, or invalid route - show test list
      return { testId: '', section: 'overview' }
    }
    
    const testId = pathMatch[1] || ''
    const section = (pathMatch[2] || 'overview') as SectionName
    
    // Validate section
    const validSection = this.sections.find(s => s.id === section) ? section : 'overview'
    
    return { testId, section: validSection }
  }

  private updateURL(testId: string, section: SectionName): void {
    const newPath = `/results/${testId}/${section}`
    if (window.location.pathname !== newPath) {
      window.history.pushState({ testId, section }, '', newPath)
    }
  }

  private async loadFileManifest(testId: string): Promise<FileManifest | null> {
    try {
      const resultsPath = `${this.basePath}/${testId}`
      const response = await fetch(`${resultsPath}/manifest.json`)
      if (response.ok) {
        const manifest: FileManifest = await response.json()
        
        const fullManifest: FileManifest = {
          video: manifest.video ? `${resultsPath}/${manifest.video}` : null,
          config: `${resultsPath}/${manifest.config}`,
          console: `${resultsPath}/${manifest.console}`,
          engine: `${resultsPath}/${manifest.engine}`,
          filmstrip: manifest.filmstrip.map(f => `${resultsPath}/${f}`),
          metrics: `${resultsPath}/${manifest.metrics}`,
          har: `${resultsPath}/${manifest.har}`,
          resources: `${resultsPath}/${manifest.resources}`,
          screenshot: `${resultsPath}/${manifest.screenshot}`
        }
        return fullManifest
      }
    } catch (error) {
      console.warn('Could not load file manifest:', error)
    }
    return null
  }

  async init(): Promise<void> {
    // Parse route from URL
    const { testId, section } = this.parseRoute()
    this.testId = testId
    this.activeSection = section
    this.basePath = '/results'

    // Handle browser back/forward buttons
    window.addEventListener('popstate', async () => {
      const { testId, section } = this.parseRoute()
      this.testId = testId
      this.activeSection = section
      
      // Reload manifest if testId changed
      if (testId) {
        this.fileManifest = await this.loadFileManifest(testId)
      }
      
      this.render()
      await this.loadSectionData(this.basePath, this.testId)
    })

    if (!this.testId) {
      // Instead of showing an error, fetch the list of test IDs from /results/ (directory names) and render as links
      try {
        const response = await fetch('/results/index.json')
        if (!response.ok) {
          throw new Error('Could not load test list')
        }
        const testIds: string[] = await response.json()
        this.container.innerHTML = `
          <div class="test-list-container">
            ${this.renderCommonNav()}
            <div class="test-list-card">
              <div class="test-list-header">
                  <h1>Test Results</h1>
              </div>
              ${testIds.length === 0 ? (
                '<div class="test-list-empty"><p>No test results found. Upload a test result to get started.</p></div>'
              ) : (
                `<div class="test-list">
                <ul class="test-list-items">
                  ${testIds
                    .map(
                      id =>
                        `<li class="test-list-item">
                          <a href="/results/${id}/overview" class="test-list-link">
                            <span class="test-list-id">${id}</span>
                            <span class="test-list-arrow">→</span>
                          </a>
                        </li>`
                    )
                    .join('')}
                </ul>
              </div>`
              )}
            </div>
          </div>
        `
      } catch (err) {
        this.container.innerHTML = `
          <div class="test-list-container">
            ${this.renderCommonNav()}
            <div class="test-list-card">
              <div class="test-list-header">
                <h1>Test Results</h1>
              </div>
              <div class="test-list-error">
                <p>Could not load list of test results.</p>
              </div>
            </div>
          </div>
        `
      }
      return
    }

    // Load file manifest first
    this.fileManifest = await this.loadFileManifest(this.testId)

    this.render()
    await this.loadSectionData(this.basePath, this.testId)
  }

  render(): void {
    this.container.innerHTML = `
      <div class="app">
        <header>
          <div class="header-content">
            <div class="header-links">
              <a href="/" class="home-link">Home</a>
              <a href="/results" class="results-list-link">Results</a>
            </div>
            <nav class="tabs">
              ${this.renderTabs()}
            </nav>
          </div>
        </header>
        <main>
          <div class="content">
            <div id="section-container">
              ${this.renderActiveSection()}
            </div>
          </div>
        </main>
      </div>
    `

    this.attachEventListeners()
  }

  private renderTabs(): string {
    return this.sections
      .map(
        (section) => `
        <button 
          class="tab ${section.id === this.activeSection ? 'active' : ''}"
          data-section="${section.id}"
        >
          ${section.name}
        </button>
      `
      )
      .join('')
  }

  private renderActiveSection(): string {
    const section = this.sections.find((s) => s.id === this.activeSection)
    if (!section) return '<p>Section not found</p>'

    // For overview, we'll render a placeholder that will be filled by the Overview class
    if (section.id === 'overview') {
      return `<div id="overview-content" class="section-overview"></div>`
    }

    // For console, we'll render a placeholder that will be filled by the Console class
    if (section.id === 'console') {
      return `<div id="console-content" class="section-console"></div>`
    }

    // For bottlenecks, we'll render a placeholder that will be filled by the Bottlenecks class
    if (section.id === 'bottlenecks') {
      return `<div id="bottlenecks-content" class="section-bottlenecks"></div>`
    }

    // For resources, we'll render a placeholder that will be filled by the Resources class
    if (section.id === 'resources') {
      return `<div id="resources-content" class="section-resources"></div>`
    }

    // For video, we'll render a placeholder that will be filled by the Video class
    if (section.id === 'video') {
      return `<div id="video-content" class="section-video"></div>`
    }

    // For filmstrip, we'll render a placeholder that will be filled by the Filmstrip class
    if (section.id === 'filmstrip') {
      return `<div id="filmstrip-content" class="section-filmstrip"></div>`
    }

    // For config, we'll render a placeholder that will be filled by the Config class
    if (section.id === 'config') {
      return `<div id="config-content" class="section-config"></div>`
    }

    // For metrics, we'll render a placeholder that will be filled by the Metrics class
    if (section.id === 'metrics') {
      return `<div id="metrics-content" class="section-metrics"></div>`
    }

    // For waterfall, we'll render a placeholder
    if (section.id === 'waterfall') {
      return `<div id="waterfall-content" class="section-waterfall"></div>`
    }

    return `
      <div class="section-content section-${section.id}">
        <h2>${section.name}</h2>
        <p>${section.content}</p>
      </div>
    `
  }

  private async loadSectionData(basePath: string, testId: string): Promise<void> {
    if (this.activeSection === 'overview') {
      const overviewContainer = this.container.querySelector('#overview-content')
      if (overviewContainer) {
        this.overviewSection = new Overview(overviewContainer as HTMLElement, this.fileManifest)
        await this.overviewSection.loadConfig()
        this.overviewSection.render()
      }
    } else if (this.activeSection === 'console') {
      const consoleContainer = this.container.querySelector('#console-content')
      if (consoleContainer) {
        this.consoleSection = new Console(consoleContainer as HTMLElement, this.fileManifest)
        await this.consoleSection.loadMessages()
        this.consoleSection.render()
      }
    } else if (this.activeSection === 'bottlenecks') {
      const bottlenecksContainer = this.container.querySelector('#bottlenecks-content')
      if (bottlenecksContainer) {
        this.bottlenecksSection = new Bottlenecks(bottlenecksContainer as HTMLElement, this.fileManifest)
        await this.bottlenecksSection.loadResources()
        this.bottlenecksSection.render()
      }
    } else if (this.activeSection === 'resources') {
      const resourcesContainer = this.container.querySelector('#resources-content')
      if (resourcesContainer) {
        this.resourcesSection = new Resources(resourcesContainer as HTMLElement, this.fileManifest)
        await this.resourcesSection.loadResources()
        this.resourcesSection.render()
      }
    } else if (this.activeSection === 'video') {
      const videoContainer = this.container.querySelector('#video-content')
      if (videoContainer) {
        this.videoSection = new Video(videoContainer as HTMLElement, this.fileManifest)
        this.videoSection.render()
      }
    } else if (this.activeSection === 'filmstrip') {
      const filmstripContainer = this.container.querySelector('#filmstrip-content')
      if (filmstripContainer) {
        this.filmstripSection = new Filmstrip(filmstripContainer as HTMLElement, this.fileManifest)
        await this.filmstripSection.loadFilmstrip()
        this.filmstripSection.render()
      }
    } else if (this.activeSection === 'config') {
      const configContainer = this.container.querySelector('#config-content')
      if (configContainer) {
        this.configSection = new Config(configContainer as HTMLElement, this.fileManifest)
        await this.configSection.loadConfig()
        this.configSection.render()
      }
    } else if (this.activeSection === 'metrics') {
      const metricsContainer = this.container.querySelector('#metrics-content')
      if (metricsContainer) {
        this.metricsSection = new Metrics(metricsContainer as HTMLElement, this.fileManifest)
        await this.metricsSection.loadMetrics()
        this.metricsSection.render()
      }
    } else if (this.activeSection === 'waterfall') {
      const waterfallContainer = this.container.querySelector('#waterfall-content')
      if (waterfallContainer) {
        this.waterfallSection = new Waterfall(waterfallContainer as HTMLElement, basePath, testId, this.fileManifest)
        await this.waterfallSection.loadWaterfall()
        this.waterfallSection.render()
      }
    }
  }

  private attachEventListeners(): void {
    const tabs = this.container.querySelectorAll<HTMLButtonElement>('.tab')

    tabs.forEach((tab) => {
      tab.addEventListener('click', async () => {
        const sectionId = tab.dataset.section as SectionName
        if (sectionId && this.testId) {
          this.activeSection = sectionId
          this.updateURL(this.testId, sectionId)
          this.render()
          await this.loadSectionData(this.basePath, this.testId)
        }
      })
    })
  }

  getActiveSection(): SectionName {
    return this.activeSection
  }

  async setActiveSection(section: SectionName): Promise<void> {
    if (!this.testId) {
      console.error('Cannot set section: testId is required')
      return
    }
    this.activeSection = section
    this.updateURL(this.testId, section)
    this.render()
    await this.loadSectionData(this.basePath, this.testId)
  }

  private renderCommonNav(): string {
    return `
      <nav class="common-nav">
        <a href="/" class="nav-link">Simple</a>
        <a href="/advanced" class="nav-link">Advanced</a>
        <a class="nav-link" disabled>Results</a>
        <a href="/upload" class="nav-link">Upload</a>
      </nav>
    `
  }
}

