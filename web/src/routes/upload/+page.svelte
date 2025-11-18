<script lang="ts">
  // TODO: Implement file upload
  let files: FileList | null = null;
  
  function handleUpload(event: Event) {
    event.preventDefault();
    console.log('Uploading files:', files);
    // TODO: Implement upload logic
  }
</script>

<div class="section-content">
  <h2>Upload Results</h2>
  <p>Upload existing test results for analysis.</p>
  
  <form on:submit={handleUpload}>
    <div class="form-group">
      <label for="files">Select HAR files or result archives:</label>
      <input 
        type="file" 
        id="files" 
        name="files" 
        bind:files
        accept=".har,.zip,.json"
        multiple
      />
    </div>
    
    <button type="submit" disabled={!files || files.length === 0}>
      Upload
    </button>
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

  input[type="file"] {
    width: 100%;
    padding: var(--spacing-md);
    border: var(--border-width) dashed var(--color-border-light);
    border-radius: var(--border-radius-md);
    background: var(--color-background-lighter);
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

  button[type="submit"]:disabled {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
  }
</style>

