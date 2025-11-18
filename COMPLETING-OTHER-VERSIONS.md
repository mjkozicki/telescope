# Guide: Completing React, Web Components, and Vanilla HTML Versions

## ✅ What's Done

### React Version
- ✅ **Complete Overview page** - Fully implemented with CWV metrics, screenshots, and thresholds
- ✅ Shared utility functions (`utils/format.js`)
- ✅ All scaffolding and routing

### All Versions
- ✅ Project structure
- ✅ Navigation and routing
- ✅ Basic pages (Home, Advanced, Results, Upload)
- ✅ Shared API server
- ✅ Shared CSS styling

## 🎯 What Needs to Be Done

Each of the remaining 8 result pages needs to be fully implemented for:
1. React (`web-react/src/pages/result/`)
2. Web Components (`web-web-components/src/pages/result/`)
3. Vanilla HTML (`web-html/result/`)

---

## 📋 Implementation Checklist

### React Version (`web-react/`)

#### Remaining Pages:
- [ ] **Metrics** - Copy logic from `web-svelte/.../metrics/+page.svelte`
- [ ] **Resources** - Copy logic from `web-svelte/.../resources/+page.svelte`
- [ ] **Waterfall** - Copy logic from `web-svelte/.../waterfall/+page.svelte`
- [ ] **Filmstrip** - Copy logic from `web-svelte/.../filmstrip/+page.svelte`
- [ ] **Video** - Copy logic from `web-svelte/.../video/+page.svelte`
- [ ] **Console** - Copy logic from `web-svelte/.../console/+page.svelte`
- [ ] **Bottlenecks** - Copy logic from `web-svelte/.../bottlenecks/+page.svelte`
- [ ] **Config** - Copy logic from `web-svelte/.../config/+page.svelte`

#### Pattern to Follow:
```jsx
// 1. Import utilities
import { formatBytes, formatMs } from '../../utils/format';

// 2. Fetch data with useEffect
const [data, setData] = useState(null);
useEffect(() => {
  fetch(`/api/results/${testId}`)
    .then(res => res.json())
    .then(setData);
}, [testId]);

// 3. Extract needed data
const { metrics, resources, config } = data || {};

// 4. Render with JSX (convert Svelte template to JSX)
return (
  <div className="section-content">
    {/* Your content here */}
  </div>
);
```

---

### Web Components Version (`web-web-components/`)

#### Remaining Pages:
- [ ] **Metrics** (`page-metrics.js`)
- [ ] **Resources** (`page-resources.js`)
- [ ] **Waterfall** (`page-waterfall.js`)
- [ ] **Filmstrip** (`page-filmstrip.js`)
- [ ] **Video** (`page-video.js`)
- [ ] **Console** (`page-console.js`)
- [ ] **Bottlenecks** (`page-bottlenecks.js`)
- [ ] **Config** (`page-config.js`)

#### Pattern to Follow:
```javascript
class PageOverview extends HTMLElement {
  static get observedAttributes() {
    return ['test-id'];
  }

  async connectedCallback() {
    const testId = this.getAttribute('test-id');
    this.innerHTML = '<div class="section-content"><p>Loading...</p></div>';

    try {
      const response = await fetch(`/api/results/${testId}`);
      const data = await response.json();
      
      this.render(data);
    } catch (err) {
      this.innerHTML = '<div class="section-content"><p>Error loading data</p></div>';
    }
  }

  render(data) {
    const { config, metrics } = data;
    
    this.innerHTML = `
      <div class="section-content">
        <!-- Your HTML here -->
      </div>
    `;
  }
}

customElements.define('page-overview', PageOverview);
```

---

### Vanilla HTML Version (`web-html/`)

#### Remaining Pages:
- [ ] **Metrics** (`result/metrics.html`)
- [ ] **Resources** (`result/resources.html`)
- [ ] **Waterfall** (`result/waterfall.html`)
- [ ] **Filmstrip** (`result/filmstrip.html`)
- [ ] **Video** (`result/video.html`)
- [ ] **Console** (`result/console.html`)
- [ ] **Bottlenecks** (`result/bottlenecks.html`)
- [ ] **Config** (`result/config.html`)

#### Pattern to Follow:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Title - Telescope</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <div id="root">
    <!-- Static layout here -->
    <main>
      <div class="content">
        <div class="section-content">
          <h2>Page Title</h2>
          <div id="content">Loading...</div>
        </div>
      </div>
    </main>
  </div>

  <script type="module">
    const params = new URLSearchParams(window.location.search);
    const testId = params.get('testId');
    const content = document.getElementById('content');

    async function loadData() {
      try {
        const response = await fetch(`/api/results/${testId}`);
        const data = await response.json();
        
        // Render data
        content.innerHTML = `<!-- Your HTML here -->`;
      } catch (err) {
        content.innerHTML = '<p>Failed to load data</p>';
      }
    }

    if (testId) loadData();
  </script>
</body>
</html>
```

---

## 🔧 Conversion Tips

### From Svelte to React:
1. **Reactive statements** (`$:`) → `useMemo` or inline calculations
2. **{#if}** → `{condition && <div>...</div>}`
3. **{#each}** → `.map()`
4. **on:click** → `onClick`
5. **bind:value** → `value={state} onChange={setState}`

### From Svelte to Web Components:
1. **Reactive statements** → Recalculate in `render()` method
2. **Template syntax** → Template literals with `innerHTML`
3. **Event handlers** → `addEventListener` in `connectedCallback`
4. **Data binding** → Manual DOM updates

### From Svelte to Vanilla HTML:
1. **Everything** → Template literals and DOM manipulation
2. **Reactive updates** → Manual updates on data change
3. **Components** → Functions that return HTML strings

---

## 📦 Copy These Helper Functions

Create `utils.js` files in each version with these shared functions:

```javascript
export function formatBytes(bytes) {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatMs(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  return `${ms.toFixed(0)} ms`;
}

export function formatCLS(cls) {
  if (cls === null || cls === undefined) return 'N/A';
  return cls.toFixed(3);
}

export function getFCPClass(value) {
  if (!value) return 'unknown';
  if (value <= 1800) return 'good';
  if (value <= 3000) return 'needs-improvement';
  return 'poor';
}

export function getLCPClass(value) {
  if (!value) return 'unknown';
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
}

export function getCLSClass(value) {
  if (value === null || value === undefined) return 'unknown';
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
}

export function truncateUrl(url, maxLength = 60) {
  if (url.length <= maxLength) return url;
  const start = url.substring(0, maxLength - 15);
  const end = url.substring(url.length - 12);
  return `${start}...${end}`;
}

export function getHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function getPath(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search;
  } catch {
    return url;
  }
}
```

---

## 🚀 Quick Implementation Steps

### For Each Page:

1. **Open the SvelteKit version** (`web-svelte/src/routes/results/[testId]/[page]/+page.svelte`)
2. **Identify the data processing logic** (everything in `<script>`)
3. **Identify the HTML structure** (everything in template)
4. **Identify the styles** (everything in `<style>`)
5. **Port to your target framework** following the patterns above

### Estimated Time Per Page:
- **React**: 30-45 minutes per page
- **Web Components**: 45-60 minutes per page  
- **Vanilla HTML**: 30-45 minutes per page

---

## ✅ Testing Each Page

For each implemented page, verify:
1. ✅ Data loads correctly from API
2. ✅ All sections render
3. ✅ Metrics display with correct formatting
4. ✅ Color coding works (good/needs-improvement/poor)
5. ✅ Empty states handled
6. ✅ Responsive design works
7. ✅ Navigation works

---

## 📚 Example: Complete Overview Page

The **React Overview page** is now fully implemented at:
- `web-react/src/pages/result/Overview.jsx`
- `web-react/src/utils/format.js`

Use this as a reference for implementing the other 8 pages!

---

## 🎯 Priority Order

Implement in this order for maximum value:

1. ✅ **Overview** (DONE for React!)
2. **Metrics** - Most comprehensive view
3. **Resources** - Essential debugging tool
4. **Waterfall** - Visual representation
5. **Console** - Debugging
6. **Video** - Simple player (easiest)
7. **Filmstrip** - Visual progression
8. **Bottlenecks** - Analysis
9. **Config** - Simple JSON display (easiest)

---

## 💡 Pro Tips

1. **Start with the easiest** (Config, Video) to build momentum
2. **Reuse components** - Create shared components for tables, cards, etc.
3. **Test incrementally** - Test each page as you build it
4. **Copy styles** - The Svelte version has all the CSS you need
5. **Use browser DevTools** - Compare with the Svelte version running side-by-side

---

## Need Help?

- Reference the **complete SvelteKit implementation** in `web-svelte/`
- Check the **React Overview page** for a complete example
- Use the **IMPLEMENTATION-STATUS.md** for feature requirements
- The **shared-server.js** provides all API endpoints

Happy coding! 🚀

