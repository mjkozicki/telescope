<script lang="ts">
  import { goto } from '$app/navigation';
  
  // Basic options
  let url = '';
  let browser = 'chrome';
  
  // Network & Performance
  let connectionType = '';
  let cpuThrottle: number | null = null;
  let width = 1366;
  let height = 768;
  
  // Content Control
  let blockDomains = '';
  let blockUrls = '';
  let disableJS = false;
  
  // Advanced Settings
  let headers = '';
  let cookies = '';
  let flags = '';
  let firefoxPrefs = '';
  let auth = { username: '', password: '' };
  
  // Recording Options
  let frameRate = 1;
  let timeout = 30000;
  let generateHtml = false;
  let debug = false;
  
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
      // Build configuration object
      const config = {
        url,
        browser,
        ...(connectionType && { connectionType }),
        ...(cpuThrottle && { cpuThrottle }),
        width,
        height,
        ...(blockDomains && { blockDomains: blockDomains.split(',').map(d => d.trim()) }),
        ...(blockUrls && { block: blockUrls.split(',').map(u => u.trim()) }),
        disableJS,
        ...(headers && { headers: JSON.parse(headers) }),
        ...(cookies && { cookies: JSON.parse(cookies) }),
        ...(flags && { flags }),
        ...(firefoxPrefs && { firefoxPrefs: JSON.parse(firefoxPrefs) }),
        ...(auth.username && auth.password && { auth }),
        frameRate,
        timeout,
        html: generateHtml,
        debug
      };
      
      const response = await fetch('/api/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.redirectUrl) {
          goto(data.redirectUrl);
        } else if (data.testId) {
          goto(`/results/${data.testId}/overview`);
        }
      } else {
        error = data.error || 'Failed to submit test';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Network error. Please try again.';
      console.error('Test submission error:', err);
    } finally {
      submitting = false;
    }
  }
</script>

<div class="section-content">
  <h2>Advanced</h2>
  <p>Configure advanced testing options with full control over browser behavior, network conditions, and more.</p>
  
  <form on:submit={handleSubmit}>
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <!-- Basic Configuration -->
    <section class="form-section">
      <h3>Basic Configuration</h3>
      
      <div class="form-row">
        <div class="form-group">
          <label for="url">URL <span class="required">*</span></label>
          <input 
            type="url" 
            id="url" 
            bind:value={url}
            placeholder="https://example.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="browser">Browser</label>
          <select id="browser" bind:value={browser}>
            <option value="chrome">Chrome</option>
            <option value="chrome-beta">Chrome Beta</option>
            <option value="canary">Chrome Canary</option>
            <option value="edge">Edge</option>
            <option value="safari">Safari</option>
            <option value="firefox">Firefox</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Network & Performance -->
    <section class="form-section">
      <h3>Network & Performance</h3>
      
      <div class="form-row">
        <div class="form-group">
          <label for="connectionType">Connection Type</label>
          <select id="connectionType" bind:value={connectionType}>
            <option value="">No throttling</option>
            <option value="fios">FiOS</option>
            <option value="cable">Cable</option>
            <option value="dsl">DSL</option>
            <option value="4g">4G</option>
            <option value="3g">3G</option>
            <option value="3gfast">3G Fast</option>
            <option value="3gslow">3G Slow</option>
            <option value="2g">2G</option>
          </select>
          <span class="help-text">Network throttling simulation</span>
        </div>
        
        <div class="form-group">
          <label for="cpuThrottle">CPU Throttle</label>
          <input 
            type="number" 
            id="cpuThrottle" 
            bind:value={cpuThrottle}
            min="1"
            placeholder="e.g. 4"
          />
          <span class="help-text">CPU throttling factor (higher = slower)</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="width">Viewport Width</label>
          <input 
            type="number" 
            id="width" 
            bind:value={width}
            min="320"
            max="3840"
          />
          <span class="help-text">pixels</span>
        </div>
        
        <div class="form-group">
          <label for="height">Viewport Height</label>
          <input 
            type="number" 
            id="height" 
            bind:value={height}
            min="240"
            max="2160"
          />
          <span class="help-text">pixels</span>
        </div>
      </div>
    </section>

    <!-- Content Control -->
    <section class="form-section">
      <h3>Content Control</h3>
      
      <div class="form-group">
        <label for="blockDomains">Block Domains</label>
        <input 
          type="text" 
          id="blockDomains" 
          bind:value={blockDomains}
          placeholder="ads.example.com, tracker.com"
        />
        <span class="help-text">Comma-separated list of domains to block</span>
      </div>
      
      <div class="form-group">
        <label for="blockUrls">Block URLs</label>
        <input 
          type="text" 
          id="blockUrls" 
          bind:value={blockUrls}
          placeholder="/ads/, /analytics/"
        />
        <span class="help-text">Comma-separated list of URL substrings to block</span>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input 
            type="checkbox" 
            bind:checked={disableJS}
          />
          Disable JavaScript
        </label>
      </div>
    </section>

    <!-- Advanced Settings -->
    <section class="form-section">
      <h3>Advanced Settings</h3>
      
      <div class="form-group">
        <label for="headers">Custom Headers (JSON)</label>
        <textarea 
          id="headers" 
          bind:value={headers}
          rows="3"
          placeholder={'{"User-Agent": "CustomBot/1.0", "X-Custom": "value"}'}
        ></textarea>
        <span class="help-text">JSON object of HTTP headers</span>
      </div>
      
      <div class="form-group">
        <label for="cookies">Custom Cookies (JSON)</label>
        <textarea 
          id="cookies" 
          bind:value={cookies}
          rows="3"
          placeholder={'{"session": "abc123", "preference": "dark"}'}
        ></textarea>
        <span class="help-text">JSON object of cookies</span>
      </div>

      <div class="form-group">
        <label for="flags">Chrome Flags</label>
        <input 
          type="text" 
          id="flags" 
          bind:value={flags}
          placeholder="--disable-gpu,--no-sandbox"
        />
        <span class="help-text">Comma-separated Chromium flags</span>
      </div>

      <div class="form-group">
        <label for="firefoxPrefs">Firefox Preferences (JSON)</label>
        <textarea 
          id="firefoxPrefs" 
          bind:value={firefoxPrefs}
          rows="3"
          placeholder={'{"network.trr.mode": 2}'}
        ></textarea>
        <span class="help-text">Firefox user preferences (Firefox only)</span>
      </div>

      <div class="auth-group">
        <p class="auth-label">HTTP Basic Authentication</p>
        <div class="form-row">
          <div class="form-group">
            <input 
              type="text" 
              bind:value={auth.username}
              placeholder="Username"
            />
          </div>
          <div class="form-group">
            <input 
              type="password" 
              bind:value={auth.password}
              placeholder="Password"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Recording Options -->
    <section class="form-section">
      <h3>Recording Options</h3>
      
      <div class="form-row">
        <div class="form-group">
          <label for="frameRate">Filmstrip Frame Rate</label>
          <input 
            type="number" 
            id="frameRate" 
            bind:value={frameRate}
            min="1"
            max="60"
          />
          <span class="help-text">frames per second</span>
        </div>
        
        <div class="form-group">
          <label for="timeout">Test Timeout</label>
          <input 
            type="number" 
            id="timeout" 
            bind:value={timeout}
            min="5000"
            step="1000"
          />
          <span class="help-text">milliseconds</span>
        </div>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input 
            type="checkbox" 
            bind:checked={generateHtml}
          />
          Generate HTML Report
        </label>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input 
            type="checkbox" 
            bind:checked={debug}
          />
          Enable Debug Output
        </label>
      </div>
    </section>
    
    <button type="submit" class="submit-button" disabled={submitting}>
      {submitting ? 'Submitting...' : 'Run Advanced Test'}
    </button>
  </form>
</div>

<style>
  .section-content {
    max-width: 900px;
  }

  form {
    margin-top: var(--spacing-xl);
  }

  .error-message {
    padding: var(--spacing-md);
    background: #fee;
    border: 1px solid #fcc;
    border-radius: var(--border-radius-md);
    color: #c33;
    margin-bottom: var(--spacing-lg);
  }

  .form-section {
    margin-bottom: var(--spacing-xxl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border-lighter);
  }

  .form-section:last-of-type {
    border-bottom: none;
  }

  .form-section h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--color-primary);
    margin-bottom: var(--spacing-lg);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
  }

  .required {
    color: var(--color-accent);
  }

  input[type="text"],
  input[type="url"],
  input[type="number"],
  input[type="password"],
  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: var(--border-width) solid var(--color-border-lighter);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: var(--transition-fast);
    background: var(--color-white);
    font-family: inherit;
  }

  textarea {
    resize: vertical;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }

  input[type="text"]:focus,
  input[type="url"]:focus,
  input[type="number"]:focus,
  input[type="password"]:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px #ff6b3519;
  }

  .help-text {
    display: block;
    margin-top: var(--spacing-xs);
    font-size: 0.8rem;
    color: var(--color-text-light);
    font-style: italic;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: var(--font-weight-normal);
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: auto;
    margin-right: var(--spacing-sm);
    cursor: pointer;
  }

  .auth-group {
    margin-bottom: var(--spacing-lg);
  }

  .auth-label {
    display: block;
    margin-bottom: var(--spacing-md);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
  }

  .submit-button {
    padding: var(--spacing-md) var(--spacing-xxl);
    background: var(--color-accent);
    color: var(--color-white);
    border: none;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: var(--transition-fast);
    margin-top: var(--spacing-xl);
  }

  .submit-button:hover:not(:disabled) {
    background: var(--color-accent-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px #ff6b354d;
  }

  .submit-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>

