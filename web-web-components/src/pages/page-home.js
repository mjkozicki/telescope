class PageHome extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="section-content">
        <h2>Simple Test</h2>
        <p>Enter a URL to test:</p>
        
        <form id="test-form" style="margin-top: 2rem; max-width: 600px;">
          <div style="margin-bottom: 1rem;">
            <label for="url" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">URL</label>
            <input 
              type="url" 
              id="url" 
              required 
              placeholder="https://example.com"
              value="https://example.com"
              style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 2px solid var(--color-border-lighter); border-radius: var(--border-radius-sm);"
            />
          </div>
          
          <div id="error-message" style="display: none; padding: 1rem; margin-bottom: 1rem; background: #fee2e2; border: 1px solid #fecaca; border-radius: var(--border-radius-sm); color: #dc2626;"></div>
          
          <button 
            type="submit" 
            style="padding: 0.75rem 2rem; font-size: 1rem; font-weight: 600; color: white; background: var(--color-accent); border: none; border-radius: var(--border-radius-sm); cursor: pointer;"
          >
            Run Test
          </button>
        </form>
      </div>
    `;

    const form = this.querySelector('#test-form');
    const errorDiv = this.querySelector('#error-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const url = form.querySelector('#url').value;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      errorDiv.style.display = 'none';

      try {
        const response = await fetch('/api/submit-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.success && data.testId) {
          window.location.hash = `/results/${data.testId}/overview`;
        } else {
          errorDiv.textContent = 'Failed to submit test';
          errorDiv.style.display = 'block';
        }
      } catch (err) {
        errorDiv.textContent = 'Network error occurred';
        errorDiv.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Run Test';
      }
    });
  }
}

customElements.define('page-home', PageHome);

