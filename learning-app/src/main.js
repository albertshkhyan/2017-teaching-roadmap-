import './style.css'
import { COURSE, LESSONS_BASE } from './data/course.js'
import { QUIZZES, PLAYGROUND_STARTER } from './data/quizzes.js'
import { mountPlaygroundEditor } from './playground-editor.js'
import { chevronRightSvg, searchSvg, xSvg, sunSvg, moonSvg, circleSvg, checkCircleSvg, clockSvg, gripHorizontalSvg, checkSvg, crossSvg } from './icons.js'
import { animate } from 'motion'

const STORAGE_KEY = 'learning-app-progress'
const PLAYGROUND_STORAGE_KEY = 'learning-app-playground-code'
const PLAYGROUND_FRAME_HEIGHT_KEY = 'learning-app-playground-frame-height'
const SIDEBAR_COLLAPSED_KEY = 'learning-app-sidebar-collapsed'
const THEME_KEY = 'learning-app-theme'

const PLAYGROUND_FRAME_HEIGHT_MIN = 128
const PLAYGROUND_FRAME_HEIGHT_MAX = 600
const PLAYGROUND_FRAME_HEIGHT_DEFAULT = 256
const PLAYGROUND_EDITOR_HEIGHT_KEY = 'learning-app-playground-editor-height'
const PLAYGROUND_EDITOR_HEIGHT_MIN = 120
const PLAYGROUND_EDITOR_HEIGHT_MAX = 500
const PLAYGROUND_EDITOR_HEIGHT_DEFAULT = 160

/** Ace playground instance; destroyed before re-render. */
let playgroundEditorRef = null

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
    if (!raw) return { completedIds: [], lastLessonId: null, quizPassed: {}, bookmarks: [] }
    const data = JSON.parse(raw)
    return {
      completedIds: Array.isArray(data.completedIds) ? data.completedIds : [],
      lastLessonId: data.lastLessonId ?? null,
      quizPassed: data.quizPassed && typeof data.quizPassed === 'object' ? data.quizPassed : {},
      bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
    }
  } catch {
    return { completedIds: [], lastLessonId: null, quizPassed: {}, bookmarks: [] }
  }
}

function setProgress(completedIds, lastLessonId, quizPassed, bookmarks) {
  const current = getProgress()
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completedIds: completedIds ?? current.completedIds,
    lastLessonId: lastLessonId ?? current.lastLessonId,
    quizPassed: quizPassed ?? current.quizPassed,
    bookmarks: bookmarks ?? current.bookmarks,
  }))
}

function getAllCourseItems() {
  const out = []
  for (const section of [COURSE.core, COURSE.help, COURSE.ready, COURSE.other]) {
    for (const item of section.items) out.push(item)
  }
  return out
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
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different term or number.</p>
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
        const numberBadge = isCore ? `<span class="flex-shrink-0 w-6 text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">${escapeHtml(item.id)}</span>` : ''
        html += `<li>
          <button type="button" data-id="${escapeHtml(item.id)}" data-path="${escapeHtml(item.path)}" data-topics="${escapeHtml(item.topics)}" data-title="${escapeHtml(item.title)}"
            class="${LESSON_BTN_BASE} ${active ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 border-l-2 border-indigo-600 dark:border-indigo-500' : ''} ${done ? 'opacity-90' : ''}">
            <span class="complete-check w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${done ? 'bg-green-500 text-white' : 'text-gray-400 dark:text-gray-500'}" data-id="${escapeHtml(item.id)}" title="${done ? 'Mark incomplete' : 'Mark complete'}">${done ? checkCircleSvg : circleSvg}</span>
            ${numberBadge}
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
        <div class="flex gap-2 mt-3">
          <button type="button" id="playground-run" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Run</button>
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
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">${escapeHtml(selected.title)}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">${escapeHtml(selected.topics)}</p>
        </div>
        <span id="lesson-status-badge" class="lesson-status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm ${done ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}">${done ? checkCircleSvg + ' Completed' : clockSvg + ' In progress'}</span>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
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
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Links open the lesson folder or first file in a new tab. When using <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-gray-900 dark:text-gray-200">npm run dev</code>, the dev server serves lesson files from the repo root.</p>
      ${playgroundHtml}
      ${quizHtml}
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
  app.innerHTML = `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside id="sidebar" class="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col max-h-screen md:relative fixed inset-y-0 left-0 z-20 transform transition-transform md:transform-none -translate-x-full md:translate-x-0">
        <div class="sticky top-0 z-10 flex-shrink-0 p-4 pb-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div class="mb-3 flex items-center justify-between gap-2">
            <div class="min-w-0">
              <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">2017 Educator Lessons</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Learning tool</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button type="button" id="theme-toggle" class="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="${escapeHtml(themeToggleLabel)}" title="${escapeHtml(themeToggleLabel)}">${themeToggleIcon}</button>
              <button type="button" id="sidebar-close" class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-gray-700 dark:text-gray-300" aria-label="Close sidebar">×</button>
            </div>
          </div>
          <div class="relative flex items-center">
            <span class="search-icon-wrap absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center justify-center" aria-hidden="true">${searchSvg}</span>
            <input type="search" id="search-input" placeholder="Search lessons…" title="Search by number, title, or topic" value="${escapeHtml(searchQuery)}" class="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <button type="button" id="search-clear" class="absolute right-2 p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${searchQuery ? '' : 'hidden'}" aria-label="Clear search">${xSvg}</button>
          </div>
        </div>
        <div id="sidebar-nav" class="flex-1 min-h-0 overflow-y-auto p-4 pt-2">${renderSidebar(progress, searchQuery, sidebarCollapsed)}</div>
      </aside>
      <div class="flex-1 flex flex-col min-w-0">
        <header class="flex-shrink-0 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <button type="button" id="sidebar-open" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-gray-700 dark:text-gray-300" aria-label="Open sidebar">☰</button>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">${selected ? escapeHtml(selected.title) : 'Learning tool'}</span>
        </header>
        <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div id="lesson-view-wrap">${renderLessonView(selected, progress)}</div>
        </main>
      </div>
    </div>
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
  document.getElementById('sidebar-close')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.add('-translate-x-full')
  })
  document.getElementById('sidebar-open')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('-translate-x-full')
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
    }
    searchInput.addEventListener('input', updateSearchUi)
    searchClear?.addEventListener('click', () => {
      searchInput.value = ''
      searchQuery = ''
      if (searchClear) searchClear.classList.add('hidden')
      searchInput.focus()
      sidebarNav.innerHTML = renderSidebar(progress, '', getSidebarCollapsed())
      bindSidebarNav(sidebarNav)
    })
  }

  bindSidebarNav(sidebarNav || app)

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
    // Click lesson → show view + save last
    container.querySelectorAll('.lesson-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id
        const path = btn.dataset.path
        const topics = btn.dataset.topics
        const title = btn.dataset.title
        setProgress(progress.completedIds, id, undefined, undefined)
        progress = { ...progress, lastLessonId: id }
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

  // Playground: mount after layout (so container has size), Run → set iframe + persist, resize handles
  const runBtn = document.getElementById('playground-run')
  const editorContainer = document.getElementById('playground-editor')
  const editorResizeHandle = document.getElementById('playground-editor-resize-handle')
  const frameEl = document.getElementById('playground-frame')
  const resizeHandle = document.getElementById('playground-resize-handle')
  const outputEmpty = document.getElementById('playground-output-empty')
  const outputError = document.getElementById('playground-output-error')
  if (runBtn && editorContainer && frameEl) {
    const initialCode = getPlaygroundCode()
    const editorHeight = getPlaygroundEditorHeight()
    editorContainer.style.height = `${editorHeight}px`
    const frameHeight = getPlaygroundFrameHeight()
    frameEl.style.height = `${frameHeight}px`
    runBtn.addEventListener('click', () => {
      const code = playgroundEditorRef?.getValue() ?? ''
      outputError?.classList.add('hidden')
      try {
        frameEl.srcdoc = code
        setPlaygroundCode(code)
        outputEmpty?.classList.add('hidden')
      } catch (e) {
        if (outputError) {
          outputError.textContent = 'Could not run code.'
          outputError.classList.remove('hidden')
        }
      }
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
      playgroundEditorRef = mountPlaygroundEditor(editorContainer, initialCode)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.id = 'playground-code-fallback'
      textarea.className = 'w-full min-h-[10rem] font-mono text-sm p-3 border border-gray-200 rounded resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
      textarea.spellcheck = false
      textarea.value = initialCode
      editorContainer.appendChild(textarea)
      playgroundEditorRef = { getValue: () => textarea.value, destroy: () => textarea.remove(), resize: () => {} }
    }
  }

  // Quiz: validation, submit → score + per-question feedback, Try again
  const quizForm = document.getElementById('quiz-form')
  const quizResult = document.getElementById('quiz-result')
  const quizTryAgain = document.getElementById('quiz-try-again')
  if (quizForm && quizResult && selected && QUIZZES[selected.id]) {
    const quiz = QUIZZES[selected.id]
    const total = quiz.questions.length
    const passThreshold = Math.ceil(total * 2 / 3)

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
if (progress.lastLessonId) {
  for (const section of [COURSE.core, COURSE.help, COURSE.ready, COURSE.other]) {
    const item = section.items.find((i) => i.id === progress.lastLessonId)
    if (item) {
      selected = item
      break
    }
  }
}

if ('serviceWorker' in navigator) {
  const base = typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL : '/'
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(base + 'sw.js').catch(() => {})
  })
}

applyTheme(getTheme())
render(progress, selected)
