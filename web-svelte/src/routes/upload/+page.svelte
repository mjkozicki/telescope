<script lang="ts">
  import { goto } from '$app/navigation';
  
  let files: FileList | null = null;
  let uploading = false;
  let error = '';
  let successMessage = '';
  
  async function handleUpload(event: Event) {
    event.preventDefault();
    
    if (!files || files.length === 0) {
      error = 'Please select a file to upload';
      return;
    }
    
    uploading = true;
    error = '';
    successMessage = '';
    
    try {
      const file = files[0]; // Upload only the first file for now
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        successMessage = `Upload successful! Redirecting to results...`;
        setTimeout(() => {
          if (data.url) {
            goto(data.url);
          } else if (data.testId) {
            goto(`/results/${data.testId}/overview`);
          }
        }, 1500);
      } else {
        error = data.error || 'Failed to upload file';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Upload error:', err);
    } finally {
      uploading = false;
    }
  }
</script>

<div class="section-content">
  <h2>Upload Results</h2>
  <p>Upload existing test results for analysis.</p>
  
  <form on:submit={handleUpload}>
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    {#if successMessage}
      <div class="success-message">{successMessage}</div>
    {/if}
    
    <div class="form-group">
      <label for="files">Select result archive (.zip):</label>
      <input 
        type="file" 
        id="files" 
        name="files" 
        bind:files
        accept=".zip"
        disabled={uploading}
      />
    </div>
    
    <button type="submit" disabled={!files || files.length === 0 || uploading}>
      {uploading ? 'Uploading...' : 'Upload'}
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

  .success-message {
    padding: var(--spacing-md);
    background: #efe;
    border: 1px solid #cfc;
    border-radius: var(--border-radius-md);
    color: #3c3;
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

  input[type="file"] {
    width: 100%;
    padding: var(--spacing-md);
    border: var(--border-width) dashed var(--color-border-light);
    border-radius: var(--border-radius-md);
    background: var(--color-background-lighter);
  }

  input[type="file"]:disabled {
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

  button[type="submit"]:disabled {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
  }
</style>

