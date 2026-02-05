import './style.css'
import { COURSE, LESSONS_BASE } from './data/course.js'
import { QUIZZES, PLAYGROUND_STARTER } from './data/quizzes.js'
import { PLAYGROUND_STARTERS } from './data/playgroundStarters.js'
import { mountPlaygroundEditor } from './playground-editor.js'
import { chevronRightSvg, searchSvg, xSvg, sunSvg, moonSvg, circleSvg, checkCircleSvg, clockSvg, gripHorizontalSvg, gripVerticalSvg, checkSvg, crossSvg, quizSvg } from './icons.js'
import { animate } from 'motion'

const STORAGE_KEY = 'learning-app-progress'
const PLAYGROUND_STORAGE_KEY = 'learning-app-playground-code'
const PLAYGROUND_FRAME_HEIGHT_KEY = 'learning-app-playground-frame-height'
const SIDEBAR_COLLAPSED_KEY = 'learning-app-sidebar-collapsed'
const SIDEBAR_WIDTH_KEY = 'learning-app-sidebar-width'
const SIDEBAR_WIDTH_MIN = 200
const SIDEBAR_WIDTH_MAX = 480
const SIDEBAR_WIDTH_DEFAULT = 320
const THEME_KEY = 'learning-app-theme'
const QUIZ_THRESHOLD_KEY = 'learning-app-quiz-threshold'
const PROGRESS_EXPORT_VERSION = 1
const FOCUS_MODE_KEY = 'learning-app-focus-mode'
const FONT_SIZE_KEY = 'learning-app-font-size'
const INSTALL_PROMPT_DISMISSED_KEY = 'learning-app-install-dismissed'

const PLAYGROUND_FRAME_HEIGHT_MIN = 128
const PLAYGROUND_FRAME_HEIGHT_MAX = 600
const PLAYGROUND_FRAME_HEIGHT_DEFAULT = 256
const PLAYGROUND_EDITOR_HEIGHT_KEY = 'learning-app-playground-editor-height'
const PLAYGROUND_EDITOR_HEIGHT_MIN = 120
const PLAYGROUND_EDITOR_HEIGHT_MAX = 500
const PLAYGROUND_EDITOR_HEIGHT_DEFAULT = 160

/** Script injected into playground iframe to capture console.log/error/warn and postMessage to parent. */
const PLAYGROUND_CONSOLE_CAPTURE_SCRIPT = `<script>(function(){var o={log:console.log,error:console.error,warn:console.warn};['log','error','warn'].forEach(function(m){console[m]=function(){var a=Array.prototype.slice.call(arguments);o[m].apply(console,a);try{window.parent.postMessage({type:'playground-console',method:m,args:a.map(function(x){return typeof x==='object'?JSON.stringify(x):String(x);})},'*');}catch(e){}};});})();<\/script>`

/**
 * Injects console-capture script into HTML so iframe can postMessage log/error/warn to parent.
 * @param {string} html - Full document HTML
 * @returns {string}
 */
function injectPlaygroundConsoleCapture(html) {
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<\/head\s*>/i, PLAYGROUND_CONSOLE_CAPTURE_SCRIPT + '</head>')
  }
  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/<body([^>]*)>/i, '<body$1>' + PLAYGROUND_CONSOLE_CAPTURE_SCRIPT)
  }
  return PLAYGROUND_CONSOLE_CAPTURE_SCRIPT + html
}

/** Ace playground instance; destroyed before re-render. */
let playgroundEditorRef = null
/** Message handler for playground console; removed before re-adding on each render. */
let playgroundConsoleHandler = null
/** PWA install prompt event; set by beforeinstallprompt. */
let deferredInstallPrompt = null

const DEFAULT_THEME = 'dark'

function getTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'light' ? 'light' : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {}
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function getSidebarCollapsed() {
  try {
    const raw = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw)
    return typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

function setSidebarCollapsed(obj) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(obj))
  } catch {}
}

function getSidebarWidth() {
  try {
    const n = parseInt(localStorage.getItem(SIDEBAR_WIDTH_KEY), 10)
    if (Number.isFinite(n) && n >= SIDEBAR_WIDTH_MIN && n <= SIDEBAR_WIDTH_MAX) return n
  } catch {}
  return SIDEBAR_WIDTH_DEFAULT
}

function setSidebarWidth(px) {
  try {
    const n = Math.round(Number(px))
    if (Number.isFinite(n)) localStorage.setItem(SIDEBAR_WIDTH_KEY, String(Math.max(SIDEBAR_WIDTH_MIN, Math.min(SIDEBAR_WIDTH_MAX, n))))
  } catch {}
}

/** Wrap matched substring in <mark>; rest is escaped. */
function highlightMatch(text, query) {
  if (!query || !text) return escapeHtml(text)
  const escaped = escapeHtml(text)
  const re = new RegExp(`(${escapeRegex(query)})`, 'gi')
  return escaped.replace(re, '<mark class="bg-yellow-200 dark:bg-amber-900/60 dark:text-amber-200 rounded px-0.5">$1</mark>')
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getPlaygroundCode() {
  try {
    const saved = localStorage.getItem(PLAYGROUND_STORAGE_KEY)
    return typeof saved === 'string' && saved.length > 0 ? saved : PLAYGROUND_STARTER
  } catch {
    return PLAYGROUND_STARTER
  }
}

function setPlaygroundCode(code) {
  try {
    if (typeof code === 'string') localStorage.setItem(PLAYGROUND_STORAGE_KEY, code)
  } catch {}
}

function getPlaygroundFrameHeight() {
  try {
    const n = parseInt(localStorage.getItem(PLAYGROUND_FRAME_HEIGHT_KEY), 10)
    if (Number.isFinite(n) && n >= PLAYGROUND_FRAME_HEIGHT_MIN && n <= PLAYGROUND_FRAME_HEIGHT_MAX) return n
  } catch {}
  return PLAYGROUND_FRAME_HEIGHT_DEFAULT
}

function setPlaygroundFrameHeight(px) {
  try {
    const n = Math.round(Number(px))
    if (Number.isFinite(n)) localStorage.setItem(PLAYGROUND_FRAME_HEIGHT_KEY, String(n))
  } catch {}
}

function getPlaygroundEditorHeight() {
  try {
    const n = parseInt(localStorage.getItem(PLAYGROUND_EDITOR_HEIGHT_KEY), 10)
    if (Number.isFinite(n) && n >= PLAYGROUND_EDITOR_HEIGHT_MIN && n <= PLAYGROUND_EDITOR_HEIGHT_MAX) return n
  } catch {}
  return PLAYGROUND_EDITOR_HEIGHT_DEFAULT
}

function setPlaygroundEditorHeight(px) {
  try {
    const n = Math.round(Number(px))
    if (Number.isFinite(n)) localStorage.setItem(PLAYGROUND_EDITOR_HEIGHT_KEY, String(n))
  } catch {}
}

function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completedIds: [], lastLessonId: null, quizPassed: {}, bookmarks: [], lastAccessedAt: null, streak: 0 }
    const data = JSON.parse(raw)
    return {
      completedIds: Array.isArray(data.completedIds) ? data.completedIds : [],
      lastLessonId: data.lastLessonId ?? null,
      quizPassed: data.quizPassed && typeof data.quizPassed === 'object' ? data.quizPassed : {},
      bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
      lastAccessedAt: typeof data.lastAccessedAt === 'string' ? data.lastAccessedAt : null,
      streak: typeof data.streak === 'number' && data.streak >= 0 ? data.streak : 0,
    }
  } catch {
    return { completedIds: [], lastLessonId: null, quizPassed: {}, bookmarks: [], lastAccessedAt: null, streak: 0 }
  }
}

function setProgress(completedIds, lastLessonId, quizPassed, bookmarks, extra = {}) {
  const current = getProgress()
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completedIds: completedIds ?? current.completedIds,
    lastLessonId: lastLessonId ?? current.lastLessonId,
    quizPassed: quizPassed ?? current.quizPassed,
    bookmarks: bookmarks ?? current.bookmarks,
    lastAccessedAt: extra.lastAccessedAt ?? current.lastAccessedAt,
    streak: extra.streak !== undefined ? extra.streak : current.streak,
  }))
}

/** Quiz pass threshold from localStorage: '2/3' (default) or '3/3'. Returns min correct needed for total questions. */
function getQuizPassThreshold(totalQuestions) {
  try {
    const v = localStorage.getItem(QUIZ_THRESHOLD_KEY)
    if (v === '3/3') return totalQuestions
  } catch {}
  return Math.ceil(totalQuestions * 2 / 3)
}

function getQuizThresholdOption() {
  try {
    const v = localStorage.getItem(QUIZ_THRESHOLD_KEY)
    return v === '3/3' ? '3/3' : '2/3'
  } catch {}
  return '2/3'
}

function setQuizThresholdOption(value) {
  try {
    localStorage.setItem(QUIZ_THRESHOLD_KEY, value === '3/3' ? '3/3' : '2/3')
  } catch {}
}

/** Export progress as JSON blob and trigger download. */
function exportProgress() {
  const data = {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    ...getProgress(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `learning-app-progress-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

/**
 * Import progress from parsed JSON; merge into localStorage and return new progress object.
 * @param {unknown} data
 * @returns {{ success: boolean, progress?: ReturnType<typeof getProgress>, error?: string }}
 */
function importProgressFromData(data) {
  if (!data || typeof data !== 'object') return { success: false, error: 'Invalid format' }
  const obj = /** @type {Record<string, unknown>} */ (data)
  const completedIds = Array.isArray(obj.completedIds) ? obj.completedIds : []
  const lastLessonId = obj.lastLessonId != null ? String(obj.lastLessonId) : null
  const quizPassed = obj.quizPassed && typeof obj.quizPassed === 'object' ? obj.quizPassed : {}
  const bookmarks = Array.isArray(obj.bookmarks) ? obj.bookmarks : []
  const lastAccessedAt = typeof obj.lastAccessedAt === 'string' ? obj.lastAccessedAt : null
  const streak = typeof obj.streak === 'number' && obj.streak >= 0 ? obj.streak : 0
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completedIds,
    lastLessonId,
    quizPassed,
    bookmarks,
    lastAccessedAt,
    streak,
  }))
  return { success: true, progress: getProgress() }
}

/** Parse URL for lesson id: pathname .../lesson/XX or hash #XX or #lesson/XX. */
function getLessonIdFromUrl() {
  const pathMatch = location.pathname.match(/\/lesson\/([^/]+)\/?$/i)
  if (pathMatch) return decodeURIComponent(pathMatch[1])
  const hash = location.hash.slice(1).replace(/^#/, '')
  const hashMatch = hash.match(/^(?:lesson\/)?(.+)$/)
  return hashMatch ? decodeURIComponent(hashMatch[1]) : null
}

/** Update URL to show current lesson (hash #id) without reload. */
function updateUrlForLesson(id) {
  const base = typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL.replace(/\/$/, '') : ''
  const url = id ? `${base}#${id}` : base || '/'
  if (location.hash !== (id ? `#${id}` : '') && location.href !== url) {
    history.pushState({ lessonId: id }, '', url)
  }
}

const CORE_IDS = new Set(COURSE.core.items.map((i) => i.id))

function getCoreProgress(progress) {
  const completed = progress.completedIds.filter((id) => CORE_IDS.has(id)).length
  const quizzesPassed = COURSE.core.items.filter((i) => QUIZZES[i.id] && progress.quizPassed?.[i.id]).length
  const quizTotal = COURSE.core.items.filter((i) => QUIZZES[i.id]).length
  return { completed, total: COURSE.core.items.length, quizzesPassed, quizTotal, bookmarks: (progress.bookmarks || []).length }
}

function updateProgressWithAccess(progress) {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const last = progress.lastAccessedAt ? progress.lastAccessedAt.slice(0, 10) : null
  let streak = progress.streak ?? 0
  if (last !== today) {
    const yesterday = new Date(now.getTime() - 864e5).toISOString().slice(0, 10)
    streak = last === yesterday ? streak + 1 : 1
  }
  return { lastAccessedAt: now.toISOString(), streak }
}

function formatLastAccessed(iso) {
  if (!iso) return null
  const then = new Date(iso)
  const now = new Date()
  const days = Math.floor((now - then) / 864e5)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

function getAllCourseItems() {
  const out = []
  for (const section of [COURSE.core, COURSE.help, COURSE.ready, COURSE.other]) {
    for (const item of section.items) out.push(item)
  }
  return out
}

function getSectionTitleForLesson(lessonId) {
  for (const section of [COURSE.core, COURSE.help, COURSE.ready, COURSE.other]) {
    if (section.items.some((i) => i.id === lessonId)) return section.title
  }
  return null
}

function getFocusMode() {
  try {
    return localStorage.getItem(FOCUS_MODE_KEY) === '1'
  } catch {
    return false
  }
}

function setFocusMode(on) {
  try {
    localStorage.setItem(FOCUS_MODE_KEY, on ? '1' : '0')
  } catch {}
}

const FONT_SIZES = { small: '0.875rem', default: '1rem', large: '1.125rem' }

function getFontSize() {
  try {
    const v = localStorage.getItem(FONT_SIZE_KEY)
    return v === 'small' || v === 'large' ? v : 'default'
  } catch {
    return 'default'
  }
}

function setFontSize(size) {
  try {
    if (size === 'small' || size === 'large') localStorage.setItem(FONT_SIZE_KEY, size)
    else localStorage.removeItem(FONT_SIZE_KEY)
  } catch {}
}

function applyFontSize() {
  document.documentElement.style.setProperty('--app-font-size', FONT_SIZES[getFontSize()])
}

function getInstallPromptDismissed() {
  try {
    return localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

function setInstallPromptDismissed() {
  try {
    localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, '1')
  } catch {}
}

function getNextCoreLesson(selected) {
  if (!selected) return null
  const items = COURSE.core.items
  const i = items.findIndex((it) => it.id === selected.id)
  return i >= 0 && i < items.length - 1 ? items[i + 1] : null
}

function getPrevCoreLesson(selected) {
  if (!selected) return null
  const items = COURSE.core.items
  const i = items.findIndex((it) => it.id === selected.id)
  return i > 0 ? items[i - 1] : null
}

function navigateToLesson(id) {
  const item = getAllCourseItems().find((i) => i.id === id)
  if (!item) return
  const access = updateProgressWithAccess(progress)
  setProgress(progress.completedIds, id, undefined, undefined, access)
  progress = { ...progress, lastLessonId: id, lastAccessedAt: access.lastAccessedAt, streak: access.streak }
  selected = item
  searchQuery = ''
  updateUrlForLesson(id)
  document.getElementById('sidebar')?.classList.add('-translate-x-full')
  render(progress, selected)
}

function searchCourseItems(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const items = getAllCourseItems()
  return items.filter((item) =>
    item.id.toLowerCase().includes(q) ||
    item.title.toLowerCase().includes(q) ||
    item.topics.toLowerCase().includes(q)
  )
}

function toggleBookmark(id, bookmarks) {
  const set = new Set(bookmarks)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  return [...set]
}

function toggleCompleted(id, completedIds) {
  const set = new Set(completedIds)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  return [...set]
}

function lessonUrl(path) {
  const base = LESSONS_BASE.replace(/\/$/, '')
  return base ? `${base}/${path}` : path
}

const LESSON_BTN_BASE = 'lesson-btn w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'

function renderSidebar(progress, searchQuery, collapsedSections = {}) {
  const q = (searchQuery || '').trim()
  const showSearchResults = q.length > 0
  const results = showSearchResults ? searchCourseItems(q) : []
  const bookmarks = progress.bookmarks || []

  let html = '<nav class="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0" role="list">'

  if (showSearchResults) {
    html += '<div class="sidebar-block"><h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Search results</h2><ul class="space-y-0.5">'
    if (results.length === 0) {
      html += `<li class="flex flex-col items-center justify-center py-6 px-3 text-center">
        <span class="text-gray-300 dark:text-gray-500 mb-2 [&_svg]:mx-auto">${searchSvg}</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">No lessons match your search.</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Try &quot;DOM&quot;, &quot;arrays&quot;, or a lesson number (e.g. 15).</p>
        <button type="button" id="search-empty-clear" class="mt-3 px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500">Clear search</button>
      </li>`
    } else {
      for (const item of results) {
        const active = progress.lastLessonId === item.id
        const titleHtml = highlightMatch(item.title, q)
        html += `<li>
          <button type="button" data-id="${escapeHtml(item.id)}" data-path="${escapeHtml(item.path)}" data-topics="${escapeHtml(item.topics)}" data-title="${escapeHtml(item.title)}"
            class="${LESSON_BTN_BASE} ${active ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 border-l-2 border-indigo-600 dark:border-indigo-500' : ''}">
            <span class="truncate" title="${escapeHtml(item.topics)}">${titleHtml}</span>
          </button>
        </li>`
      }
    }
    html += '</ul></div>'
  } else {
    const coreProg = getCoreProgress(progress)
    const lastText = formatLastAccessed(progress.lastAccessedAt)
    const streak = progress.streak ?? 0
    const pct = coreProg.total ? Math.round((coreProg.completed / coreProg.total) * 100) : 0
    const quizThreshold = getQuizThresholdOption()
    html += `<div class="sidebar-block">
      <h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Progress</h2>
      <div class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
        <div class="flex justify-between"><span>Core lessons</span><span>${coreProg.completed}/${coreProg.total}</span></div>
        <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden" role="progressbar" aria-valuenow="${coreProg.completed}" aria-valuemin="0" aria-valuemax="${coreProg.total}"><div class="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all" style="width:${pct}%"></div></div>
        <div class="flex justify-between"><span>Quizzes passed</span><span>${coreProg.quizzesPassed}/${coreProg.quizTotal}</span></div>
        <div class="flex justify-between"><span>Bookmarks</span><span>${coreProg.bookmarks}</span></div>
        ${lastText ? `<p class="pt-0.5 text-gray-500 dark:text-gray-500">Last opened ${lastText}</p>` : ''}
        ${streak > 0 ? `<p class="text-indigo-600 dark:text-indigo-400 font-medium">${streak}-day streak</p>` : ''}
        <div class="pt-1.5 flex items-center gap-2">
          <label for="quiz-threshold-select" class="text-gray-500 dark:text-gray-400">Quiz pass</label>
          <select id="quiz-threshold-select" class="text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 focus:ring-1 focus:ring-indigo-500">
            <option value="2/3" ${quizThreshold === '2/3' ? 'selected' : ''}>2/3</option>
            <option value="3/3" ${quizThreshold === '3/3' ? 'selected' : ''}>3/3</option>
          </select>
        </div>
        <div class="flex flex-wrap gap-1.5 pt-1">
          <button type="button" id="progress-export-btn" class="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Export my progress</button>
          <button type="button" id="progress-import-btn" class="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Import</button>
        </div>
      </div>
      <input type="file" id="progress-import-file" accept=".json,application/json" class="hidden" aria-hidden="true">
    </div>`
    if (bookmarks.length > 0) {
      const items = getAllCourseItems()
      html += '<div class="sidebar-block"><h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Bookmarks</h2><ul class="space-y-0.5">'
      for (const id of bookmarks) {
        const item = items.find((i) => i.id === id)
        if (!item) continue
        const active = progress.lastLessonId === item.id
        html += `<li>
          <button type="button" data-id="${escapeHtml(item.id)}" data-path="${escapeHtml(item.path)}" data-topics="${escapeHtml(item.topics)}" data-title="${escapeHtml(item.title)}"
            class="${LESSON_BTN_BASE} ${active ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 border-l-2 border-indigo-600 dark:border-indigo-500' : ''}">
            <span class="text-amber-500 dark:text-amber-400 flex-shrink-0" aria-hidden="true">★</span>
            <span class="truncate">${escapeHtml(item.title)}</span>
          </button>
        </li>`
      }
      html += '</ul></div>'
    } else {
      html += '<div class="sidebar-block pb-2"><h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Bookmarks</h2><p class="text-xs text-gray-500 dark:text-gray-400 px-1">Star a lesson to add it here.</p></div>'
    }
    const sections = [
      { key: 'core', data: COURSE.core },
      { key: 'help', data: COURSE.help },
      { key: 'ready', data: COURSE.ready },
      { key: 'other', data: COURSE.other },
    ]
    for (const { key, data } of sections) {
      const collapsed = !!collapsedSections[key]
      const isCore = key === 'core'
      const coreCompleted = isCore ? data.items.filter((i) => progress.completedIds.includes(i.id)).length : 0
      const coreTotal = isCore ? data.items.length : 0
      html += `<div class="sidebar-section sidebar-block" data-section="${escapeHtml(key)}">
        <button type="button" class="sidebar-section-toggle w-full flex items-center justify-between text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 py-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-expanded="${!collapsed}" data-section="${escapeHtml(key)}">
          <span>${escapeHtml(data.title)}</span>
          <span class="inline-flex transition-transform ${collapsed ? '' : 'rotate-90'}" aria-hidden="true">${chevronRightSvg}</span>
        </button>
        ${isCore && coreTotal ? `<p class="text-xs text-gray-400 dark:text-gray-500 mb-2">${coreCompleted}/${coreTotal} completed</p>` : ''}
        <ul class="space-y-0.5 sidebar-section-list ${collapsed ? 'hidden' : ''}">`
      for (const item of data.items) {
        const done = progress.completedIds.includes(item.id)
        const active = progress.lastLessonId === item.id
        const isBookmarked = bookmarks.includes(item.id)
        const hasQuiz = isCore && QUIZZES[item.id]
        const quizPassed = hasQuiz && progress.quizPassed?.[item.id]
        const numberBadge = isCore ? `<span class="flex-shrink-0 w-6 text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">${escapeHtml(item.id)}</span>` : ''
        const quizBadge = hasQuiz ? (quizPassed ? `<span class="flex-shrink-0 text-green-500 dark:text-green-400" title="Quiz passed" aria-label="Quiz passed">${checkSvg}</span>` : `<span class="flex-shrink-0 text-gray-400 dark:text-gray-500" title="Quiz not passed" aria-label="Quiz not passed">${quizSvg}</span>`) : ''
        html += `<li>
          <button type="button" data-id="${escapeHtml(item.id)}" data-path="${escapeHtml(item.path)}" data-topics="${escapeHtml(item.topics)}" data-title="${escapeHtml(item.title)}"
            class="${LESSON_BTN_BASE} ${active ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 border-l-2 border-indigo-600 dark:border-indigo-500' : ''} ${done ? 'opacity-90' : ''}">
            <span class="complete-check w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${done ? 'bg-green-500 text-white' : 'text-gray-400 dark:text-gray-500'}" data-id="${escapeHtml(item.id)}" title="${done ? 'Mark incomplete' : 'Mark complete'}">${done ? checkCircleSvg : circleSvg}</span>
            ${numberBadge}
            ${quizBadge}
            ${isBookmarked ? '<span class="text-amber-500 dark:text-amber-400 flex-shrink-0 text-xs" aria-hidden="true">★</span>' : ''}
            <span class="truncate ${done ? 'text-gray-500 dark:text-gray-400' : ''}">${escapeHtml(item.title)}</span>
          </button>
        </li>`
      }
      html += '</ul></div>'
    }
  }
  html += '</nav>'
  return html
}

function escapeHtml(s) {
  const div = document.createElement('div')
  div.textContent = s
  return div.innerHTML
}

function renderLessonView(selected, progress) {
  if (!selected) {
    return `
      <div class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
        <p class="text-lg">Select a lesson or section from the sidebar</p>
        <p class="text-sm mt-2">Open folder to browse files · Run demo to open in new tab</p>
      </div>
    `
  }
  const done = progress.completedIds.includes(selected.id)
  const url = lessonUrl(selected.path)
  const quiz = QUIZZES[selected.id]
  const quizPassed = progress.quizPassed?.[selected.id]
  const prereqs = selected.prereqs || []
  const missingPrereqs = prereqs.filter((id) => !progress.completedIds.includes(id))
  const prereqHint = missingPrereqs.length > 0 ? `Lesson ${missingPrereqs[0]}` : null
  const coreItems = COURSE.core.items
  const currentIndex = coreItems.findIndex((i) => i.id === selected.id)
  const nextLesson = currentIndex >= 0 && currentIndex < coreItems.length - 1 ? coreItems[currentIndex + 1] : null
  const sectionTitle = getSectionTitleForLesson(selected.id)
  const relatedIds = selected.related || []
  const relatedItems = relatedIds.map((id) => getAllCourseItems().find((i) => i.id === id)).filter(Boolean)

  let playgroundHtml = `
    <section class="mt-8 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h2 class="font-semibold text-gray-800 dark:text-gray-200">Code playground</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Edit HTML and run it below.</p>
      </div>
      <div class="p-4">
        <div id="playground-editor-wrap" class="flex flex-col">
          <div id="playground-editor" class="w-full min-h-[7.5rem] border border-gray-200 dark:border-gray-600 rounded-t overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"></div>
          <div id="playground-editor-resize-handle" class="flex-shrink-0 h-2 flex items-center justify-center cursor-ns-resize select-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-x border-b border-gray-200 dark:border-gray-600 rounded-b text-gray-400 dark:text-gray-500" title="Drag to resize editor" aria-label="Resize editor">
            ${gripHorizontalSvg}
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <button type="button" id="playground-run" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Run</button>
          ${selected && PLAYGROUND_STARTERS[selected.id] ? `<button type="button" id="playground-load-starter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">Load lesson starter</button>` : ''}
          <button type="button" id="playground-copy-code" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">Copy code</button>
          <button type="button" id="playground-copy-gist" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">Copy as gist</button>
        </div>
        <div id="playground-output-wrap" class="mt-3 flex flex-col">
          <div class="relative min-h-[8rem]">
            <div id="playground-output-empty" class="absolute inset-0 flex items-center justify-center rounded-t border border-b-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
              Click Run to see output
            </div>
            <iframe id="playground-frame" title="Playground output" class="w-full min-h-[8rem] border border-b-0 border-gray-200 dark:border-gray-600 rounded-t bg-white dark:bg-gray-900" sandbox="allow-scripts"></iframe>
          </div>
          <div id="playground-resize-handle" class="flex-shrink-0 h-2 flex items-center justify-center gap-1 cursor-ns-resize select-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-b text-gray-400 dark:text-gray-500" title="Drag to resize output" aria-label="Resize output">
            ${gripHorizontalSvg}
          </div>
          <div id="playground-console" class="mt-2 rounded border border-gray-200 dark:border-gray-600 bg-gray-900 text-gray-100 font-mono text-xs p-2 max-h-32 overflow-y-auto min-h-[2rem]" aria-label="Console output"><span class="text-gray-500 dark:text-gray-500">Console (from preview)</span></div>
          <div id="playground-output-error" class="hidden mt-2 text-sm text-red-600 dark:text-red-400" role="alert"></div>
        </div>
      </div>
    </section>
  `

  let quizHtml = ''
  if (quiz) {
    const passedBadge = quizPassed ? '<span class="ml-2 px-2 py-0.5 rounded text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">Passed</span>' : ''
    quizHtml = `
      <section class="mt-8 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <h2 class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-200">Quiz ${passedBadge}</h2>
        <form id="quiz-form" class="p-4 space-y-4">
          ${quiz.questions.map((qu, i) => `
            <div class="quiz-question border-b border-gray-200 dark:border-gray-600 pb-4 last:border-0 last:pb-0" data-question-index="${i}">
              <p class="font-medium text-gray-800 dark:text-gray-200 mb-2">${i + 1}. ${escapeHtml(qu.q)}</p>
              <div class="space-y-1 pl-2">
                ${qu.options.map((opt, j) => `
                  <label class="quiz-option-label flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300 rounded px-2 py-1 -mx-2" data-question-index="${i}" data-option-index="${j}">
                    <input type="radio" name="q${i}" value="${j}" class="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                    <span>${escapeHtml(opt)}</span>
                  </label>
                `).join('')}
              </div>
              <div class="quiz-question-feedback mt-1 text-sm hidden" data-question-index="${i}" role="status"></div>
            </div>
          `).join('')}
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Submit</button>
            <div id="quiz-result-area" class="flex flex-wrap items-center gap-3">
              <div id="quiz-result" class="text-sm text-gray-600 dark:text-gray-400" role="status"></div>
              <button type="button" id="quiz-try-again" class="hidden px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">Try again</button>
            </div>
          </div>
        </form>
      </section>
    `
  }

  return `
    <div class="p-6 max-w-3xl">
      ${sectionTitle ? `<nav class="text-sm text-gray-500 dark:text-gray-400 mb-2" aria-label="Breadcrumb">${escapeHtml(sectionTitle)} <span aria-hidden="true">→</span> <span class="text-gray-700 dark:text-gray-300">${escapeHtml(selected.title)}</span></nav>` : ''}
      ${prereqHint ? `<p class="mb-4 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">Recommended: complete ${escapeHtml(prereqHint)} first.</p>` : ''}
      <div class="flex items-start justify-between gap-4 flex-wrap">
  <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">${escapeHtml(selected.title)}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">${escapeHtml(selected.topics)}</p>
        </div>
        <span id="lesson-status-badge" class="lesson-status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm ${done ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}">${done ? checkCircleSvg + ' Completed' : clockSvg + ' In progress'}</span>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        ${nextLesson ? `<button type="button" id="next-lesson-btn" data-next-id="${escapeHtml(nextLesson.id)}" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Next lesson →</button>` : ''}
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Open folder
        </a>
        <a href="${escapeHtml(url + '/')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300">
          Run demo
        </a>
        <a href="${escapeHtml(url + '/ROADMAP.md')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">
          Lesson ROADMAP
        </a>
        <button type="button" id="bookmark-toggle" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300" title="${progress.bookmarks?.includes(selected.id) ? 'Remove from bookmarks' : 'Add to bookmarks'}">
          ${progress.bookmarks?.includes(selected.id) ? '★ Remove from bookmarks' : '☆ Add to bookmarks'}
        </button>
        <button type="button" id="focus-mode-toggle" class="no-print inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300" title="${getFocusMode() ? 'Show sidebar (F)' : 'Hide sidebar (F)'}">${getFocusMode() ? 'Exit focus' : 'Focus'}</button>
        <button type="button" id="print-lesson-btn" class="no-print inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">Print lesson</button>
        <button type="button" id="print-progress-btn" class="no-print inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">Print progress</button>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Links open the lesson folder or first file in a new tab. When using <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-gray-900 dark:text-gray-200">npm run dev</code>, the dev server serves lesson files from the repo root.</p>
      ${playgroundHtml}
      ${quizHtml}
      ${relatedItems.length > 0 ? `<div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600"><p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Related</p><p class="text-sm text-gray-600 dark:text-gray-400">${relatedItems.map((r) => `<button type="button" class="lesson-link text-indigo-600 dark:text-indigo-400 hover:underline focus:underline outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-0.5" data-lesson-id="${escapeHtml(r.id)}">Lesson ${escapeHtml(r.id)}</button>`).join(', ')}</p></div>` : ''}
      <p class="mt-6 text-xs text-gray-400 dark:text-gray-500"><button type="button" class="find-in-lesson-stub cursor-not-allowed opacity-60" disabled title="Available when lesson content is loaded">Find in lesson</button></p>
    </div>
  `
}

function render(progress, selected) {
  if (playgroundEditorRef) {
    try {
      playgroundEditorRef.destroy()
    } catch {}
    playgroundEditorRef = null
  }
  const app = document.querySelector('#app')
  const sidebarCollapsed = getSidebarCollapsed()
  const isDark = getTheme() === 'dark'
  const themeToggleLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  const themeToggleIcon = isDark ? sunSvg : moonSvg
  const focusMode = getFocusMode()
  const fontSize = getFontSize()
  const showInstallBanner = typeof deferredInstallPrompt !== 'undefined' && deferredInstallPrompt && !getInstallPromptDismissed()
  app.innerHTML = `
    <div id="app-root" class="flex h-screen bg-gray-50 dark:bg-gray-900${focusMode ? ' focus-mode' : ''}">
      <aside id="sidebar" class="flex-shrink-0 relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col max-h-screen md:relative fixed inset-y-0 left-0 z-20 transform transition-transform md:transform-none -translate-x-full md:translate-x-0" style="width: ${getSidebarWidth()}px">
        <div class="sticky top-0 z-10 flex-shrink-0 p-4 pb-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div class="mb-3 flex items-center justify-between gap-2">
            <div class="min-w-0">
              <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">2017 Educator Lessons</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Learning tool</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span class="text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">A</span>
              <button type="button" id="font-size-down" class="p-1.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm font-medium" title="Decrease font size" aria-label="Decrease font size">−</button>
              <button type="button" id="font-size-up" class="p-1.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm font-medium" title="Increase font size" aria-label="Increase font size">+</button>
              <button type="button" id="theme-toggle" class="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="${escapeHtml(themeToggleLabel)}" title="${escapeHtml(themeToggleLabel)}">${themeToggleIcon}</button>
              <button type="button" id="sidebar-close" class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-gray-700 dark:text-gray-300" aria-label="Close sidebar">×</button>
            </div>
          </div>
          ${showInstallBanner ? `<div class="mb-2 flex items-center gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-2 text-xs no-print"><button type="button" id="install-app-btn" class="flex-1 px-2 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">Install app</button><button type="button" id="install-dismiss" class="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40" aria-label="Dismiss">×</button></div>` : ''}
          <div class="relative flex items-center">
            <span class="search-icon-wrap absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center justify-center" aria-hidden="true">${searchSvg}</span>
            <input type="search" id="search-input" placeholder="Search lessons…" title="Search by number, title, or topic" value="${escapeHtml(searchQuery)}" class="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <button type="button" id="search-clear" class="absolute right-2 p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${searchQuery ? '' : 'hidden'}" aria-label="Clear search">${xSvg}</button>
          </div>
        </div>
        <div id="sidebar-nav" class="flex-1 min-h-0 overflow-y-auto p-4 pt-2">${renderSidebar(progress, searchQuery, sidebarCollapsed)}</div>
        <div id="sidebar-resize-handle" class="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors shrink-0" style="right: 0" title="Drag to resize sidebar" aria-label="Resize sidebar">
          <span class="opacity-40 hover:opacity-70 text-gray-500 dark:text-gray-400 pointer-events-none [&_svg]:w-3 [&_svg]:h-3">${gripVerticalSvg}</span>
        </div>
      </aside>
      <div class="flex-1 flex flex-col min-w-0">
        <header class="app-header-mobile flex-shrink-0 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <button type="button" id="sidebar-open" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-gray-700 dark:text-gray-300" aria-label="Open sidebar">☰</button>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">${selected ? escapeHtml(selected.title) : 'Learning tool'}</span>
        </header>
        <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div id="lesson-view-wrap">${renderLessonView(selected, progress)}</div>
        </main>
      </div>
      ${focusMode ? `<button type="button" id="show-sidebar-btn" class="no-print fixed bottom-4 left-4 z-30 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500" title="Show sidebar (F)">Show sidebar</button>` : ''}
  </div>
    <div id="print-progress-content" class="hidden p-6 max-w-2xl mx-auto text-gray-900" aria-hidden="true"></div>
  `

  const lessonViewWrap = document.getElementById('lesson-view-wrap')
  if (lessonViewWrap) {
    lessonViewWrap.style.opacity = '0'
    lessonViewWrap.style.transform = 'translateY(8px)'
    requestAnimationFrame(() => {
      animate(lessonViewWrap, { opacity: 1, y: 0 }, { duration: 0.2, ease: 'easeOut' })
    })
  }
  const statusBadge = document.getElementById('lesson-status-badge')
  if (statusBadge) {
    statusBadge.style.opacity = '0'
    statusBadge.style.transform = 'scale(0.98)'
    requestAnimationFrame(() => {
      animate(statusBadge, { opacity: 1, scale: 1 }, { duration: 0.2, delay: 0.08, ease: 'easeOut' })
    })
  }

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    render(progress, selected)
  })
  document.getElementById('font-size-down')?.addEventListener('click', () => {
    const cur = getFontSize()
    setFontSize(cur === 'large' ? 'default' : cur === 'default' ? 'small' : 'small')
    applyFontSize()
    render(progress, selected)
  })
  document.getElementById('font-size-up')?.addEventListener('click', () => {
    const cur = getFontSize()
    setFontSize(cur === 'small' ? 'default' : cur === 'default' ? 'large' : 'large')
    applyFontSize()
    render(progress, selected)
  })
  document.getElementById('install-app-btn')?.addEventListener('click', () => {
    if (typeof deferredInstallPrompt !== 'undefined' && deferredInstallPrompt) {
      deferredInstallPrompt.prompt()
      deferredInstallPrompt.userChoice.then(() => { deferredInstallPrompt = null })
      setInstallPromptDismissed()
      render(progress, selected)
    }
  })
  document.getElementById('install-dismiss')?.addEventListener('click', () => {
    setInstallPromptDismissed()
    render(progress, selected)
  })
  document.getElementById('sidebar-close')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.add('-translate-x-full')
  })
  document.getElementById('sidebar-open')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('-translate-x-full')
  })
  const sidebarEl = document.getElementById('sidebar')
  const sidebarResizeHandle = document.getElementById('sidebar-resize-handle')
  if (sidebarEl && sidebarResizeHandle) {
    sidebarResizeHandle.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return
      e.preventDefault()
      const startX = e.clientX
      const startWidth = sidebarEl.getBoundingClientRect().width
      const bodyCursor = document.body.style.cursor
      const bodySelect = document.body.style.userSelect
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
      let rafId = null
      let pendingW = null
      const apply = () => {
        rafId = null
        if (pendingW != null) {
          const w = Math.max(SIDEBAR_WIDTH_MIN, Math.min(SIDEBAR_WIDTH_MAX, pendingW))
          sidebarEl.style.width = `${w}px`
          pendingW = null
        }
      }
      const onMove = (e2) => {
        const dx = e2.clientX - startX
        pendingW = startWidth + dx
        if (rafId == null) rafId = requestAnimationFrame(apply)
      }
      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        document.body.style.cursor = bodyCursor
        document.body.style.userSelect = bodySelect
        if (rafId != null) cancelAnimationFrame(rafId)
        apply()
        setSidebarWidth(sidebarEl.getBoundingClientRect().width)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    })
  }
  document.getElementById('focus-mode-toggle')?.addEventListener('click', () => {
    setFocusMode(!getFocusMode())
    render(progress, selected)
  })
  document.getElementById('show-sidebar-btn')?.addEventListener('click', () => {
    setFocusMode(false)
    render(progress, selected)
  })
  document.getElementById('print-lesson-btn')?.addEventListener('click', () => {
    window.print()
  })
  document.getElementById('print-progress-btn')?.addEventListener('click', () => {
    const coreProg = getCoreProgress(progress)
    const lastText = formatLastAccessed(progress.lastAccessedAt)
    const el = document.getElementById('print-progress-content')
    if (el) {
      el.innerHTML = `
        <h1 class="text-2xl font-bold mb-4">Progress summary</h1>
        <p><strong>Core lessons:</strong> ${coreProg.completed}/${coreProg.total}</p>
        <p><strong>Quizzes passed:</strong> ${coreProg.quizzesPassed}/${coreProg.quizTotal}</p>
        <p><strong>Bookmarks:</strong> ${coreProg.bookmarks}</p>
        ${lastText ? `<p><strong>Last opened:</strong> ${lastText}</p>` : ''}
        ${(progress.streak ?? 0) > 0 ? `<p><strong>Streak:</strong> ${progress.streak} day(s)</p>` : ''}
      `
      document.body.classList.add('print-progress')
      window.print()
      document.body.classList.remove('print-progress')
      el.innerHTML = ''
    }
  })

  const searchInput = document.getElementById('search-input')
  const searchClear = document.getElementById('search-clear')
  const sidebarNav = document.getElementById('sidebar-nav')
  if (searchInput && sidebarNav) {
    const updateSearchUi = () => {
      searchQuery = searchInput.value
      if (searchClear) {
        searchClear.classList.toggle('hidden', !searchQuery)
      }
      sidebarNav.innerHTML = renderSidebar(progress, searchQuery, getSidebarCollapsed())
      bindSidebarNav(sidebarNav)
      bindSidebarProgressAndQuiz()
      document.getElementById('search-empty-clear')?.addEventListener('click', () => {
        searchInput.value = ''
        searchQuery = ''
        if (searchClear) searchClear.classList.add('hidden')
        searchInput.focus()
        sidebarNav.innerHTML = renderSidebar(progress, '', getSidebarCollapsed())
        bindSidebarNav(sidebarNav)
        bindSidebarProgressAndQuiz()
        scrollSidebarToActive()
      })
      scrollSidebarToActive()
    }
    searchInput.addEventListener('input', updateSearchUi)
    searchClear?.addEventListener('click', () => {
      searchInput.value = ''
      searchQuery = ''
      if (searchClear) searchClear.classList.add('hidden')
      searchInput.focus()
      sidebarNav.innerHTML = renderSidebar(progress, '', getSidebarCollapsed())
      bindSidebarNav(sidebarNav)
      bindSidebarProgressAndQuiz()
      scrollSidebarToActive()
    })
    document.getElementById('search-empty-clear')?.addEventListener('click', () => {
      searchInput.value = ''
      searchQuery = ''
      if (searchClear) searchClear.classList.add('hidden')
      searchInput.focus()
      sidebarNav.innerHTML = renderSidebar(progress, '', getSidebarCollapsed())
      bindSidebarNav(sidebarNav)
      bindSidebarProgressAndQuiz()
      scrollSidebarToActive()
    })
  }

  function bindSidebarProgressAndQuiz() {
    document.getElementById('progress-export-btn')?.addEventListener('click', () => exportProgress())
    document.getElementById('progress-import-btn')?.addEventListener('click', () => document.getElementById('progress-import-file')?.click())
    const progressImportFile = document.getElementById('progress-import-file')
    if (progressImportFile) {
      progressImportFile.addEventListener('change', () => {
        const file = progressImportFile.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const data = JSON.parse(/** @type {string} */ (reader.result))
            const result = importProgressFromData(data)
            if (result.success && result.progress) {
              progress = result.progress
              render(progress, selected)
            }
          } catch (_) {}
          progressImportFile.value = ''
        }
        reader.readAsText(file)
      })
    }
    document.getElementById('quiz-threshold-select')?.addEventListener('change', (e) => {
      const val = /** @type {HTMLSelectElement} */ (e.target).value
      setQuizThresholdOption(val)
      render(progress, selected)
    })
  }

  function scrollSidebarToActive() {
    if (!selected?.id) return
    const activeBtn = app.querySelector(`.lesson-btn[data-id="${selected.id}"]`)
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  bindSidebarNav(sidebarNav || app)
  bindSidebarProgressAndQuiz()
  scrollSidebarToActive()

  function bindSidebarNav(container) {
    if (!container) return
    // Section toggle: collapse/expand and persist
    container.querySelectorAll('.sidebar-section-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.section
        if (!key) return
        const section = container.querySelector(`.sidebar-section[data-section="${key}"]`)
        const list = section?.querySelector('.sidebar-section-list')
        if (!list) return
        const wasCollapsed = list.classList.contains('hidden')
        if (wasCollapsed) list.classList.add('section-list-animating')
        const collapsed = list.classList.toggle('hidden')
        btn.setAttribute('aria-expanded', String(!collapsed))
        const chevron = btn.querySelector('span[aria-hidden="true"]')
        if (chevron) chevron.classList.toggle('rotate-90', !collapsed)
        const next = { ...getSidebarCollapsed(), [key]: collapsed }
        setSidebarCollapsed(next)
        if (wasCollapsed && !collapsed) {
          requestAnimationFrame(() => {
            list.classList.remove('section-list-animating')
          })
        } else if (!wasCollapsed && collapsed) {
          list.classList.remove('section-list-animating')
        }
      })
    })
    // Keyboard: ArrowUp/ArrowDown move focus between lesson buttons
    container.addEventListener('keydown', (e) => {
      if (e.target?.closest?.('.lesson-btn') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const buttons = Array.from(container.querySelectorAll('.lesson-btn'))
        const i = buttons.indexOf(e.target)
        if (i === -1) return
        const next = e.key === 'ArrowDown' ? buttons[i + 1] : buttons[i - 1]
        if (next) {
          e.preventDefault()
          next.focus()
        }
      }
    })
    // Click lesson → show view + save last + update access/streak
    container.querySelectorAll('.lesson-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id
        const path = btn.dataset.path
        const topics = btn.dataset.topics
        const title = btn.dataset.title
        const access = updateProgressWithAccess(progress)
        setProgress(progress.completedIds, id, undefined, undefined, access)
        progress = { ...progress, lastLessonId: id, lastAccessedAt: access.lastAccessedAt, streak: access.streak }
        selected = { id, path, topics, title }
        searchQuery = ''
        document.getElementById('sidebar')?.classList.add('-translate-x-full')
        render(progress, selected)
      })
    })
    // Click complete check → toggle (stop propagation so lesson-btn doesn't fire)
    container.querySelectorAll('.complete-check').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        const id = el.dataset.id
        const completedIds = toggleCompleted(id, progress.completedIds)
        setProgress(completedIds, progress.lastLessonId, undefined, undefined)
        progress = { ...progress, completedIds }
        render(progress, selected)
      })
    })
  }

  // Bookmark toggle
  const bookmarkBtn = document.getElementById('bookmark-toggle')
  if (bookmarkBtn && selected) {
    bookmarkBtn.addEventListener('click', () => {
      const bookmarks = toggleBookmark(selected.id, progress.bookmarks)
      setProgress(progress.completedIds, progress.lastLessonId, undefined, bookmarks)
      progress = { ...progress, bookmarks }
      render(progress, selected)
    })
  }

  // Next lesson → navigate
  const nextLessonBtn = document.getElementById('next-lesson-btn')
  if (nextLessonBtn?.dataset.nextId) {
    nextLessonBtn.addEventListener('click', () => navigateToLesson(nextLessonBtn.dataset.nextId))
  }

  // Related lessons → navigate
  app.querySelectorAll('[data-lesson-id]').forEach((el) => {
    const id = el.dataset.lessonId
    if (id) el.addEventListener('click', (e) => { e.preventDefault(); navigateToLesson(id) })
  })

  // Playground: mount after layout (so container has size), Run → set iframe + persist, resize handles, console, Copy, Load starter
  const runBtn = document.getElementById('playground-run')
  const editorContainer = document.getElementById('playground-editor')
  const editorResizeHandle = document.getElementById('playground-editor-resize-handle')
  const frameEl = document.getElementById('playground-frame')
  const resizeHandle = document.getElementById('playground-resize-handle')
  const outputEmpty = document.getElementById('playground-output-empty')
  const outputError = document.getElementById('playground-output-error')
  const consoleEl = document.getElementById('playground-console')
  if (runBtn && editorContainer && frameEl) {
    const initialCode = getPlaygroundCode()
    const editorHeight = getPlaygroundEditorHeight()
    editorContainer.style.height = `${editorHeight}px`
    const frameHeight = getPlaygroundFrameHeight()
    frameEl.style.height = `${frameHeight}px`

    const doRun = () => {
      const code = playgroundEditorRef?.getValue() ?? ''
      outputError?.classList.add('hidden')
      if (consoleEl) {
        consoleEl.innerHTML = ''
        consoleEl.appendChild(document.createTextNode('Console (from preview)'))
      }
      try {
        frameEl.srcdoc = injectPlaygroundConsoleCapture(code)
        setPlaygroundCode(code)
        outputEmpty?.classList.add('hidden')
      } catch (e) {
        if (outputError) {
          outputError.textContent = 'Could not run code.'
          outputError.classList.remove('hidden')
        }
      }
    }
    runBtn.addEventListener('click', doRun)

    if (playgroundConsoleHandler) {
      window.removeEventListener('message', playgroundConsoleHandler)
      playgroundConsoleHandler = null
    }
    playgroundConsoleHandler = (e) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'playground-console') return
      const el = document.getElementById('playground-console')
      if (!el) return
      const method = e.data.method || 'log'
      const args = Array.isArray(e.data.args) ? e.data.args.join(' ') : String(e.data.args)
      const line = document.createElement('div')
      line.className = method === 'error' ? 'text-red-400' : method === 'warn' ? 'text-amber-400' : ''
      line.textContent = `[${method}] ${args}`
      if (el.firstChild?.textContent === 'Console (from preview)') el.innerHTML = ''
      el.appendChild(line)
      el.scrollTop = el.scrollHeight
    }
    window.addEventListener('message', playgroundConsoleHandler)

    document.getElementById('playground-load-starter')?.addEventListener('click', () => {
      if (!selected?.id || !PLAYGROUND_STARTERS[selected.id]) return
      const starter = PLAYGROUND_STARTERS[selected.id]
      playgroundEditorRef?.setValue?.(starter)
      setPlaygroundCode(starter)
    })
    document.getElementById('playground-copy-code')?.addEventListener('click', () => {
      const code = playgroundEditorRef?.getValue() ?? ''
      navigator.clipboard.writeText(code).catch(() => {})
    })
    document.getElementById('playground-copy-gist')?.addEventListener('click', () => {
      const code = playgroundEditorRef?.getValue() ?? ''
      navigator.clipboard.writeText(code).then(() => {
        window.open('https://gist.github.com/', '_blank', 'noopener,noreferrer')
      }).catch(() => {})
    })
    if (editorResizeHandle) {
      editorResizeHandle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return
        e.preventDefault()
        const startY = e.clientY
        const startHeight = editorContainer.getBoundingClientRect().height
        const bodyCursor = document.body.style.cursor
        const bodySelect = document.body.style.userSelect
        document.body.style.cursor = 'ns-resize'
        document.body.style.userSelect = 'none'
        let rafId = null
        let pendingH = null
        const apply = () => {
          rafId = null
          if (pendingH != null) {
            editorContainer.style.height = `${pendingH}px`
            playgroundEditorRef?.resize?.()
            pendingH = null
          }
        }
        const onMove = (e2) => {
          const dy = e2.clientY - startY
          let h = Math.round(startHeight + dy)
          h = Math.max(PLAYGROUND_EDITOR_HEIGHT_MIN, Math.min(PLAYGROUND_EDITOR_HEIGHT_MAX, h))
          pendingH = h
          if (rafId == null) rafId = requestAnimationFrame(apply)
        }
        const onUp = () => {
          document.removeEventListener('mousemove', onMove)
          document.removeEventListener('mouseup', onUp)
          document.body.style.cursor = bodyCursor
          document.body.style.userSelect = bodySelect
          if (rafId != null) cancelAnimationFrame(rafId)
          apply()
          setPlaygroundEditorHeight(editorContainer.getBoundingClientRect().height)
          playgroundEditorRef?.resize?.()
        }
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
      })
    }
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return
        e.preventDefault()
        const startY = e.clientY
        const startHeight = frameEl.getBoundingClientRect().height
        const bodyCursor = document.body.style.cursor
        const bodySelect = document.body.style.userSelect
        document.body.style.cursor = 'ns-resize'
        document.body.style.userSelect = 'none'
        let rafId = null
        let pendingH = null
        const apply = () => {
          rafId = null
          if (pendingH != null) {
            frameEl.style.height = `${pendingH}px`
            pendingH = null
          }
        }
        const onMove = (e2) => {
          const dy = e2.clientY - startY
          let h = Math.round(startHeight + dy)
          h = Math.max(PLAYGROUND_FRAME_HEIGHT_MIN, Math.min(PLAYGROUND_FRAME_HEIGHT_MAX, h))
          pendingH = h
          if (rafId == null) rafId = requestAnimationFrame(apply)
        }
        const onUp = () => {
          document.removeEventListener('mousemove', onMove)
          document.removeEventListener('mouseup', onUp)
          document.body.style.cursor = bodyCursor
          document.body.style.userSelect = bodySelect
          if (rafId != null) cancelAnimationFrame(rafId)
          apply()
          setPlaygroundFrameHeight(frameEl.getBoundingClientRect().height)
        }
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
      })
    }
    try {
      playgroundEditorRef = mountPlaygroundEditor(editorContainer, initialCode, { onRun: doRun })
    } catch {
      const textarea = document.createElement('textarea')
      textarea.id = 'playground-code-fallback'
      textarea.className = 'w-full min-h-[10rem] font-mono text-sm p-3 border border-gray-200 rounded resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
      textarea.spellcheck = false
      textarea.value = initialCode
      editorContainer.appendChild(textarea)
      playgroundEditorRef = {
        getValue: () => textarea.value,
        setValue: (v) => { textarea.value = typeof v === 'string' ? v : '' },
        destroy: () => textarea.remove(),
        resize: () => {},
      }
    }
  }

  // Quiz: validation, submit → score + per-question feedback, Try again
  const quizForm = document.getElementById('quiz-form')
  const quizResult = document.getElementById('quiz-result')
  const quizTryAgain = document.getElementById('quiz-try-again')
  if (quizForm && quizResult && selected && QUIZZES[selected.id]) {
    const quiz = QUIZZES[selected.id]
    const total = quiz.questions.length
    const passThreshold = getQuizPassThreshold(total)

    function clearQuizFeedback() {
      quizForm.querySelectorAll('.quiz-question-feedback').forEach((el) => {
        el.classList.add('hidden')
        el.textContent = ''
      })
      quizForm.querySelectorAll('.quiz-correct, .quiz-wrong').forEach((label) => {
        label.classList.remove('quiz-correct', 'quiz-wrong', 'bg-green-50', 'dark:bg-green-900/20', 'bg-red-50', 'dark:bg-red-900/20')
        const icon = label.querySelector('.quiz-feedback-icon')
        if (icon) icon.remove()
      })
      quizResult.textContent = ''
      quizResult.className = 'text-sm text-gray-600 dark:text-gray-400'
      quizTryAgain?.classList.add('hidden')
    }

    quizTryAgain?.addEventListener('click', () => {
      quizForm.querySelectorAll('input[type="radio"]').forEach((input) => { input.checked = false })
      clearQuizFeedback()
    })

    quizForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const firstUnanswered = quiz.questions.findIndex((_, i) => !quizForm.querySelector(`input[name="q${i}"]:checked`))
      if (firstUnanswered !== -1) {
        clearQuizFeedback()
        quizResult.textContent = 'Answer all questions'
        quizResult.className = 'text-sm text-amber-600 dark:text-amber-400'
        const questionEl = quizForm.querySelector(`.quiz-question[data-question-index="${firstUnanswered}"]`)
        const firstRadio = questionEl?.querySelector('input[type="radio"]')
        firstRadio?.focus()
        questionEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }

      let correct = 0
      quiz.questions.forEach((qu, i) => {
        const input = quizForm.querySelector(`input[name="q${i}"]:checked`)
        const value = input ? Number(input.value) : -1
        if (value === qu.correctIndex) correct++
        const feedbackEl = quizForm.querySelector(`.quiz-question-feedback[data-question-index="${i}"]`)
        const isCorrect = value === qu.correctIndex
        if (feedbackEl) {
          feedbackEl.classList.remove('hidden')
          if (isCorrect) {
            feedbackEl.textContent = 'Correct'
            feedbackEl.className = 'quiz-question-feedback mt-1 text-sm text-green-600 dark:text-green-400'
          } else {
            const correctText = qu.options[qu.correctIndex]
            feedbackEl.textContent = `Wrong. Correct answer: ${correctText}`
            feedbackEl.className = 'quiz-question-feedback mt-1 text-sm text-red-600 dark:text-red-400'
          }
        }
        const label = input?.closest('.quiz-option-label')
        if (label) {
          label.querySelector('.quiz-feedback-icon')?.remove()
          label.classList.add(isCorrect ? 'quiz-correct' : 'quiz-wrong', isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20')
          const icon = document.createElement('span')
          icon.className = 'quiz-feedback-icon ml-1'
          icon.innerHTML = isCorrect ? checkSvg : crossSvg
          icon.setAttribute('aria-hidden', 'true')
          label.appendChild(icon)
        }
      })

      const wrong = total - correct
      const passed = correct >= passThreshold
      const detail = wrong === 0 ? `${correct} correct` : `${correct} correct, ${wrong} wrong`
      quizResult.textContent = `Score: ${correct}/${total}${passed ? ' — Passed!' : ''} • ${detail}`
      quizResult.className = `text-sm ${passed ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`
      if (passed) {
        quizTryAgain?.classList.add('hidden')
        const newQuizPassed = { ...progress.quizPassed, [selected.id]: true }
        setProgress(progress.completedIds, progress.lastLessonId, newQuizPassed, undefined)
        progress = { ...progress, quizPassed: newQuizPassed }
        render(progress, selected)
      } else {
        quizTryAgain?.classList.remove('hidden')
        const needMore = passThreshold - correct
        const hint = needMore === 1 ? '1 more correct answer to pass.' : `${needMore} more correct answers to pass.`
        quizResult.textContent = `Score: ${correct}/${total} • ${detail} — ${hint}`
      }
    })
  }
}

let searchQuery = ''
let progress = getProgress()
let selected = null
const urlLessonId = getLessonIdFromUrl()
if (urlLessonId) {
  const item = getAllCourseItems().find((i) => i.id === urlLessonId)
  if (item) selected = item
}
if (!selected && progress.lastLessonId) {
  for (const section of [COURSE.core, COURSE.help, COURSE.ready, COURSE.other]) {
    const item = section.items.find((i) => i.id === progress.lastLessonId)
    if (item) {
      selected = item
      break
    }
  }
}
if (selected) updateUrlForLesson(selected.id)

if ('serviceWorker' in navigator) {
  const base = typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL : '/'
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(base + 'sw.js').catch(() => {})
  })
}

applyTheme(getTheme())
applyFontSize()
render(progress, selected)

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredInstallPrompt = e
  render(progress, selected)
})

// Keyboard shortcuts: j/k or ↑/↓ next/prev lesson, Enter open focused lesson, Esc clear search / close sidebar, / focus search
document.addEventListener('keydown', (e) => {
  const inInput = e.target?.closest?.('input, textarea, select') || e.target?.closest?.('#playground-editor')
  if (inInput) {
    if (e.key === 'Escape') {
      e.target.blur?.()
      searchQuery = ''
      const searchEl = document.getElementById('search-input')
      if (searchEl) searchEl.value = ''
      document.getElementById('sidebar')?.classList.add('-translate-x-full')
      render(progress, selected)
      return
    }
    if (e.key === '/') return
    return
  }
  switch (e.key) {
    case 'j':
    case 'ArrowDown':
      e.preventDefault()
      const next = getNextCoreLesson(selected)
      if (next) navigateToLesson(next.id)
      break
    case 'k':
    case 'ArrowUp':
      e.preventDefault()
      const prev = getPrevCoreLesson(selected)
      if (prev) navigateToLesson(prev.id)
      break
    case 'Enter':
      if (document.activeElement?.closest?.('.lesson-btn')) document.activeElement.click()
      break
    case 'Escape':
      searchQuery = ''
      const searchInput = document.getElementById('search-input')
      if (searchInput) searchInput.value = ''
      document.getElementById('sidebar')?.classList.add('-translate-x-full')
      render(progress, selected)
      break
    case '/':
      e.preventDefault()
      document.getElementById('search-input')?.focus()
      break
    case 'f':
    case 'F':
      if (!e.target?.closest?.('input, textarea, select')) {
        e.preventDefault()
        setFocusMode(!getFocusMode())
        render(progress, selected)
      }
      break
  }
})

window.addEventListener('popstate', () => {
  const id = getLessonIdFromUrl()
  if (!id) return
  const item = getAllCourseItems().find((i) => i.id === id)
  if (item) {
    selected = item
    render(progress, selected)
  }
})
