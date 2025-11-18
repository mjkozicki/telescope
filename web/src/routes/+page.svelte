<script lang="ts">
  import { goto } from '$app/navigation';
  
  let url = '';
  let browser = 'chrome';
  let submitting = false;
  let error = '';

  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!url) {
      error = 'Please enter a URL';
      return;
    }
    
    submitting = true;
    error = '';
    
    try {
      const response = await fetch('/api/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          browser
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Redirect to running page or results
        if (data.redirectUrl) {
          goto(data.redirectUrl);
        } else if (data.testId) {
          goto(`/results/${data.testId}/overview`);
        }
      } else {
        error = data.error || 'Failed to submit test';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Test submission error:', err);
    } finally {
      submitting = false;
    }
  }
</script>

<div class="section-content">
  <h2>Simple</h2>
  <p>Simple is a simple way to test your website.</p>
  
  <form on:submit={handleSubmit}>
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <div class="form-group">
      <label for="url">URL:</label>
      <input 
        type="text" 
        id="url" 
        name="url" 
        bind:value={url}
        placeholder="https://example.com"
        disabled={submitting}
      />
    </div>
    
    <div class="form-group">
      <label for="browser">Browser:</label>
      <select id="browser" name="browser" bind:value={browser} disabled={submitting}>
        <option value="chrome">Chrome</option>
        <option value="firefox">Firefox</option>
        <option value="edge">Edge</option>
        <option value="safari">Safari</option>
      </select>
    </div>
    
    <button type="submit" disabled={submitting}>
      {submitting ? 'Submitting...' : 'Run Test'}
    </button>
  </form>
</div>

<style>
  .error-message {
    padding: var(--spacing-md);
    background: #fee;
    border: 1px solid #fcc;
    border-radius: var(--border-radius-md);
    color: #c33;
    margin-bottom: var(--spacing-lg);
  }

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

  input[type="text"]:disabled,
  select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  button[type="submit"]:hover:not(:disabled) {
    background: var(--color-accent-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px #ff6b354d;
  }

  button[type="submit"]:active:not(:disabled) {
    transform: translateY(0);
  }

  button[type="submit"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

