import './style.css'
import { COURSE, LESSONS_BASE } from './data/course.js'
import { QUIZZES, PLAYGROUND_STARTER } from './data/quizzes.js'
import { mountPlaygroundEditor } from './playground-editor.js'
import { chevronRightSvg, searchSvg, xSvg, sunSvg, moonSvg } from './icons.js'
import { animate } from 'motion'

const STORAGE_KEY = 'learning-app-progress'
const PLAYGROUND_STORAGE_KEY = 'learning-app-playground-code'
const SIDEBAR_COLLAPSED_KEY = 'learning-app-sidebar-collapsed'
const THEME_KEY = 'learning-app-theme'

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
            <span class="complete-check w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600'}" data-id="${escapeHtml(item.id)}" title="${done ? 'Mark incomplete' : 'Mark complete'}">${done ? '✓' : ''}</span>
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
      <h2 class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-200">Code playground</h2>
      <div class="p-4">
        <div id="playground-editor" class="w-full min-h-[10rem] border border-gray-200 dark:border-gray-600 rounded overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500"></div>
        <div class="flex gap-2 mt-2">
          <button type="button" id="playground-run" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Run</button>
        </div>
        <iframe id="playground-frame" title="Playground output" class="mt-3 w-full h-48 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900" sandbox="allow-scripts"></iframe>
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
            <div>
              <p class="font-medium text-gray-800 dark:text-gray-200 mb-2">${i + 1}. ${escapeHtml(qu.q)}</p>
              <div class="space-y-1 pl-2">
                ${qu.options.map((opt, j) => `
                  <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                    <input type="radio" name="q${i}" value="${j}" class="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                    <span>${escapeHtml(opt)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
          <div class="flex items-center gap-3">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Submit</button>
            <span id="quiz-result" class="text-sm text-gray-600 dark:text-gray-400"></span>
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
        <span class="px-2 py-1 rounded text-sm ${done ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}">${done ? 'Completed' : 'In progress'}</span>
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

  // Playground: mount after layout (so container has size), Run → set iframe + persist
  const runBtn = document.getElementById('playground-run')
  const editorContainer = document.getElementById('playground-editor')
  const frameEl = document.getElementById('playground-frame')
  if (runBtn && editorContainer && frameEl) {
    const initialCode = getPlaygroundCode()
    runBtn.addEventListener('click', () => {
      const code = playgroundEditorRef?.getValue() ?? ''
      frameEl.srcdoc = code
      setPlaygroundCode(code)
    })
    try {
      playgroundEditorRef = mountPlaygroundEditor(editorContainer, initialCode)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.id = 'playground-code-fallback'
      textarea.className = 'w-full min-h-[10rem] font-mono text-sm p-3 border border-gray-200 rounded resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
      textarea.spellcheck = false
      textarea.value = initialCode
      editorContainer.appendChild(textarea)
      playgroundEditorRef = { getValue: () => textarea.value, destroy: () => textarea.remove() }
    }
  }

  // Quiz: Submit → score, show result, save passed if score >= 2/3
  const quizForm = document.getElementById('quiz-form')
  const quizResult = document.getElementById('quiz-result')
  if (quizForm && quizResult && selected && QUIZZES[selected.id]) {
    const quiz = QUIZZES[selected.id]
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault()
      let correct = 0
      quiz.questions.forEach((qu, i) => {
        const input = quizForm.querySelector(`input[name="q${i}"]:checked`)
        if (input && Number(input.value) === qu.correctIndex) correct++
      })
      const total = quiz.questions.length
      const passed = correct >= Math.ceil(total * 2 / 3)
      quizResult.textContent = `Score: ${correct}/${total}${passed ? ' — Passed!' : ''}`
      quizResult.className = `text-sm ${passed ? 'text-green-600 font-medium' : 'text-gray-600'}`
      if (passed) {
        const newQuizPassed = { ...progress.quizPassed, [selected.id]: true }
        setProgress(progress.completedIds, progress.lastLessonId, newQuizPassed, undefined)
        progress = { ...progress, quizPassed: newQuizPassed }
        render(progress, selected)
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
