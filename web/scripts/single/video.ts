import { FileManifest } from "@/types/single/FileManifest"

export class Video {
  private container: HTMLElement
  private videoPath: string = ''

  constructor(container: HTMLElement, fileManifest: FileManifest | null = null) {
    this.container = container
    this.videoPath = fileManifest?.video || ''
  }

  render(): void {
    if (!this.videoPath) {
      this.container.innerHTML = '<p>No video available</p>'
      return
    }

    this.container.innerHTML = `
      <div class="video-container">
        <div class="video-wrapper">
          <video controls preload="metadata" class="page-load-video">
            <source src="${this.videoPath}" type="video/webm">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  private attachEventListeners(): void {
    const video = this.container.querySelector<HTMLVideoElement>('.page-load-video')

    if (video) {
      // Add event listeners for video events if needed
      video.addEventListener('loadedmetadata', () => {
        console.log('Video loaded:', {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        })
      })

      video.addEventListener('error', (e) => {
        console.error('Video error:', e)
        const wrapper = this.container.querySelector('.video-wrapper')
        if (wrapper) {
          wrapper.innerHTML = `
            <div class="video-error">
              <p>Failed to load video. The file may be missing or in an unsupported format.</p>
              <p class="error-details">File: ${this.videoPath}</p>
            </div>
          `
        }
      })
    }
  }
}

export default Video
