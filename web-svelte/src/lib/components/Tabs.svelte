<script lang="ts">
  import { page } from '$app/stores';
  
  $: currentPath = $page.url.pathname;
</script>

<header>
  <nav class="tabs">
    <a href="/" class="tab" class:active={currentPath === '/'}>Simple</a>
    <a href="/advanced" class="tab" class:active={currentPath === '/advanced'}>Advanced</a>
    <a href="/results" class="tab" class:active={currentPath === '/results'}>Results</a>
    <a href="/upload" class="tab" class:active={currentPath === '/upload'}>Upload</a>
  </nav>
</header>

<style>
  .tab.active {
    background: var(--color-background-lighter);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>

