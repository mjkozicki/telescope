export class Upload {
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  render(): void {
    this.container.innerHTML = `
      <div class="section-upload">
        ${this.renderCommonNav()}
        <div class="upload-card">
          <div class="upload-header">
            <h1>Upload Test Results</h1>
          </div>
          <div class="upload-container">
          <p class="upload-description">
            Upload a zip file containing test results. The filename (without .zip extension) will be used as the test ID.
          </p>
          
          <form id="upload-form" class="upload-form">
            <div class="file-input-wrapper">
              <input 
                type="file" 
                id="file-input" 
                name="file" 
                accept=".zip" 
                required
                class="file-input"
              />
              <label for="file-input" class="file-input-label">
                <span class="file-input-text">Choose a zip file</span>
                <span class="file-input-button">Browse</span>
              </label>
              <div id="file-name" class="file-name"></div>
            </div>
            
            <div id="upload-status" class="upload-status"></div>
            
            <button type="submit" id="upload-button" class="upload-button" disabled>
              Upload
            </button>
          </form>
          
          <div id="upload-result" class="upload-result"></div>
        </div>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  private renderCommonNav(): string {
    return `
      <nav class="common-nav">
        <a href="/" class="nav-link">Simple</a>
        <a href="/advanced" class="nav-link">Advanced</a>
        <a href="/results" class="nav-link">Results</a>
        <a class="nav-link" disabled>Upload</a>
      </nav>
    `
  }

  private attachEventListeners(): void {
    const form = this.container.querySelector('#upload-form') as HTMLFormElement
    const fileInput = this.container.querySelector('#file-input') as HTMLInputElement
    const fileName = this.container.querySelector('#file-name') as HTMLElement
    const uploadButton = this.container.querySelector('#upload-button') as HTMLButtonElement
    const uploadStatus = this.container.querySelector('#upload-status') as HTMLElement
    const uploadResult = this.container.querySelector('#upload-result') as HTMLElement

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      
      if (file) {
        fileName.textContent = file.name
        fileName.classList.add('has-file')
        uploadButton.disabled = false
        
        // Validate file extension
        if (!file.name.toLowerCase().endsWith('.zip')) {
          uploadStatus.textContent = 'Please select a .zip file'
          uploadStatus.className = 'upload-status error'
          uploadButton.disabled = true
        } else {
          uploadStatus.textContent = ''
          uploadStatus.className = 'upload-status'
        }
      } else {
        fileName.textContent = ''
        fileName.classList.remove('has-file')
        uploadButton.disabled = true
      }
    })

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const file = fileInput.files?.[0]
      if (!file) {
        uploadStatus.textContent = 'Please select a file'
        uploadStatus.className = 'upload-status error'
        return
      }

      // Disable form during upload
      uploadButton.disabled = true
      uploadButton.textContent = 'Uploading...'
      uploadStatus.textContent = 'Uploading file...'
      uploadStatus.className = 'upload-status info'
      uploadResult.innerHTML = ''

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (response.ok && data.success) {
          uploadStatus.textContent = 'Upload successful!'
          uploadStatus.className = 'upload-status success'
          
          uploadResult.innerHTML = `
            <div class="result-success">
              <h3>✓ Upload Complete</h3>
              <p><strong>Test ID:</strong> ${data.testId}</p>
              <p><strong>URL:</strong> <a href="${data.url}" class="result-link">${data.url}</a></p>
              <button id="view-results" class="view-results-button">View Results</button>
            </div>
          `

          // Add click handler for view results button
          const viewResultsButton = uploadResult.querySelector('#view-results') as HTMLButtonElement
          viewResultsButton.addEventListener('click', () => {
            window.location.href = data.url
          })

          // Reset form
          form.reset()
          fileName.textContent = ''
          fileName.classList.remove('has-file')
        } else {
          uploadStatus.textContent = data.error || 'Upload failed'
          uploadStatus.className = 'upload-status error'
          
          uploadResult.innerHTML = `
            <div class="result-error">
              <h3>✗ Upload Failed</h3>
              <p>${data.error || 'Unknown error'}</p>
              ${data.message ? `<p class="error-detail">${data.message}</p>` : ''}
            </div>
          `
        }
      } catch (error) {
        uploadStatus.textContent = 'Network error occurred'
        uploadStatus.className = 'upload-status error'
        
        uploadResult.innerHTML = `
          <div class="result-error">
            <h3>✗ Upload Failed</h3>
            <p>Network error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        `
      } finally {
        uploadButton.disabled = false
        uploadButton.textContent = 'Upload'
      }
    })
  }
}

