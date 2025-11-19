<script lang="ts">
  import { page } from '$app/stores';
  
  // Extract testId from URL params
  $: testId = $page.params.testId;
  $: isResultPage = $page.url.pathname.startsWith('/results/') && testId;
  $: currentPath = $page.url.pathname;
  
  function preventClick(event: Event) {
    event.preventDefault();
  }
</script>

<nav class="common-nav">
  {#if isResultPage}
    <a 
      href="/results/{testId}/overview" 
      class="nav-link"
      class:active={currentPath.endsWith('/overview')}
    >
      Overview
    </a>
    <a 
      href="/results/{testId}/metrics" 
      class="nav-link"
      class:active={currentPath.endsWith('/metrics')}
    >
      Metrics
    </a>
    <a 
      href="/results/{testId}/filmstrip" 
      class="nav-link"
      class:active={currentPath.endsWith('/filmstrip')}
    >
      Filmstrip
    </a>
    <a 
      href="/results/{testId}/video" 
      class="nav-link"
      class:active={currentPath.endsWith('/video')}
    >
      Video
    </a>
    <a 
      href="/results/{testId}/waterfall" 
      class="nav-link"
      class:active={currentPath.endsWith('/waterfall')}
    >
      Waterfall
    </a>
    <a 
      href="/results/{testId}/resources" 
      class="nav-link"
      class:active={currentPath.endsWith('/resources')}
    >
      Resources
    </a>
    <a 
      href="/results/{testId}/console" 
      class="nav-link"
      class:active={currentPath.endsWith('/console')}
    >
      Console
    </a>
    <a 
      href="/results/{testId}/bottlenecks" 
      class="nav-link"
      class:active={currentPath.endsWith('/bottlenecks')}
    >
      Bottlenecks
    </a>
    <a 
      href="/results/{testId}/config" 
      class="nav-link"
      class:active={currentPath.endsWith('/config')}
    >
      Config
    </a>
  {:else}
    <span class="nav-link disabled">Overview</span>
    <span class="nav-link disabled">Metrics</span>
    <span class="nav-link disabled">Filmstrip</span>
    <span class="nav-link disabled">Video</span>
    <span class="nav-link disabled">Waterfall</span>
    <span class="nav-link disabled">Resources</span>
    <span class="nav-link disabled">Console</span>
    <span class="nav-link disabled">Bottlenecks</span>
    <span class="nav-link disabled">Config</span>
  {/if}
</nav>

<style>
  .nav-link.active {
    background: var(--color-background-lighter);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>

