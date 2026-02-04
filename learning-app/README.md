# Learning Web Tool

Interactive learning web app for the 2017 Educator Lessons — lesson navigator, run demos, code playground, quizzes (phased).

## Stack

- **Vite** — dev server and build
- **Vanilla JS** — no framework (can add React/Vue later)
- **Tailwind CSS v4** — styling via `@tailwindcss/vite`

## Setup

```bash
cd learning-app
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

- `npm run dev` — start dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally

## Features

### Phase 2
- **Lesson navigator** — Sidebar with Core lessons (01–38), Help & reference, Ready works, Other. Click to open lesson view.
- **Lesson view** — Title, topics, “Open folder”, “Run demo”, “Lesson ROADMAP” links (open in new tab).
- **Progress** — Last viewed lesson and completed state stored in `localStorage`; checkmark toggles “completed”.
- **Responsive** — Sidebar collapses on mobile; hamburger opens/closes.

### Phase 3
- **Code playground** — HTML/JS editor (textarea) with “Run” button; output runs in a sandboxed iframe (`srcdoc`). Default starter includes a small script; edit and run.
- **Quizzes** — Multiple-choice quizzes for lessons **01**, **04**, and **15** (3 questions each). Submit shows score; passing (≥2/3) is saved in `localStorage` and shows a “Passed” badge.

## Open / Run demo links

Links point to the parent repo (`../01_GiveLesson`, etc.). For them to work in the browser, serve the **repo root** (e.g. `npx serve .` from repo root and open `/learning-app/`, or deploy the whole repo to GitHub Pages).

## Roadmap (next)

1. **Phase 4:** Search, bookmarks, optional PWA. More quizzes for other lessons.
