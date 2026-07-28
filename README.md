# jeetprakash.github.io

A pre-rendered, flat light-themed developer blog, project showcase, and portfolio built for **GitHub Pages**. Features **date-nested clean URLs**, **Markdown-driven projects**, **colocated Markdown files**, and **100% pre-rendered static HTML** for full visibility in Chrome's **"View Page Source"**.

---

## 🌟 Features

- **Date-Nested Clean Post URLs**: Posts accessible via clean, bookmarkable paths: `/posts/<YYYY>/<MM>/<slug>/` (e.g. `/posts/2026/07/sample-lorem-ipsum-post/`).
- **Markdown-Driven Project Detail Pages**: Clickable project items on `/projects/` lead to dedicated project description pages (`/projects/<project-slug>/`) whose content is sourced directly from colocated Markdown `.md` files.
- **GitHub Links on Project Detail Pages**: External GitHub repository links are displayed cleanly and exclusively on their respective individual project description pages.
- **Colocated Source Files**: Every post and project `.md` file sits directly beside its compiled `index.html` file inside its folder (`posts/<YYYY>/<MM>/<slug>/` and `projects/<slug>/`).
- **100% "View Page Source" Ready**: Pre-rendered static HTML for every article, tag, project, and portfolio page. Right-clicking and selecting **View Page Source** (Ctrl+U) in Chrome reveals complete titles, metadata, prefaces, headings, and code blocks.
- **Latest Posts Feed**: Displays published articles in descending order of creation date.
- **50-Word Summaries**: Home feed automatically truncates post prefaces to 50 words followed by an ellipsis (`...`).
- **Interactive Mouse Hover Effects**: Smooth hover highlights over post and project list items.
- **Flat UI Aesthetic**: Light background (`#f8fafc`), clean typography (Inter & Fira Code), and flat badge components.
- **Tag Filtering & Special Tags**: Dedicated navigation links for `#devMusings` and `#devRants`, alongside an All Tags cloud view (`/tags/`).
- **Projects & Portfolio**: Pre-rendered showcase pages for open-source software projects (`/projects/`) and developer portfolio details (`/portfolio/`).

---

## 🛠️ How to Add a New Project

### Step 1: Create a Project Directory & Colocated `.md` File
Create a new folder inside `projects/<project-slug>/` and place your `.md` content file inside it (e.g., `projects/my-new-app/my-new-app.md`):

```
projects/my-new-app/
└── my-new-app.md
```

Inside `my-new-app.md`, place the YAML frontmatter at the top:
```yaml
---
title: "My New App Title"
slug: "my-new-app"
shortDescription: "A concise 1-2 sentence description of what this project does."
tech:
  - Node.js
  - React
  - TypeScript
github: "https://github.com/jeetprakash"
date: "2026-07-28"
---

# Project Overview

Write your project description, architecture details, and code examples in Markdown here...
```

### Step 2: Register in `data/projects.json`
Add an entry in `data/projects.json`:
```json
{
  "slug": "my-new-app",
  "title": "My New App Title",
  "shortDescription": "A concise 1-2 sentence description of what this project does.",
  "tech": ["Node.js", "React", "TypeScript"],
  "github": "https://github.com/jeetprakash",
  "date": "2026-07-28",
  "file": "projects/my-new-app/my-new-app.md",
  "url": "projects/my-new-app/"
}
```

### Step 3: Compile Pre-rendered Static Pages
Run the static site generator build command:
```bash
npm run build
```
This automatically compiles `projects/my-new-app/index.html` right beside your `.md` file!

---

## 🛠️ How to Add a New Blog Post

Create a new post folder inside `posts/<YYYY>/<MM>/<slug>/` (e.g., `posts/2026/07/my-new-post/my-new-post.md`), add an entry in `posts/posts.json`, and run `npm run build`.

---

## 🚀 How to Run & Test Locally

```bash
npx serve .
```
Then visit `http://localhost:3000` in your browser.

---

## 🌐 Deploying to GitHub Pages

```bash
git add .
git commit -m "Relocate project links exclusively to individual project description pages"
git push origin main
```
GitHub Pages will automatically host your project pages natively at `https://jeetprakash.github.io/projects/antigravity-cli/`!

---

## 📁 Directory Structure

```
jeetprakash.github.io/
├── index.html                           # Home Page (Pre-rendered latest posts)
├── build.js                             # Static Site Pre-renderer Engine
├── package.json                         # Node build script runner
├── README.md                            # Documentation & setup guide
├── css/
│   └── style.css                        # Flat design system & light theme
├── data/
│   ├── projects.json                    # Projects registry manifest
│   └── portfolio.json                   # Portfolio & skills dataset
├── posts/
│   ├── posts.json                       # Central posts registry
│   └── 2026/
│       └── 07/
│           ├── sample-lorem-ipsum-post/
│           │   ├── sample-lorem-ipsum-post.md   <-- Colocated Markdown source
│           │   └── index.html                   <-- Pre-rendered Clean URL target
│           ├── welcome-to-my-dev-blog/
│           │   ├── welcome-to-my-dev-blog.md
│           │   └── index.html
│           └── reflections-on-modern-frontend-bloat/
│               ├── reflections-on-modern-frontend-bloat.md
│               └── index.html
├── projects/
│   ├── index.html                       # Pre-rendered main projects feed
│   ├── antigravity-cli/
│   │   ├── antigravity-cli.md           <-- Project Markdown source
│   │   └── index.html                   <-- Pre-rendered project page (with GitHub link)
│   ├── flat-ui-blog-generator/
│   │   ├── flat-ui-blog-generator.md
│   │   └── index.html
│   └── async-task-scheduler/
│       ├── async-task-scheduler.md
│       └── index.html
├── tags/
│   └── index.html                       # Pre-rendered All Tags page
├── tag/
│   ├── devMusings/
│   │   └── index.html                   # Pre-rendered tag page #devMusings
│   └── devRants/
│       └── index.html                   # Pre-rendered tag page #devRants
└── portfolio/
    └── index.html                       # Pre-rendered Dev Portfolio
```
