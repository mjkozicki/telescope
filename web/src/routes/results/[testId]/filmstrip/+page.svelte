<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  interface LayoutShift {
    value: number;
    startTime: number;
    sources: Array<{
      previousRect: Rect;
      currentRect: Rect;
    }>;
  }
  
  interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
  
  $: filmstripPaths = data.manifest?.filmstrip || [];
  $: layoutShifts = data.metrics?.layoutShifts || [];
  $: totalLoadTime = data.metrics?.navigationTiming?.loadEventEnd || 0;
  $: testId = data.testId;
  
  // Calculate CLS total
  $: clsTotal = layoutShifts.reduce((sum: number, shift: LayoutShift) => sum + shift.value, 0);
  
  // Process layout shifts for visualization
  $: processedShifts = layoutShifts.map((shift: LayoutShift) => {
    const sources = shift.sources || [];
    let viewportWidth = 1920;
    let viewportHeight = 1536;
    
    // Determine viewport from rect data
    for (const source of sources) {
      const prevRect = source.previousRect || {} as Rect;
      const currRect = source.currentRect || {} as Rect;
      viewportWidth = Math.max(viewportWidth, prevRect.right || 0, currRect.right || 0);
      viewportHeight = Math.max(viewportHeight, prevRect.bottom || 0, currRect.bottom || 0);
    }
    
    const sourceVisuals = sources
      .filter(source => {
        const currRect = source.currentRect || {} as Rect;
        return (currRect.width || 0) > 0 && (currRect.height || 0) > 0;
      })
      .map(source => {
        const prevRect = source.previousRect || {} as Rect;
        const currRect = source.currentRect || {} as Rect;
        
        return {
          prevLeft: ((prevRect.left || 0) / viewportWidth) * 100,
          prevTop: ((prevRect.top || 0) / viewportHeight) * 100,
          prevWidth: ((prevRect.width || 0) / viewportWidth) * 100,
          prevHeight: ((prevRect.height || 0) / viewportHeight) * 100,
          currLeft: ((currRect.left || 0) / viewportWidth) * 100,
          currTop: ((currRect.top || 0) / viewportHeight) * 100,
          currWidth: ((currRect.width || 0) / viewportWidth) * 100,
          currHeight: ((currRect.height || 0) / viewportHeight) * 100,
        };
      });
    
    return {
      time: shift.startTime,
      value: shift.value,
      sourcesCount: sourceVisuals.length,
      viewportWidth,
      viewportHeight,
      aspectRatio: viewportHeight / viewportWidth,
      sourceVisuals
    };
  }).filter((shift: any) => shift.sourceVisuals.length > 0);
  
  function getClsClass(cls: number): string {
    if (cls <= 0.1) return 'good';
    if (cls <= 0.25) return 'needs-improvement';
    return 'poor';
  }
  
  function extractFrameTime(filename: string): number {
    const match = filename.match(/_(\d+)_/);
    return match ? parseInt(match[1], 10) : 0;
  }
</script>

<div class="section-content">
  {#if filmstripPaths.length === 0}
    <p class="placeholder">No filmstrip frames available.</p>
  {:else}
    <!-- Filmstrip Horizontal Scroller -->
    <div class="filmstrip-scroll">
      <div class="filmstrip-frames">
        {#each filmstripPaths as framePath}
          {@const frameTime = extractFrameTime(framePath)}
          <div class="filmstrip-frame">
            <div class="frame-image-wrapper">
              <img 
                src="/test-results/{testId}/{framePath}" 
                alt="Frame at {frameTime}ms"
                class="frame-image"
                loading="lazy"
              />
            </div>
            <div class="frame-time">{frameTime} ms</div>
          </div>
        {/each}
        
        <!-- Final frame (screenshot) -->
        <div class="filmstrip-frame final-frame">
          <div class="frame-image-wrapper">
            <img 
              src="/test-results/{testId}/screenshot.png" 
              alt="Final screenshot at {totalLoadTime}ms"
              class="frame-image"
              loading="lazy"
            />
          </div>
          <div class="frame-time final-time">{totalLoadTime.toFixed(0)} ms</div>
        </div>
      </div>
    </div>
    
    <!-- CLS Section -->
    {#if processedShifts.length > 0}
      <div class="layout-shifts-section">
        <div class="layout-shifts-header">
          <h3>Layout Shifts</h3>
          <div class="cls-badge {getClsClass(clsTotal)}">
            <span class="cls-label">CLS</span>
            <span class="cls-value">{clsTotal.toFixed(3)}</span>
          </div>
        </div>
        <p class="layout-shifts-description">
          Visual representation of Cumulative Layout Shift (CLS). 
          <span class="legend-prev">Blue</span> shows previous position, 
          <span class="legend-curr">green</span> shows current position.
        </p>
        <div class="layout-shifts-timeline">
          {#each processedShifts as shift}
            <div class="layout-shift-item">
              <div class="shift-header">
                <div class="shift-time">{shift.time.toFixed(1)} ms</div>
                <div class="shift-value">
                  Score: <span class="value-number">{shift.value.toFixed(6)}</span>
                </div>
                <div class="shift-sources">
                  {shift.sourcesCount} element{shift.sourcesCount !== 1 ? 's' : ''}
                </div>
              </div>
              <div class="shift-viewport" style="padding-bottom: {(shift.aspectRatio * 100).toFixed(2)}%;">
                {#each shift.sourceVisuals as source}
                  <div 
                    class="shift-rect prev-rect" 
                    style="left: {source.prevLeft}%; top: {source.prevTop}%; width: {source.prevWidth}%; height: {source.prevHeight}%;"
                  ></div>
                  <div 
                    class="shift-rect curr-rect" 
                    style="left: {source.currLeft}%; top: {source.currTop}%; width: {source.currWidth}%; height: {source.currHeight}%;"
                  ></div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .filmstrip-scroll {
    margin-top: var(--spacing-xl);
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    background: var(--color-background-lighter);
    height: 200px;
    padding: var(--spacing-md);
  }
  
  .filmstrip-frames {
    display: flex;
    gap: var(--spacing-md);
    height: 100%;
    align-items: flex-start;
  }
  
  .filmstrip-frame {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .frame-image-wrapper {
    height: 140px;
    border: 2px solid var(--color-border-light);
    border-radius: var(--border-radius-sm);
    overflow: hidden;
    background: var(--color-white);
  }
  
  .frame-image {
    width: auto;
    height: 100%;
    display: block;
  }
  
  .frame-time {
    text-align: center;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
  }
  
  .final-frame .frame-image-wrapper {
    border-color: var(--color-accent);
    border-width: 3px;
  }
  
  .final-time {
    color: var(--color-accent);
  }
  
  /* Layout Shifts Section */
  .layout-shifts-section {
    margin-top: var(--spacing-xxl);
    padding: var(--spacing-xl);
    background: var(--color-background-lighter);
    border-radius: var(--border-radius-md);
  }
  
  .layout-shifts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }
  
  .layout-shifts-header h3 {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }
  
  .cls-badge {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-weight: var(--font-weight-semibold);
  }
  
  .cls-badge.good {
    background: #d4edda;
    color: #155724;
    border: 2px solid #28a745;
  }
  
  .cls-badge.needs-improvement {
    background: #fff3cd;
    color: #856404;
    border: 2px solid #ffc107;
  }
  
  .cls-badge.poor {
    background: #f8d7da;
    color: #721c24;
    border: 2px solid #dc3545;
  }
  
  .cls-label {
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .cls-value {
    font-size: var(--font-size-lg);
  }
  
  .layout-shifts-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }
  
  .legend-prev {
    color: #2196f3;
    font-weight: var(--font-weight-semibold);
  }
  
  .legend-curr {
    color: #4caf50;
    font-weight: var(--font-weight-semibold);
  }
  
  .layout-shifts-timeline {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .layout-shift-item {
    background: var(--color-white);
    border: 1px solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
  }
  
  .shift-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
  
  .shift-time {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }
  
  .shift-value {
    color: var(--color-text-secondary);
  }
  
  .value-number {
    font-weight: var(--font-weight-semibold);
    color: var(--color-accent);
  }
  
  .shift-sources {
    color: var(--color-text-light);
    font-size: var(--font-size-xs);
  }
  
  .shift-viewport {
    position: relative;
    width: 100%;
    background: #fafafa;
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-sm);
    overflow: hidden;
  }
  
  .shift-rect {
    position: absolute;
    border: 2px solid;
    border-radius: 2px;
    opacity: 0.4;
  }
  
  .prev-rect {
    border-color: #2196f3;
    background: rgba(33, 150, 243, 0.2);
  }
  
  .curr-rect {
    border-color: #4caf50;
    background: rgba(76, 175, 80, 0.2);
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
    .filmstrip-scroll {
      height: 160px;
      padding: var(--spacing-sm);
    }
    
    .frame-image-wrapper {
      height: 100px;
    }
    
    .layout-shifts-timeline {
      grid-template-columns: 1fr;
    }
    
    .shift-header {
      font-size: 12px;
    }
  }
</style>

