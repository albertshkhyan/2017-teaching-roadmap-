import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { marked } from 'marked'
import mammoth from 'mammoth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** First path segment of lesson/help/ready/other folders (repo root). */
const LESSON_ROOTS = new Set([
  '01_GiveLesson', '02_GiveLesson', '03_GiveLesson', '04_GiveLesson', '05_GiveLesson',
  '06_GiveLesson', '07_GiveLesson', '08_GiveLesson', '09_GiveLesson', '10_GiveLesson',
  '11_GiveLesson', '12_GiveLesson', '13_GiveLesson', '14_GiveLesson', '15_GiveLesson',
  '16_GiveLesson', '17_GiveLesson', '18_GiveLesson', '19_GiveLesson_start_DOM', '20_GiveLesson',
  '21_GiveLesson', '22_GiveLesson', '23_GiveLesson', '24_GiveLesson', '25_GiveLesson',
  '26_GiveLesson_start_OOP', '27_GiveLesson', '28_GiveLesson', '29_GiveLesson', '30_GiveLesson',
  '31_GiveLesson', '32_GiveLesson_end_OOP', '33_GiveLesson_ES6', '34_GiveLesson', '35_GiveLesson',
  '36_GiveLesson', '37_GiveLesson', '38_GiveLesson',
  'About_My_Lessons_HELP_FILES', 'ReadyWorksByJS', 'Cool_mini_projects_by_js',
  'Modules_import_and_export', 'ModulesProjects', 'Must_Know_abot-JS', 'Interview Questions',
  'EXAM', 'Different', 'MyProjects2019', 'quiz_by_JS_with_images',
])

const MIME = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.md': 'text/markdown',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
}

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'])
const VIEWER_EXT = new Set([...IMAGE_EXT, '.pdf', '.docx'])

function isRawRequest(url) {
  if (!url) return false
  try {
    const q = url.includes('?') ? url.slice(url.indexOf('?')) : ''
    return new URLSearchParams(q).get('raw') === '1'
  } catch {
    return false
  }
}

function isCarouselRequest(url) {
  if (!url) return false
  try {
    const q = url.includes('?') ? url.slice(url.indexOf('?')) : ''
    return new URLSearchParams(q).get('view') === 'carousel'
  } catch {
    return false
  }
}

function serveLessonsFromParent() {
  return {
    name: 'serve-lessons-from-parent',
    configureServer(server) {
      const parentRoot = path.resolve(__dirname, '..')
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '/'
        const decoded = decodeURIComponent(pathname)
        const seg = decoded.replace(/^\//, '').split('/')[0]
        if (!seg || !LESSON_ROOTS.has(seg)) {
          next()
          return
        }
        const filePath = path.join(parentRoot, decoded.replace(/^\//, ''))
        const normalized = path.normalize(filePath)
        if (!normalized.startsWith(parentRoot)) {
          next()
          return
        }
        fs.stat(normalized, (err, stat) => {
          if (err) {
            next()
            return
          }
          if (stat.isFile()) {
            const ext = path.extname(normalized)
            if (ext === '.md') {
              fs.readFile(normalized, 'utf8', (readErr, raw) => {
                if (readErr) {
                  res.statusCode = 500
                  res.end('Error reading file')
                  return
                }
                const htmlBody = marked(raw, { async: false })
                const pathParts = pathname.replace(/\/$/, '').split('/').filter(Boolean)
                const parentParts = pathParts.slice(0, -1)
                const breadcrumbHref = parentParts.length ? '/' + parentParts.join('/') + '/' : '/'
                const breadcrumbLabel = parentParts.length ? '↑ Parent' : '← Learning app'
                const title = path.basename(normalized, '.md')
                const mdPageHtml = renderMarkdownPage(title, htmlBody, breadcrumbHref, breadcrumbLabel)
                res.setHeader('Content-Type', 'text/html')
                res.end(mdPageHtml)
              })
              return
            }
            if (VIEWER_EXT.has(ext) && !isRawRequest(req.url)) {
              const pathParts = pathname.replace(/\/$/, '').split('/').filter(Boolean)
              const parentParts = pathParts.slice(0, -1)
              const breadcrumbHref = parentParts.length ? '/' + parentParts.join('/') + '/' : '/'
              const breadcrumbLabel = parentParts.length ? '↑ Parent' : '← Learning app'
              const fileName = path.basename(normalized)
              const rawUrl = pathname + (pathname.includes('?') ? '&' : '?') + 'raw=1'
              if (IMAGE_EXT.has(ext)) {
                const imgHtml = renderImageViewer(fileName, rawUrl, breadcrumbHref, breadcrumbLabel)
                res.setHeader('Content-Type', 'text/html')
                res.end(imgHtml)
                return
              }
              if (ext === '.pdf') {
                const pdfHtml = renderPdfViewer(fileName, rawUrl, breadcrumbHref, breadcrumbLabel)
                res.setHeader('Content-Type', 'text/html')
                res.end(pdfHtml)
                return
              }
              if (ext === '.docx') {
                fs.readFile(normalized, (readErr, buffer) => {
                  if (readErr) {
                    res.statusCode = 500
                    res.end('Error reading file')
                    return
                  }
                  mammoth.convertToHtml({ buffer }).then((result) => {
                    const docxHtml = renderDocxViewer(fileName, result.value, breadcrumbHref, breadcrumbLabel)
                    res.setHeader('Content-Type', 'text/html')
                    res.end(docxHtml)
                  }).catch(() => {
                    res.statusCode = 500
                    res.end('Error converting document')
                  })
                })
                return
              }
            }
            const mime = MIME[ext] ?? 'application/octet-stream'
            res.setHeader('Content-Type', mime)
            fs.createReadStream(normalized).pipe(res)
            return
          }
          if (stat.isDirectory()) {
            if (!decoded.endsWith('/')) {
              res.statusCode = 301
              res.setHeader('Location', pathname + '/')
              res.end()
              return
            }
            const withSlash = decoded
            const dirPath = path.join(parentRoot, withSlash.replace(/^\//, ''))
            const indexHtml = path.join(dirPath, 'index.html')
            fs.stat(indexHtml, (e, st) => {
              if (!e && st?.isFile()) {
                res.setHeader('Content-Type', 'text/html')
                fs.createReadStream(indexHtml).pipe(res)
                return
              }
              fs.readdir(dirPath, { withFileTypes: true }, (e2, entries) => {
                if (e2) {
                  res.statusCode = 500
                  res.end('Error listing directory')
                  return
                }
                const hidden = (name) => name.startsWith('.')
                const sorted = entries
                  .filter((d) => !hidden(d.name))
                  .sort((a, b) => {
                    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
                    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
                  })
                const pathParts = pathname.replace(/\/$/, '').split('/').filter(Boolean)
                const parentParts = pathParts.slice(0, -1)
                const breadcrumbHref = parentParts.length ? '/' + parentParts.join('/') + '/' : '/'
                const breadcrumbLabel = parentParts.length ? '↑ Parent' : '← Learning app'

                if (isCarouselRequest(req.url)) {
                  const imageEntries = sorted.filter(
                    (e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase())
                  )
                  if (imageEntries.length > 0) {
                    const imageUrls = imageEntries.map(
                      (e) => pathname + encodeURIComponent(e.name) + '?raw=1'
                    )
                    const carouselHtml = renderCarouselPage(
                      seg, imageUrls, breadcrumbHref, breadcrumbLabel
                    )
                    res.setHeader('Content-Type', 'text/html')
                    res.end(carouselHtml)
                    return
                  }
                }

                const list = sorted
                  .map((d) => {
                    const name = d.name + (d.isDirectory() ? '/' : '')
                    const href = withSlash + encodeURIComponent(d.name) + (d.isDirectory() ? '/' : '')
                    const ext = d.isFile() ? path.extname(d.name).toLowerCase() : ''
                    const typeLabel = d.isDirectory() ? 'Folder' : ext === '.html' || ext === '.htm' ? 'HTML' : ext === '.md' ? 'Markdown' : ext ? ext.slice(1).toUpperCase() : 'File'
                    const typeClass = d.isDirectory() ? 'type-folder' : ext === '.html' || ext === '.htm' ? 'type-html' : ext === '.md' ? 'type-md' : 'type-file'
                    return `<li><a href="${href}" class="${typeClass}"><span class="type-badge" aria-hidden="true">${escapeHtml(typeLabel)}</span>${escapeHtml(name)}</a></li>`
                  })
                  .join('')
                const imageCount = sorted.filter(
                  (e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase())
                ).length
                const carouselHref = imageCount > 0 ? pathname + '?view=carousel' : null
                const dirListingHtml = renderDirListing(
                  seg, list, breadcrumbHref, breadcrumbLabel, carouselHref
                )
                res.setHeader('Content-Type', 'text/html')
                res.end(dirListingHtml)
              })
            })
            return
          }
          next()
        })
      })
    },
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const DIR_LISTING_CSS = `
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 0; padding: 1.5rem; background: #f9fafb; color: #111; line-height: 1.5; }
  @media (prefers-color-scheme: dark) { body { background: #111; color: #f3f4f6; } }
  .wrap { max-width: 48rem; margin: 0 auto; }
  .breadcrumb { font-size: 0.875rem; margin-bottom: 1rem; color: #6b7280; }
  @media (prefers-color-scheme: dark) { .breadcrumb { color: #9ca3af; } }
  .breadcrumb a { color: #4f46e5; text-decoration: none; }
  @media (prefers-color-scheme: dark) { .breadcrumb a { color: #818cf8; } }
  .breadcrumb a:hover { text-decoration: underline; }
  .breadcrumb span { color: inherit; }
  h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem; }
  nav ul { list-style: none; padding: 0; margin: 0; }
  nav li { margin: 0; }
  nav a { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; text-decoration: none; color: inherit; }
  nav a:hover { background: #e5e7eb; }
  @media (prefers-color-scheme: dark) { nav a:hover { background: #374151; } }
  .type-badge { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; min-width: 4rem; padding: 0.125rem 0.375rem; border-radius: 0.25rem; }
  .type-folder .type-badge { background: #dbeafe; color: #1e40af; }
  .type-html .type-badge { background: #d1fae5; color: #065f46; }
  .type-md .type-badge { background: #fef3c7; color: #92400e; }
  .type-file .type-badge { background: #f3f4f6; color: #4b5563; }
  @media (prefers-color-scheme: dark) {
    .type-folder .type-badge { background: #1e3a8a; color: #93c5fd; }
    .type-html .type-badge { background: #064e3b; color: #6ee7b7; }
    .type-md .type-badge { background: #78350f; color: #fcd34d; }
    .type-file .type-badge { background: #374151; color: #9ca3af; }
  }
  .carousel-link { display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.5rem 1rem; background: #4f46e5; color: #fff; border-radius: 0.5rem; text-decoration: none; font-weight: 500; }
  .carousel-link:hover { background: #4338ca; }
  @media (prefers-color-scheme: dark) { .carousel-link { background: #6366f1; } .carousel-link:hover { background: #818cf8; } }
`

function renderDirListing(seg, list, breadcrumbHref, breadcrumbLabel, carouselHref = null) {
  const title = escapeHtml(seg)
  const safeHref = escapeHtml(breadcrumbHref)
  const safeLabel = escapeHtml(breadcrumbLabel)
  const carouselBlock =
    carouselHref != null
      ? `<p><a href="${escapeHtml(carouselHref)}" class="carousel-link">Open carousel / slideshow</a></p>`
      : ''
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Lesson files</title>
  <style>${DIR_LISTING_CSS}</style>
</head>
<body>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="${safeHref}">${safeLabel}</a>
      <span> → ${title}</span>
    </nav>
    <h1>${title}</h1>
    ${carouselBlock}
    <nav aria-label="Lesson files">
      <ul>${list}</ul>
    </nav>
  </div>
</body>
</html>`
}

const CAROUSEL_CSS = `
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 0; padding: 0; background: #111; color: #f3f4f6; height: 100vh; display: flex; flex-direction: column; }
  .carousel-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; }
  .carousel-breadcrumb { font-size: 0.875rem; padding: 0.75rem 1rem; color: #9ca3af; flex-shrink: 0; }
  .carousel-breadcrumb a { color: #818cf8; text-decoration: none; }
  .carousel-breadcrumb a:hover { text-decoration: underline; }
  .carousel-stage { flex: 1; display: flex; align-items: center; justify-content: center; padding: 1rem; min-height: 0; }
  .carousel-stage img { max-width: 100%; max-height: 85vh; object-fit: contain; display: block; }
  .carousel-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; flex-shrink: 0; }
  .carousel-controls button { padding: 0.5rem 1rem; font-size: 1rem; background: #374151; color: #fff; border: none; border-radius: 0.5rem; cursor: pointer; }
  .carousel-controls button:hover { background: #4b5563; }
  .carousel-controls button:disabled { opacity: 0.5; cursor: not-allowed; }
  .carousel-counter { font-size: 0.875rem; color: #9ca3af; min-width: 4rem; text-align: center; }
  .carousel-dots { display: flex; gap: 0.25rem; flex-wrap: wrap; justify-content: center; }
  .carousel-dots button { width: 0.5rem; height: 0.5rem; border-radius: 50%; border: none; padding: 0; background: #4b5563; cursor: pointer; }
  .carousel-dots button.active { background: #818cf8; }
  .carousel-dots button:hover { background: #6b7280; }
`

function renderCarouselPage(dirTitle, imageUrls, breadcrumbHref, breadcrumbLabel) {
  const safeTitle = escapeHtml(dirTitle)
  const safeHref = escapeHtml(breadcrumbHref)
  const safeLabel = escapeHtml(breadcrumbLabel)
  const imagesJson = JSON.stringify(imageUrls)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/</g, '\\u003c')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} — Carousel</title>
  <style>${CAROUSEL_CSS}</style>
</head>
<body>
  <div class="carousel-wrap">
    <nav class="carousel-breadcrumb" aria-label="Breadcrumb">
      <a href="${safeHref}">${safeLabel}</a>
      <span> → ${safeTitle} (slideshow)</span>
    </nav>
    <div class="carousel-stage">
      <img id="carousel-img" src="" alt="" />
    </div>
    <div class="carousel-controls">
      <button type="button" id="carousel-prev" aria-label="Previous">← Prev</button>
      <span class="carousel-counter" id="carousel-counter">1 / 1</span>
      <button type="button" id="carousel-next" aria-label="Next">Next →</button>
    </div>
    <div class="carousel-dots" id="carousel-dots" aria-hidden="true"></div>
  </div>
  <script>
    (function() {
      const IMAGES = JSON.parse('${imagesJson}');
      const total = IMAGES.length;
      let index = 0;
      const imgEl = document.getElementById('carousel-img');
      const prevBtn = document.getElementById('carousel-prev');
      const nextBtn = document.getElementById('carousel-next');
      const counterEl = document.getElementById('carousel-counter');
      const dotsEl = document.getElementById('carousel-dots');

      function go(n) {
        index = (n + total) % total;
        imgEl.src = IMAGES[index];
        imgEl.alt = 'Slide ' + (index + 1);
        counterEl.textContent = (index + 1) + ' / ' + total;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === total - 1;
        dotsEl.querySelectorAll('button').forEach((btn, i) => { btn.classList.toggle('active', i === index); });
      }

      for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.toggle('active', i === 0);
        btn.addEventListener('click', () => go(i));
        dotsEl.appendChild(btn);
      }

      prevBtn.addEventListener('click', () => go(index - 1));
      nextBtn.addEventListener('click', () => go(index + 1));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      });

      go(0);
    })();
  </script>
</body>
</html>`
}

const MD_VIEW_CSS = `
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 0; padding: 1.5rem; background: #f9fafb; color: #111; line-height: 1.6; }
  @media (prefers-color-scheme: dark) { body { background: #111; color: #f3f4f6; } }
  .md-wrap { max-width: 48rem; margin: 0 auto; }
  .md-breadcrumb { font-size: 0.875rem; margin-bottom: 1rem; color: #6b7280; }
  @media (prefers-color-scheme: dark) { .md-breadcrumb { color: #9ca3af; } }
  .md-breadcrumb a { color: #4f46e5; text-decoration: none; }
  @media (prefers-color-scheme: dark) { .md-breadcrumb a { color: #818cf8; } }
  .md-breadcrumb a:hover { text-decoration: underline; }
  .md-body h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.75rem; }
  .md-body h2 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
  .md-body h3 { font-size: 1.125rem; font-weight: 600; margin: 1rem 0 0.5rem; }
  .md-body p { margin: 0.5rem 0; }
  .md-body ul, .md-body ol { margin: 0.5rem 0; padding-left: 1.5rem; }
  .md-body li { margin: 0.25rem 0; }
  .md-body a { color: #4f46e5; text-decoration: none; }
  @media (prefers-color-scheme: dark) { .md-body a { color: #818cf8; } }
  .md-body a:hover { text-decoration: underline; }
  .md-body code { font-family: ui-monospace, monospace; font-size: 0.875em; background: #e5e7eb; color: #1f2937; padding: 0.125rem 0.375rem; border-radius: 0.25rem; }
  @media (prefers-color-scheme: dark) { .md-body code { background: #374151; color: #e5e7eb; } }
  .md-body pre { background: #f3f4f6; color: #111; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.75rem 0; }
  @media (prefers-color-scheme: dark) { .md-body pre { background: #1f2937; color: #f3f4f6; } }
  .md-body pre code { background: none; padding: 0; }
  .md-body blockquote { border-left: 4px solid #d1d5db; margin: 0.75rem 0; padding-left: 1rem; color: #6b7280; }
  @media (prefers-color-scheme: dark) { .md-body blockquote { border-left-color: #4b5563; color: #9ca3af; } }
  .md-body hr { border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
  @media (prefers-color-scheme: dark) { .md-body hr { border-top-color: #374151; } }
`

const VIEWER_LAYOUT_CSS = `
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 0; padding: 1.5rem; background: #f9fafb; color: #111; }
  @media (prefers-color-scheme: dark) { body { background: #111; color: #f3f4f6; } }
  .viewer-wrap { max-width: 56rem; margin: 0 auto; }
  .viewer-breadcrumb { font-size: 0.875rem; margin-bottom: 1rem; color: #6b7280; }
  @media (prefers-color-scheme: dark) { .viewer-breadcrumb { color: #9ca3af; } }
  .viewer-breadcrumb a { color: #4f46e5; text-decoration: none; }
  @media (prefers-color-scheme: dark) { .viewer-breadcrumb a { color: #818cf8; } }
  .viewer-breadcrumb a:hover { text-decoration: underline; }
  .viewer-content { margin-top: 1rem; background: #fff; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  @media (prefers-color-scheme: dark) { .viewer-content { background: #1f2937; box-shadow: 0 1px 3px rgba(0,0,0,0.3); } }
  .viewer-content img { max-width: 100%; height: auto; display: block; }
  .viewer-content iframe { width: 100%; min-height: 70vh; border: 0; display: block; }
  .docx-body { padding: 1.5rem; line-height: 1.6; }
  .docx-body h1, .docx-body h2, .docx-body h3, .docx-body p, .docx-body ul, .docx-body ol { margin: 0.5rem 0; }
  .docx-body a { color: #4f46e5; }
  @media (prefers-color-scheme: dark) { .docx-body a { color: #818cf8; } }
`

function renderImageViewer(fileName, rawUrl, breadcrumbHref, breadcrumbLabel) {
  const safeFile = escapeHtml(fileName)
  const safeRaw = escapeHtml(rawUrl)
  const safeHref = escapeHtml(breadcrumbHref)
  const safeLabel = escapeHtml(breadcrumbLabel)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeFile}</title>
  <style>${VIEWER_LAYOUT_CSS}</style>
</head>
<body>
  <div class="viewer-wrap">
    <nav class="viewer-breadcrumb" aria-label="Breadcrumb">
      <a href="${safeHref}">${safeLabel}</a>
      <span> → ${safeFile}</span>
    </nav>
    <div class="viewer-content">
      <img src="${safeRaw}" alt="${safeFile}" />
    </div>
  </div>
</body>
</html>`
}

function renderPdfViewer(fileName, rawUrl, breadcrumbHref, breadcrumbLabel) {
  const safeFile = escapeHtml(fileName)
  const safeRaw = escapeHtml(rawUrl)
  const safeHref = escapeHtml(breadcrumbHref)
  const safeLabel = escapeHtml(breadcrumbLabel)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeFile}</title>
  <style>${VIEWER_LAYOUT_CSS}</style>
</head>
<body>
  <div class="viewer-wrap">
    <nav class="viewer-breadcrumb" aria-label="Breadcrumb">
      <a href="${safeHref}">${safeLabel}</a>
      <span> → ${safeFile}</span>
    </nav>
    <div class="viewer-content">
      <iframe src="${safeRaw}" title="${safeFile}"></iframe>
    </div>
  </div>
</body>
</html>`
}

function renderDocxViewer(fileName, htmlBody, breadcrumbHref, breadcrumbLabel) {
  const safeFile = escapeHtml(fileName)
  const safeHref = escapeHtml(breadcrumbHref)
  const safeLabel = escapeHtml(breadcrumbLabel)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeFile}</title>
  <style>${VIEWER_LAYOUT_CSS}</style>
</head>
<body>
  <div class="viewer-wrap">
    <nav class="viewer-breadcrumb" aria-label="Breadcrumb">
      <a href="${safeHref}">${safeLabel}</a>
      <span> → ${safeFile}</span>
    </nav>
    <div class="viewer-content">
      <div class="docx-body">${htmlBody}</div>
    </div>
  </div>
</body>
</html>`
}

function renderMarkdownPage(title, htmlBody, breadcrumbHref, breadcrumbLabel) {
  const safeTitle = escapeHtml(title)
  const safeHref = escapeHtml(breadcrumbHref)
  const safeLabel = escapeHtml(breadcrumbLabel)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} — Markdown</title>
  <style>${MD_VIEW_CSS}</style>
</head>
<body>
  <div class="md-wrap">
    <nav class="md-breadcrumb" aria-label="Breadcrumb">
      <a href="${safeHref}">${safeLabel}</a>
      <span> → ${safeTitle}.md</span>
    </nav>
    <main class="md-body">${htmlBody}</main>
  </div>
</body>
</html>`
}

export default defineConfig({
  plugins: [tailwindcss(), serveLessonsFromParent()],
  server: {
    fs: { allow: ['..'] },
  },
})
