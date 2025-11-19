<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: videoPath = data.manifest?.video;
  $: testId = data.testId;
  $: videoUrl = videoPath ? `/test-results/${testId}/${videoPath}` : null;
</script>

<div class="section-content">
  {#if videoUrl}
    <div class="video-container">
      <video 
        class="video-player" 
        controls 
        preload="metadata"
        poster="/test-results/{testId}/screenshot.png"
      >
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div class="video-info">
        <div class="info-item">
          <span class="info-label">Format:</span>
          <span class="info-value">{videoPath?.split('.').pop()?.toUpperCase() || 'Unknown'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">File:</span>
          <span class="info-value">{videoPath || 'Unknown'}</span>
        </div>
      </div>
    </div>
  {:else}
    <p class="placeholder">No video recording available for this test.</p>
  {/if}
</div>

<style>
  .video-container {
    margin-top: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
  }
  
  .video-player {
    width: 100%;
    max-width: 1366px;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: var(--border-radius-md);
    background: #000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .video-info {
    display: flex;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    background: var(--color-white);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border-lighter);
  }
  
  .info-item {
    display: flex;
    gap: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
  
  .info-label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
  }
  
  .info-value {
    color: var(--color-text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  }
  
  .placeholder {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
    text-align: center;
    color: var(--color-text-secondary);
  }
  
  @media (max-width: 768px) {
    .video-container {
      padding: var(--spacing-md);
    }
    
    .video-info {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
</style>

