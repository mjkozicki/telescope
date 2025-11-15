import { describe, it, expect, beforeEach } from 'vitest'
import { App } from '../app'

describe('App', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('renders the app title', () => {
    const app = new App(container)
    app.render()
    
    const title = container.querySelector('h1')
    expect(title?.textContent).toBe('Real Telescope UI')
  })

  it('renders the tabs navigation', () => {
    const app = new App(container)
    app.render()
    
    const tabs = container.querySelectorAll('.tab')
    expect(tabs.length).toBe(9) // 9 sections
  })

  it('renders all section tabs', () => {
    const app = new App(container)
    app.render()
    
    const tabs = container.querySelectorAll('.tab')
    const tabNames = Array.from(tabs).map(tab => tab.textContent?.trim())
    
    expect(tabNames).toContain('Overview')
    expect(tabNames).toContain('Metrics')
    expect(tabNames).toContain('Filmstrip')
    expect(tabNames).toContain('Video')
    expect(tabNames).toContain('Waterfall')
  })

  it('sets overview as default active section', () => {
    const app = new App(container)
    expect(app.getActiveSection()).toBe('overview')
  })

  it('allows changing active section', () => {
    const app = new App(container)
    app.setActiveSection('metrics')
    
    expect(app.getActiveSection()).toBe('metrics')
  })

  it('highlights the active tab', () => {
    const app = new App(container)
    app.render()
    
    const activeTab = container.querySelector('.tab.active')
    expect(activeTab?.textContent?.trim()).toBe('Overview')
  })

  it('displays content for active section', () => {
    const app = new App(container)
    app.render()
    
    const content = container.querySelector('.section-content')
    expect(content).toBeTruthy()
  })
})

