import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

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
                const list = entries
                  .map((d) => {
                    const name = d.name + (d.isDirectory() ? '/' : '')
                    const href = withSlash + encodeURIComponent(d.name) + (d.isDirectory() ? '/' : '')
                    return `<li><a href="${href}">${escapeHtml(name)}</a></li>`
                  })
                  .join('')
                res.setHeader('Content-Type', 'text/html')
                res.end(
                  `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(seg)}</title></head><body><h1>${escapeHtml(seg)}</h1><ul>${list}</ul></body></html>`
                )
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
  const div = { textContent: s }
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default defineConfig({
  plugins: [tailwindcss(), serveLessonsFromParent()],
  server: {
    fs: { allow: ['..'] },
  },
})
