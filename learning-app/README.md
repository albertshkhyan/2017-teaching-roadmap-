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

## Roadmap (phases)

1. **Phase 2:** Lesson navigator (mirror ROADMAP 01–38, Help, Ready works), lesson view, “Run demo” for existing HTML, progress (localStorage).
2. **Phase 3:** Code playground, quizzes per lesson.
3. **Phase 4:** Search, bookmarks, optional PWA.

Content and demos link to the parent repo (`../01_GiveLesson`, `../ReadyWorksByJS`, etc.).
