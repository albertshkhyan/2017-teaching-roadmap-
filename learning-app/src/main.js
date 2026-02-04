import './style.css'
import { COURSE, LESSONS_BASE } from './data/course.js'
import { QUIZZES, PLAYGROUND_STARTER } from './data/quizzes.js'

const STORAGE_KEY = 'learning-app-progress'

function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completedIds: [], lastLessonId: null, quizPassed: {} }
    const data = JSON.parse(raw)
    return {
      completedIds: Array.isArray(data.completedIds) ? data.completedIds : [],
      lastLessonId: data.lastLessonId ?? null,
      quizPassed: data.quizPassed && typeof data.quizPassed === 'object' ? data.quizPassed : {},
    }
  } catch {
    return { completedIds: [], lastLessonId: null, quizPassed: {} }
  }
}

function setProgress(completedIds, lastLessonId, quizPassed) {
  const current = getProgress()
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    completedIds: completedIds ?? current.completedIds,
    lastLessonId: lastLessonId ?? current.lastLessonId,
    quizPassed: quizPassed ?? current.quizPassed,
  }))
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

function renderSidebar(progress, onSelect, onToggleComplete) {
  const sections = [
    { key: 'core', data: COURSE.core },
    { key: 'help', data: COURSE.help },
    { key: 'ready', data: COURSE.ready },
    { key: 'other', data: COURSE.other },
  ]
  let html = '<nav class="flex flex-col gap-4 overflow-y-auto">'
  for (const { key, data } of sections) {
    html += `<div><h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">${escapeHtml(data.title)}</h2><ul class="space-y-0.5">`
    for (const item of data.items) {
      const done = progress.completedIds.includes(item.id)
      const active = progress.lastLessonId === item.id
      html += `<li>
        <button type="button" data-id="${escapeHtml(item.id)}" data-path="${escapeHtml(item.path)}" data-topics="${escapeHtml(item.topics)}" data-title="${escapeHtml(item.title)}"
          class="lesson-btn w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700 hover:bg-gray-100'}">
          <span class="complete-check w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}" data-id="${escapeHtml(item.id)}" title="${done ? 'Mark incomplete' : 'Mark complete'}">${done ? '✓' : ''}</span>
          <span class="truncate">${escapeHtml(item.title)}</span>
        </button>
      </li>`
    }
    html += '</ul></div>'
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
      <div class="flex flex-col items-center justify-center h-full text-gray-500 p-8">
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
    <section class="mt-8 border border-gray-200 rounded-lg overflow-hidden bg-white">
      <h2 class="px-4 py-2 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">Code playground</h2>
      <div class="p-4">
        <textarea id="playground-code" class="w-full h-40 font-mono text-sm p-3 border border-gray-200 rounded resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" spellcheck="false">${escapeHtml(PLAYGROUND_STARTER)}</textarea>
        <div class="flex gap-2 mt-2">
          <button type="button" id="playground-run" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Run</button>
        </div>
        <iframe id="playground-frame" title="Playground output" class="mt-3 w-full h-48 border border-gray-200 rounded bg-white" sandbox="allow-scripts"></iframe>
      </div>
    </section>
  `

  let quizHtml = ''
  if (quiz) {
    const passedBadge = quizPassed ? '<span class="ml-2 px-2 py-0.5 rounded text-sm bg-green-100 text-green-800">Passed</span>' : ''
    quizHtml = `
      <section class="mt-8 border border-gray-200 rounded-lg overflow-hidden bg-white">
        <h2 class="px-4 py-2 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">Quiz ${passedBadge}</h2>
        <form id="quiz-form" class="p-4 space-y-4">
          ${quiz.questions.map((qu, i) => `
            <div>
              <p class="font-medium text-gray-800 mb-2">${i + 1}. ${escapeHtml(qu.q)}</p>
              <div class="space-y-1 pl-2">
                ${qu.options.map((opt, j) => `
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="q${i}" value="${j}" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>${escapeHtml(opt)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
          <div class="flex items-center gap-3">
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">Submit</button>
            <span id="quiz-result" class="text-sm text-gray-600"></span>
          </div>
        </form>
      </section>
    `
  }

  return `
    <div class="p-6 max-w-3xl">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">${escapeHtml(selected.title)}</h1>
          <p class="text-gray-600 mt-1">${escapeHtml(selected.topics)}</p>
        </div>
        <span class="px-2 py-1 rounded text-sm ${done ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}">${done ? 'Completed' : 'In progress'}</span>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Open folder
        </a>
        <a href="${escapeHtml(url + '/')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Run demo
        </a>
        <a href="${escapeHtml(url + '/ROADMAP.md')}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
          Lesson ROADMAP
        </a>
      </div>
      <p class="text-sm text-gray-500 mt-4">Links open the lesson folder or first file in a new tab. For Run demo to work, serve the repo from its root (e.g. GitHub Pages or <code class="bg-gray-100 px-1 rounded">npx serve .</code>).</p>
      ${playgroundHtml}
      ${quizHtml}
    </div>
  `
}

function render(progress, selected) {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="flex h-screen bg-gray-50">
      <aside id="sidebar" class="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col p-4 max-h-screen md:relative fixed inset-y-0 left-0 z-20 transform transition-transform md:transform-none -translate-x-full md:translate-x-0">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h1 class="text-lg font-bold text-gray-900">2017 Educator Lessons</h1>
            <p class="text-xs text-gray-500">Learning tool</p>
          </div>
          <button type="button" id="sidebar-close" class="md:hidden p-2 rounded hover:bg-gray-100" aria-label="Close menu">×</button>
        </div>
        ${renderSidebar(progress, null, null)}
      </aside>
      <div class="flex-1 flex flex-col min-w-0">
        <header class="flex-shrink-0 flex items-center gap-2 p-2 bg-white border-b border-gray-200 md:hidden">
          <button type="button" id="sidebar-open" class="p-2 rounded hover:bg-gray-100" aria-label="Open menu">☰</button>
          <span class="text-sm font-medium text-gray-700 truncate">${selected ? escapeHtml(selected.title) : 'Learning tool'}</span>
        </header>
        <main class="flex-1 overflow-y-auto">
          ${renderLessonView(selected, progress)}
        </main>
      </div>
    </div>
  `

  document.getElementById('sidebar-close')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.add('-translate-x-full')
  })
  document.getElementById('sidebar-open')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('-translate-x-full')
  })

  // Click lesson → show view + save last
  app.querySelectorAll('.lesson-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const path = btn.dataset.path
      const topics = btn.dataset.topics
      const title = btn.dataset.title
      setProgress(progress.completedIds, id)
      progress = { ...progress, lastLessonId: id }
      selected = { id, path, topics, title }
      document.getElementById('sidebar')?.classList.add('-translate-x-full')
      render(progress, selected)
    })
  })

  // Click complete check → toggle (stop propagation so lesson-btn doesn't fire)
  app.querySelectorAll('.complete-check').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      const id = el.dataset.id
      const completedIds = toggleCompleted(id, progress.completedIds)
      setProgress(completedIds, progress.lastLessonId, undefined)
      progress = { ...progress, completedIds }
      render(progress, selected)
    })
  })

  // Playground: Run → set iframe srcdoc
  const runBtn = document.getElementById('playground-run')
  const codeEl = document.getElementById('playground-code')
  const frameEl = document.getElementById('playground-frame')
  if (runBtn && codeEl && frameEl) {
    runBtn.addEventListener('click', () => {
      frameEl.srcdoc = codeEl.value || ''
    })
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
        setProgress(progress.completedIds, progress.lastLessonId, newQuizPassed)
        progress = { ...progress, quizPassed: newQuizPassed }
        render(progress, selected)
      }
    })
  }
}

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
render(progress, selected)
