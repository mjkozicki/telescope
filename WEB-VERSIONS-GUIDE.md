# Telescope Web Versions Comparison Guide

This repository contains **four complete implementations** of the Telescope performance testing tool, each using a different frontend approach while sharing the same visual design and API.

## 🎯 Overview

| Version | Framework | Bundle Size | Learning Curve | Best For |
|---------|-----------|-------------|----------------|----------|
| **web-svelte** | SvelteKit | Small (~50KB) | Medium | Full-featured SPAs, SSR needed |
| **web-react** | React + React Router | Medium (~150KB) | Low-Medium | React ecosystem, large teams |
| **web-web-components** | Vanilla JS + Web Components | Tiny (~20KB) | Medium-High | Standards-based, no framework lock-in |
| **web-html** | Pure HTML/CSS/JS | Minimal (~5KB) | Low | Simple sites, no build step |

## 📂 Structure

```
svelte-telescope/
├── web-svelte/          # SvelteKit (SSR capable)
├── web-react/           # React with Vite
├── web-web-components/  # Native Web Components
├── web-html/            # Vanilla HTML/CSS/JS
└── shared-server.js     # Shared Express API server
```

## 🚀 Quick Start

### SvelteKit Version

```bash
cd web-svelte
npm install
npm run dev      # Dev server on http://localhost:5173
npm run build    # Build for production
```

**Pros:**
- Smallest bundle size
- Built-in SSR and routing
- Reactive by default
- Great developer experience

**Cons:**
- Newer framework (smaller ecosystem)
- Less familiar to most developers

---

### React Version

```bash
cd web-react
npm install
npm run dev      # Dev server on http://localhost:5173

# In another terminal, start the API server:
npm run server   # API server on http://localhost:3001
```

**Pros:**
- Most popular framework
- Huge ecosystem
- Easy to hire developers
- Familiar to most teams

**Cons:**
- Larger bundle size
- More boilerplate

---

### Web Components Version

```bash
cd web-web-components
npm install
npm run dev      # Dev server on http://localhost:5173

# API server runs separately (same as React)
```

**Pros:**
- Web standards (future-proof)
- No framework lock-in
- Small bundle size
- Can be used with any framework

**Cons:**
- More manual DOM manipulation
- Less tooling/ecosystem
- Steeper learning curve for custom elements

---

### Vanilla HTML Version

```bash
cd web-html
# No installation needed!

# Option 1: Open index.html directly in browser
open index.html

# Option 2: Use any static server
npx serve .
# or
python3 -m http.server 8000

# API server runs separately (same as above)
```

**Pros:**
- No build step or dependencies
- Simplest possible approach
- Works everywhere
- Easy to understand

**Cons:**
- Manual DOM manipulation
- No components or reactivity
- Can get verbose for complex UIs

---

## 🔧 API Server

All versions share the same Express API server:

```bash
# From the root directory
node shared-server.js
```

**API Endpoints:**
- `POST /api/submit-test` - Submit a new test
- `GET /api/results` - List all test results
- `GET /api/results/:testId` - Get specific test details
- `POST /api/upload` - Upload test result archives

---

## 🎨 Features Comparison

| Feature | Svelte | React | Web Components | HTML |
|---------|---------|--------|----------------|------|
| Routing | ✅ Built-in | ✅ React Router | ✅ Custom | ✅ Multi-page |
| State Management | ✅ Stores | ✅ Context/Hooks | ✅ Custom | ✅ Variables |
| Component Model | ✅ `.svelte` files | ✅ JSX Components | ✅ Custom Elements | ❌ N/A |
| Reactivity | ✅ Built-in | ✅ Hooks | ⚠️ Manual | ❌ Manual |
| TypeScript | ✅ Full support | ✅ Full support | ✅ Possible | ⚠️ Optional |
| SSR | ✅ Yes | ⚠️ Requires setup | ❌ No | ❌ No |
| Build Required | ✅ Yes | ✅ Yes | ⚠️ Optional | ❌ No |

---

## 🎓 When to Use Each

### Choose SvelteKit if:
- You want the best performance and smallest bundle
- SSR/SSG is important
- You're starting a new project
- Developer experience is a priority

### Choose React if:
- Your team already knows React
- You need access to the React ecosystem
- You're integrating with existing React apps
- You need mature tooling and libraries

### Choose Web Components if:
- You want framework-independent components
- You're building a design system
- You need components that work in any framework
- Long-term maintainability is crucial

### Choose Vanilla HTML if:
- You want the simplest possible solution
- No build step is required
- The app is relatively simple
- You're learning web fundamentals

---

## 📊 Performance Metrics

**Initial Load (gzipped):**
- Vanilla HTML: ~5 KB
- Web Components: ~20 KB
- SvelteKit: ~50 KB
- React: ~150 KB

**Runtime Performance:**
All versions perform well. Svelte and Web Components have a slight edge due to less runtime overhead.

---

## 🔄 Shared Design

All versions share the **exact same visual design** with:
- Identical CSS variables and styling
- Same layout (150px sidebar, fixed header)
- Same color scheme and branding
- Responsive design for mobile

The CSS is centralized in `/web-react/src/styles/main.css` and imported by other versions.

---

## 🛠️ Development Workflow

1. **Start the API server** (required for all versions):
   ```bash
   node shared-server.js
   ```

2. **Start your chosen frontend**:
   - SvelteKit: `cd web-svelte && npm run dev`
   - React: `cd web-react && npm run dev`
   - Web Components: `cd web-web-components && npm run dev`
   - HTML: Open `web-html/index.html` or serve with any static server

3. **Access the app**:
   - Frontend: `http://localhost:5173` (or the port shown)
   - API: `http://localhost:3001`

---

## 📝 Notes

- All versions implement the **same feature set**
- The **shared-server.js** provides API endpoints for all versions
- Test results are stored in the same location
- You can switch between versions without data loss

---

## 🤝 Contributing

Each version is fully functional and can be extended independently. The modular structure makes it easy to:
- Add new features to one version
- Port features between versions
- Compare implementation approaches
- Learn different frameworks

---

## 📚 Learning Resources

- **SvelteKit**: https://kit.svelte.dev/
- **React**: https://react.dev/
- **Web Components**: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- **Vanilla JS**: https://javascript.info/

---

## 🎯 Conclusion

This multi-version approach demonstrates:
1. **Framework agnostic design** - Same UI, different implementations
2. **Shared backend** - One API serves all frontends
3. **Real-world comparison** - See trade-offs in action
4. **Educational value** - Learn by comparing approaches

Choose the version that best fits your project's needs, team skills, and requirements!

