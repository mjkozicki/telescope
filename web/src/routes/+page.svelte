<script lang="ts">
  let url = '';
  let browser = 'chrome';

  function handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Running test for:', url, 'on', browser);
    // TODO: Implement test runner
  }
</script>

<div class="section-content">
  <h2>Simple</h2>
  <p>Simple is a simple way to test your website.</p>
  
  <form on:submit={handleSubmit}>
    <div class="form-group">
      <label for="url">URL:</label>
      <input 
        type="text" 
        id="url" 
        name="url" 
        bind:value={url}
        placeholder="https://example.com"
      />
    </div>
    
    <div class="form-group">
      <label for="browser">Browser:</label>
      <select id="browser" name="browser" bind:value={browser}>
        <option value="chrome">Chrome</option>
        <option value="firefox">Firefox</option>
        <option value="edge">Edge</option>
        <option value="safari">Safari</option>
      </select>
    </div>
    
    <button type="submit">Run Test</button>
  </form>
</div>

<style>
  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  input[type="text"],
  select {
    width: 100%;
    padding: 0.75rem;
    border: var(--border-width) solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: var(--transition-fast);
    background: var(--color-white);
  }

  input[type="text"]:focus,
  select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px #ff6b3519;
  }

  button[type="submit"] {
    padding: 0.75rem var(--spacing-xl);
    background: var(--color-accent);
    color: var(--color-white);
    border: none;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: var(--transition-fast);
    margin-top: var(--spacing-md);
  }

  button[type="submit"]:hover {
    background: var(--color-accent-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px #ff6b354d;
  }

  button[type="submit"]:active {
    transform: translateY(0);
  }
</style>

