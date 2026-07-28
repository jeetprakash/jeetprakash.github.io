const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { marked } = require('marked');

// Configure Marked options
marked.setOptions({
  breaks: true,
  gfm: true
});

// Helper: Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper: Truncate summary to max 50 words followed by '...'
function truncateWords(text, limit = 50) {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(' ') + '...';
}

// Helper: Format date string
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper: Format Tag CSS Class
function getTagClass(tag) {
  const clean = tag.replace(/^#/, '');
  if (clean === 'devMusings') return 'tag-badge tag-devMusings';
  if (clean === 'devRants') return 'tag-badge tag-devRants';
  return 'tag-badge';
}

// Layout Template Generator
function renderHtmlPage({ title, description, content, rootPrefix, activeNav = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${description}">
  <meta name="author" content="Jeet Prakash">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">

  <!-- Google Fonts: Inter & Fira Code -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Highlight.js Light Syntax Highlighting Theme -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">

  <!-- Flat Design System Stylesheet -->
  <link rel="stylesheet" href="${rootPrefix}css/style.css">
</head>
<body>

  <!-- Site Header & Flat Navigation Bar -->
  <header class="site-header">
    <div class="brand-section">
      <div>
        <h1 class="brand-title"><a href="${rootPrefix}">jeetprakash</a></h1>
        <p class="brand-subtitle">Software Engineering &bull; Dev Musings &bull; Code Projects</p>
      </div>
    </div>
    
    <nav class="flat-nav" aria-label="Main Navigation">
      <a href="${rootPrefix}" class="nav-link ${activeNav === 'home' ? 'active' : ''}">All Posts</a>
      <a href="${rootPrefix}tags/" class="nav-link ${activeNav === 'tags' ? 'active' : ''}">Tags</a>
      <a href="${rootPrefix}tag/devMusings/" class="nav-link special-musing ${activeNav === 'devMusings' ? 'active' : ''}">#devMusings</a>
      <a href="${rootPrefix}tag/devRants/" class="nav-link special-rant ${activeNav === 'devRants' ? 'active' : ''}">#devRants</a>
      <a href="${rootPrefix}projects/" class="nav-link ${activeNav === 'projects' ? 'active' : ''}">Projects</a>
      <a href="${rootPrefix}portfolio/" class="nav-link ${activeNav === 'portfolio' ? 'active' : ''}">Portfolio</a>
    </nav>
  </header>

  <!-- Pre-rendered Main Content (Visible in View Page Source) -->
  <main id="app" class="site-main">
    ${content}
  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <p>&copy; 2026 Jeet Prakash &bull; Hosted on <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a></p>
  </footer>

  <!-- Syntax Highlighting Script -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>document.addEventListener('DOMContentLoaded', () => hljs.highlightAll());</script>
</body>
</html>`;
}

// Post Card Component HTML Generator (Entire card including footer is inside <a class="post-card">)
function renderPostCard(post, rootPrefix) {
  const summaryText = truncateWords(post.preface || post.summary || '', 50);
  const formattedDate = formatDate(post.date);

  const tagsHtml = (post.tags || []).map(t => {
    const clean = t.replace(/^#/, '');
    return `<span class="${getTagClass(clean)}">#${clean}</span>`;
  }).join(' ');

  return `
    <a href="${rootPrefix}${post.url}" class="post-card">
      <div class="post-card-header">
        <h2 class="post-card-title">${post.title}</h2>
        <span class="post-card-date">${formattedDate}</span>
      </div>
      <p class="post-card-summary">${summaryText}</p>
      <div class="post-card-footer">
        ${tagsHtml}
      </div>
    </a>
  `;
}

// Build Function
async function buildSite() {
  console.log('🚀 Starting Static Site Generator Pre-rendering...');

  // =========================================================================
  // BLOG POSTS PROCESSING
  // =========================================================================
  const manifestPath = path.join(__dirname, 'posts', 'posts.json');
  const postsManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const posts = postsManifest.map(meta => {
    let markdownPath = path.join(__dirname, meta.file);
    if (!fs.existsSync(markdownPath)) {
      const dateObj = new Date(meta.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      markdownPath = path.join(__dirname, 'posts', String(year), String(month), meta.slug, `${meta.slug}.md`);
    }

    let bodyMarkdown = '';
    let frontmatter = {};

    if (fs.existsSync(markdownPath)) {
      const rawText = fs.readFileSync(markdownPath, 'utf8');
      const match = rawText.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
      if (match) {
        frontmatter = yaml.load(match[1]) || {};
        bodyMarkdown = match[2];
      } else {
        bodyMarkdown = rawText;
      }
    } else {
      console.warn(`⚠️ Warning: Markdown file not found for post ${meta.slug} at ${markdownPath}`);
    }

    const dateObj = new Date(meta.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const nestedUrl = `posts/${year}/${month}/${meta.slug}/`;
    const colocatedFile = `posts/${year}/${month}/${meta.slug}/${meta.slug}.md`;

    return {
      ...meta,
      ...frontmatter,
      year,
      month,
      url: nestedUrl,
      file: colocatedFile,
      bodyHtml: marked.parse(bodyMarkdown)
    };
  });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(manifestPath, JSON.stringify(posts.map(p => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    updated: p.updated,
    preface: p.preface,
    tags: p.tags,
    headerImage: p.headerImage,
    file: p.file,
    url: p.url
  })), null, 2));

  // 1. Home Page (index.html)
  console.log('📄 Pre-rendering Home Page (index.html)...');
  let homeContent = `
    <div class="page-title-banner">
      <h1 class="page-title">Latest Posts</h1>
      <p class="page-subtitle">Articles, musings, and engineering notes in descending date order.</p>
    </div>
    <div class="posts-list">
  `;
  posts.forEach(p => {
    homeContent += renderPostCard(p, './');
  });
  homeContent += `</div>`;

  fs.writeFileSync(path.join(__dirname, 'index.html'), renderHtmlPage({
    title: 'jeetprakash | Developer Blog & Portfolio',
    description: 'Developer blog, dev musings, project showcase, and portfolio.',
    content: homeContent,
    rootPrefix: './',
    activeNav: 'home'
  }));

  // 2. Individual Blog Post Pages (posts/YYYY/MM/slug/index.html)
  console.log('📄 Pre-rendering Individual Blog Posts...');
  posts.forEach(p => {
    const postDir = path.join(__dirname, 'posts', String(p.year), String(p.month), p.slug);
    ensureDir(postDir);

    const rootPrefix = '../../../../';
    const tagsHtml = (p.tags || []).map(t => {
      const clean = t.replace(/^#/, '');
      return `<a href="${rootPrefix}tag/${clean}/" class="${getTagClass(clean)}">#${clean}</a>`;
    }).join(' ');

    const headerImgHtml = p.headerImage ? `
      <img src="${rootPrefix}${p.headerImage}" alt="${p.title}" class="post-header-img" onerror="this.style.display='none'"/>
    ` : '';

    const updatedDateHtml = p.updated ? `&bull; <span>Updated: ${formatDate(p.updated)}</span>` : '';

    const postContent = `
      <a href="${rootPrefix}" class="back-btn">&larr; Back to Posts</a>
      <article class="post-detail">
        <header class="post-detail-header">
          <h1 class="post-detail-title">${p.title}</h1>
          <div class="post-meta-bar">
            <span>Published: ${formatDate(p.date)}</span>
            ${updatedDateHtml}
            <div style="margin-left:auto; display:flex; gap:0.4rem;">
              ${tagsHtml}
            </div>
          </div>
          ${p.preface ? `<div class="post-preface-box">${p.preface}</div>` : ''}
        </header>
        ${headerImgHtml}
        <div class="post-content">
          ${p.bodyHtml}
        </div>
      </article>
    `;

    fs.writeFileSync(path.join(postDir, 'index.html'), renderHtmlPage({
      title: `${p.title} | jeetprakash`,
      description: p.preface || p.title,
      content: postContent,
      rootPrefix: rootPrefix
    }));
    console.log(`   └─ Pre-rendered post: posts/${p.year}/${p.month}/${p.slug}/index.html`);
  });

  // 3. All Tags Page (tags/index.html)
  console.log('📄 Pre-rendering All Tags Page (tags/index.html)...');
  const tagCounts = {};
  posts.forEach(p => {
    (p.tags || []).forEach(t => {
      const clean = t.replace(/^#/, '');
      tagCounts[clean] = (tagCounts[clean] || 0) + 1;
    });
  });

  const tagsArray = Object.keys(tagCounts).sort((a, b) => a.localeCompare(b));
  const rootPrefixTags = '../';

  let tagsContent = `
    <div class="page-title-banner">
      <h1 class="page-title">All Tags</h1>
      <p class="page-subtitle">Browse articles by topics, musings, and rants.</p>
    </div>
    <div class="tags-cloud">
  `;

  tagsArray.forEach(t => {
    tagsContent += `
      <a href="${rootPrefixTags}tag/${t}/" class="tag-cloud-item ${getTagClass(t)}">
        #${t} <span class="tag-count">${tagCounts[t]}</span>
      </a>
    `;
  });
  tagsContent += `</div>`;

  ensureDir(path.join(__dirname, 'tags'));
  fs.writeFileSync(path.join(__dirname, 'tags', 'index.html'), renderHtmlPage({
    title: 'All Tags | jeetprakash',
    description: 'Browse articles by developer tags and topics.',
    content: tagsContent,
    rootPrefix: rootPrefixTags,
    activeNav: 'tags'
  }));

  // 4. Specific Tag Filter Pages (tag/<name>/index.html)
  console.log('📄 Pre-rendering Tag Filter Pages...');
  tagsArray.forEach(t => {
    const tagDir = path.join(__dirname, 'tag', t);
    ensureDir(tagDir);
    const rootPrefixTag = '../../';

    const filtered = posts.filter(p => (p.tags || []).some(pt => pt.replace(/^#/, '').toLowerCase() === t.toLowerCase()));

    let tagPageContent = `
      <a href="${rootPrefixTag}tags/" class="back-btn">&larr; All Tags</a>
      <div class="page-title-banner">
        <h1 class="page-title">Posts tagged with <span class="${getTagClass(t)}">#${t}</span></h1>
        <p class="page-subtitle">${filtered.length} article(s) found in descending date order.</p>
      </div>
      <div class="posts-list">
    `;

    filtered.forEach(p => {
      tagPageContent += renderPostCard(p, rootPrefixTag);
    });
    tagPageContent += `</div>`;

    const activeNavTag = (t === 'devMusings' ? 'devMusings' : (t === 'devRants' ? 'devRants' : 'tags'));

    fs.writeFileSync(path.join(tagDir, 'index.html'), renderHtmlPage({
      title: `#${t} Posts | jeetprakash`,
      description: `Articles tagged with #${t}`,
      content: tagPageContent,
      rootPrefix: rootPrefixTag,
      activeNav: activeNavTag
    }));
    console.log(`   └─ Pre-rendered tag: tag/${t}/index.html`);
  });

  // =========================================================================
  // MARKDOWN-DRIVEN PROJECTS PROCESSING
  // =========================================================================
  console.log('📄 Pre-rendering Markdown-Driven Projects...');
  const projectsManifestPath = path.join(__dirname, 'data', 'projects.json');
  const projectsManifest = JSON.parse(fs.readFileSync(projectsManifestPath, 'utf8'));

  const projects = projectsManifest.map(meta => {
    const markdownPath = path.join(__dirname, 'projects', meta.slug, `${meta.slug}.md`);
    let bodyMarkdown = '';
    let frontmatter = {};

    if (fs.existsSync(markdownPath)) {
      const rawText = fs.readFileSync(markdownPath, 'utf8');
      const match = rawText.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
      if (match) {
        frontmatter = yaml.load(match[1]) || {};
        bodyMarkdown = match[2];
      } else {
        bodyMarkdown = rawText;
      }
    } else {
      console.warn(`⚠️ Warning: Project markdown file not found at ${markdownPath}`);
    }

    const projectUrl = `projects/${meta.slug}/`;
    const colocatedFile = `projects/${meta.slug}/${meta.slug}.md`;

    return {
      ...meta,
      ...frontmatter,
      url: projectUrl,
      file: colocatedFile,
      bodyHtml: marked.parse(bodyMarkdown)
    };
  });

  fs.writeFileSync(projectsManifestPath, JSON.stringify(projects.map(p => ({
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription || p.description,
    tech: p.tech,
    github: p.github,
    date: p.date,
    file: p.file,
    url: p.url
  })), null, 2));

  // 5. Pre-render Main Projects Showcase Page (projects/index.html)
  console.log('📄 Pre-rendering Projects Main List Page (projects/index.html)...');
  const rootPrefixProj = '../';

  let projListContent = `
    <div class="page-title-banner">
      <h1 class="page-title">Projects Showcase</h1>
      <p class="page-subtitle">Click any project card to view full documentation and architectural details.</p>
    </div>
    <div class="projects-grid">
  `;

  projects.forEach(proj => {
    const techBadges = (proj.tech || []).map(t => `<span class="tech-tag">${t}</span>`).join(' ');

    projListContent += `
      <a href="${rootPrefixProj}${proj.url}" class="project-card" style="text-decoration:none;">
        <div>
          <h2 class="project-title">${proj.title}</h2>
          <p class="project-desc">${proj.shortDescription || ''}</p>
          <div class="project-tech">${techBadges}</div>
        </div>
      </a>
    `;
  });
  projListContent += `</div>`;

  ensureDir(path.join(__dirname, 'projects'));
  fs.writeFileSync(path.join(__dirname, 'projects', 'index.html'), renderHtmlPage({
    title: 'Projects | jeetprakash',
    description: 'Open-source tools and developer projects by Jeet Prakash.',
    content: projListContent,
    rootPrefix: rootPrefixProj,
    activeNav: 'projects'
  }));

  // 6. Pre-render Individual Project Detail Pages (projects/<slug>/index.html)
  console.log('📄 Pre-rendering Individual Project Detail Pages...');
  projects.forEach(proj => {
    const projectDir = path.join(__dirname, 'projects', proj.slug);
    ensureDir(projectDir);

    const rootPrefixDetail = '../../';
    const techBadges = (proj.tech || []).map(t => `<span class="skill-pill">${t}</span>`).join(' ');
    const githubBtn = proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener" class="btn-flat">GitHub Repository &rarr;</a>` : '';

    const projectDetailContent = `
      <a href="${rootPrefixDetail}projects/" class="back-btn">&larr; Back to Projects</a>
      <article class="post-detail">
        <header class="post-detail-header">
          <h1 class="post-detail-title">${proj.title}</h1>
          <div class="post-meta-bar">
            <span>Project Released: ${formatDate(proj.date)}</span>
          </div>
          <p class="post-preface-box">${proj.shortDescription || ''}</p>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:1rem;">
            ${techBadges}
          </div>
          ${githubBtn ? `<div class="project-links" style="margin-top:1.25rem;">${githubBtn}</div>` : ''}
        </header>

        <div class="post-content">
          ${proj.bodyHtml}
        </div>
      </article>
    `;

    fs.writeFileSync(path.join(projectDir, 'index.html'), renderHtmlPage({
      title: `${proj.title} | Projects | jeetprakash`,
      description: proj.shortDescription || proj.title,
      content: projectDetailContent,
      rootPrefix: rootPrefixDetail,
      activeNav: 'projects'
    }));
    console.log(`   └─ Pre-rendered project: projects/${proj.slug}/index.html`);
  });

  // =========================================================================
  // PORTFOLIO PROCESSING
  // =========================================================================
  console.log('📄 Pre-rendering Portfolio Page (portfolio/index.html)...');
  const portData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'portfolio.json'), 'utf8'));
  const rootPrefixPort = '../';

  const skillsHtml = (portData.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join(' ');
  const expHtml = (portData.experience || []).map(e => `
    <div class="timeline-item">
      <div class="timeline-role">${e.role}</div>
      <div class="timeline-company">${e.company}</div>
      <div class="timeline-period">${e.period}</div>
      <p class="timeline-desc">${e.description}</p>
    </div>
  `).join('');

  const eduHtml = (portData.education || []).map(ed => `
    <div class="timeline-item">
      <div class="timeline-role">${ed.degree}</div>
      <div class="timeline-company">${ed.institution}</div>
      <div class="timeline-period">${ed.year}</div>
    </div>
  `).join('');

  const portContent = `
    <div class="portfolio-container">
      <div class="portfolio-hero">
        <h1 class="portfolio-name">${portData.name}</h1>
        <div class="portfolio-role">${portData.title}</div>
        <p class="portfolio-bio">${portData.bio}</p>
        <div class="portfolio-meta">
          <span>📍 ${portData.location}</span>
          <span>✉️ <a href="mailto:${portData.email}">${portData.email}</a></span>
          <span>💻 <a href="${portData.github}" target="_blank" rel="noopener">GitHub Profile</a></span>
        </div>
      </div>

      <div class="section-block">
        <h2 class="section-heading">Skills & Technologies</h2>
        <div class="skills-list">${skillsHtml}</div>
      </div>

      <div class="section-block">
        <h2 class="section-heading">Work Experience</h2>
        <div class="timeline">${expHtml}</div>
      </div>

      <div class="section-block">
        <h2 class="section-heading">Education</h2>
        <div class="timeline">${eduHtml}</div>
      </div>
    </div>
  `;

  ensureDir(path.join(__dirname, 'portfolio'));
  fs.writeFileSync(path.join(__dirname, 'portfolio', 'index.html'), renderHtmlPage({
    title: 'Portfolio | jeetprakash',
    description: `Developer portfolio and background of ${portData.name}`,
    content: portContent,
    rootPrefix: rootPrefixPort,
    activeNav: 'portfolio'
  }));

  console.log('✅ Static Site Generation Pre-rendering Complete!');
}

buildSite().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
