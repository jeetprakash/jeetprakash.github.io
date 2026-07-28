---
title: "Flat UI & Static Blog Generator"
slug: "flat-ui-blog-generator"
shortDescription: "Zero-build static dev blog generator built for GitHub Pages, featuring pre-rendered HTML, Markdown parsing, and clean URLs."
tech:
  - JavaScript
  - Node.js
  - HTML5
  - CSS3
  - Markdown
  - SSG
github: "https://github.com/jeetprakash/jeetprakash.github.io"
demo: "https://jeetprakash.github.io"
date: "2026-07-25"
---

# Flat UI & Static Blog Generator

A pre-rendered, lightweight static site generator specifically tailored for hosting blogs, project showcases, and developer portfolios on **GitHub Pages**.

---

## 🌟 Key Architectural Highlights

- **Date-Nested Clean URLs**: Clean, bookmarkable URL paths (`/posts/<YYYY>/<MM>/<slug>/`).
- **Colocated Markdown Files**: Markdown source files (`.md`) sit directly beside compiled static HTML (`index.html`) in post and project folders.
- **100% "View Page Source" Ready**: Pre-renders complete static HTML for every article and project, ensuring instant SEO indexing and viewability in Chrome's View Page Source (Ctrl+U).
- **Special Tag Filtering**: Native support for special tags `#devMusings` and `#devRants` alongside custom tag cloud summary pages (`/tags/`).
- **Flat Light Design System**: Crisp off-white backgrounds, Inter & Fira Code typography, flat badge components, and 50-word home summaries.

---

## ⚡ Static Generator Pipeline (`build.js`)

```javascript
// Build Pipeline Workflow
const { marked } = require('marked');
const yaml = require('js-yaml');

function compileMarkdownPage(filePath) {
  const rawText = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(rawText);
  
  const htmlContent = marked.parse(body);
  return generateStaticHtmlPage(frontmatter.title, htmlContent);
}
```

---

## 🚀 Creating New Posts & Projects

Simply create a sub-directory in `posts/<YYYY>/<MM>/<slug>/` or `projects/<slug>/`, place your `.md` content file inside it, and run:

```bash
npm run build
```
