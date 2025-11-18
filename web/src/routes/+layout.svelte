<script lang="ts">
  import Logo from '$lib/components/Logo.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import Tabs from '$lib/components/Tabs.svelte';
  import '$lib/styles/main.css';
</script>

<div class="app">
  <Logo />
  <Navigation />
  <Tabs />
  
  <main>
    <div class="content">
      <slot />
    </div>
  </main>
</div>

