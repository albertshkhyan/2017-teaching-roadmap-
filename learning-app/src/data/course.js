/**
 * Course structure mirroring ROADMAP.md — Core lessons (01–38), Help, Ready works, Other.
 * Paths are relative to repo root (learning-app uses base URL to resolve).
 */
export const LESSONS_BASE = typeof import.meta.env?.BASE_URL === 'string'
  ? import.meta.env.BASE_URL.replace(/\/$/, '') + '/..'
  : '..'

export const COURSE = {
  core: {
    title: 'Core lessons (01–38)',
    items: [
      { id: '01', title: '01_GiveLesson', path: '01_GiveLesson', topics: 'Intro, basics' },
      { id: '02', title: '02_GiveLesson', path: '02_GiveLesson', topics: 'Logic operators, variables', prereqs: ['01'] },
      { id: '03', title: '03_GiveLesson', path: '03_GiveLesson', topics: 'Conditions, switch, loops, while, tasks', prereqs: ['02'] },
      { id: '04', title: '04_GiveLesson', path: '04_GiveLesson', topics: 'Loops, String methods, Number/Math, tasks 201–210', prereqs: ['03'] },
      { id: '05', title: '05_GiveLesson', path: '05_GiveLesson', topics: 'Arrays, array methods', prereqs: ['04'] },
      { id: '06', title: '06_GiveLesson', path: '06_GiveLesson', topics: 'Arrays intro, summary, homework, table, Math/fibonacci', prereqs: ['05'] },
      { id: '07', title: '07_GiveLesson', path: '07_GiveLesson', topics: 'Array methods, simple/complicated tasks, homework', prereqs: ['06'] },
      { id: '08', title: '08_GiveLesson', path: '08_GiveLesson', topics: 'defer/async, Math tasks, sort', prereqs: ['07'] },
      { id: '09', title: '09_GiveLesson', path: '09_GiveLesson', topics: 'Array methods Part 2, functions intro, associative arrays', prereqs: ['08'] },
      { id: '10', title: '10_GiveLesson', path: '10_GiveLesson', topics: 'Functions, gradient, loops, homework', prereqs: ['09'] },
      { id: '11', title: '11_GiveLesson', path: '11_GiveLesson', topics: 'Functions, homework', prereqs: ['10'] },
      { id: '12', title: '12_GiveLesson', path: '12_GiveLesson', topics: 'Functions, use strict', prereqs: ['11'] },
      { id: '13', title: '13_GiveLesson', path: '13_GiveLesson', topics: 'Recursion, scope', prereqs: ['12'] },
      { id: '14', title: '14_GiveLesson', path: '14_GiveLesson', topics: 'Objects (associative), homework', prereqs: ['13'] },
      { id: '15', title: '15_GiveLesson', path: '15_GiveLesson', topics: 'Callbacks, forEach, reduce', prereqs: ['14'] },
      { id: '16', title: '16_GiveLesson', path: '16_GiveLesson', topics: 'Primitive vs reference, timers', prereqs: ['15'] },
      { id: '17', title: '17_GiveLesson', path: '17_GiveLesson', topics: 'ES6 primitives, timers', prereqs: ['16'] },
      { id: '18', title: '18_GiveLesson', path: '18_GiveLesson', topics: 'Errors, try/catch, ES6 spread/rest, timers', prereqs: ['17'] },
      { id: '19', title: '19_GiveLesson_start_DOM', path: '19_GiveLesson_start_DOM', topics: 'DOM intro, childNode/children, Error object', prereqs: ['18'] },
      { id: '20', title: '20_GiveLesson', path: '20_GiveLesson', topics: 'DOM', prereqs: ['19'] },
      { id: '21', title: '21_GiveLesson', path: '21_GiveLesson', topics: 'DOM', prereqs: ['20'] },
      { id: '22', title: '22_GiveLesson', path: '22_GiveLesson', topics: 'Cloning, innerHTML, events, sliders, target/currentTarget', prereqs: ['21'] },
      { id: '23', title: '23_GiveLesson', path: '23_GiveLesson', topics: 'DOM, events', prereqs: ['22'] },
      { id: '24', title: '24_GiveLesson', path: '24_GiveLesson', topics: 'DOM, events', prereqs: ['23'] },
      { id: '25', title: '25_GiveLesson', path: '25_GiveLesson', topics: 'DOM', prereqs: ['24'] },
      { id: '26', title: '26_GiveLesson_start_OOP', path: '26_GiveLesson_start_OOP', topics: 'BOM, OOP intro, this, Date, digital clock', prereqs: ['25'] },
      { id: '27', title: '27_GiveLesson', path: '27_GiveLesson', topics: 'OOP this, call/apply/bind', prereqs: ['26'] },
      { id: '28', title: '28_GiveLesson', path: '28_GiveLesson', topics: 'Constructors, encapsulation, prototype', prereqs: ['27'] },
      { id: '29', title: '29_GiveLesson', path: '29_GiveLesson', topics: 'Getter/setter, __proto__, prototype', prereqs: ['28'] },
      { id: '30', title: '30_GiveLesson', path: '30_GiveLesson', topics: 'ES6 class, inheritance, Object.create', prereqs: ['29'] },
      { id: '31', title: '31_GiveLesson', path: '31_GiveLesson', topics: 'Arrow functions, ES6 class get/set/static', prereqs: ['30'] },
      { id: '32', title: '32_GiveLesson_end_OOP', path: '32_GiveLesson_end_OOP', topics: 'OOP conclusion', prereqs: ['31'] },
      { id: '33', title: '33_GiveLesson_ES6', path: '33_GiveLesson_ES6', topics: 'ES6', prereqs: ['32'] },
      { id: '34', title: '34_GiveLesson', path: '34_GiveLesson', topics: 'Set, collections, problem-solving', prereqs: ['33'] },
      { id: '35', title: '35_GiveLesson', path: '35_GiveLesson', topics: 'Iterators, generators', prereqs: ['34'] },
      { id: '36', title: '36_GiveLesson', path: '36_GiveLesson', topics: 'insertAdjacentHTML, Event Loop, Promise', prereqs: ['35'] },
      { id: '37', title: '37_GiveLesson', path: '37_GiveLesson', topics: 'Async evolution, CallBack Hell, Fetch, async/await', prereqs: ['36'] },
      { id: '38', title: '38_GiveLesson', path: '38_GiveLesson', topics: 'Summary', prereqs: ['37'] },
    ],
  },
  help: {
    title: 'Help & reference',
    items: [
      { id: 'help-bom', title: 'BOM', path: 'About_My_Lessons_HELP_FILES/BOM', topics: 'Browser Object Model' },
      { id: 'help-dom', title: 'DOM', path: 'About_My_Lessons_HELP_FILES/DOM', topics: 'DOM (27 HTML files)' },
      { id: 'help-oop', title: 'OOP', path: 'About_My_Lessons_HELP_FILES/OOP', topics: 'OOP (18 HTML + images)' },
      { id: 'help-es6', title: 'EcmaScript6 (2015)', path: 'About_My_Lessons_HELP_FILES/EcmaScript6 (2015)', topics: 'ES6' },
      { id: 'help-deep', title: 'Deep_JavaScript_under_the_hood', path: 'About_My_Lessons_HELP_FILES/Deep_JavaScript_under_the_hood', topics: 'JS internals' },
      { id: 'help-js-qyachal', title: 'JS_qyachal', path: 'About_My_Lessons_HELP_FILES/JS_qyachal', topics: 'JS exercises (js 1–18)' },
      { id: 'help-difficult', title: 'Difficult_Tasks_by_js.html', path: 'About_My_Lessons_HELP_FILES/Difficult_Tasks_by_js.html', topics: 'Hard tasks (stars, loto, etc.)' },
      { id: 'help-regexp', title: 'RegExp', path: 'About_My_Lessons_HELP_FILES/RegExp', topics: 'Regular expressions' },
      { id: 'help-simple', title: 'Simple_task_by_JS', path: 'About_My_Lessons_HELP_FILES/Simple_task_by_JS', topics: 'Simple JS tasks' },
      { id: 'help-theme', title: 'ImporatanTheme', path: 'About_My_Lessons_HELP_FILES/ImporatanTheme', topics: 'Spread/rest and related' },
    ],
  },
  ready: {
    title: 'Ready works & mini projects',
    items: [
      { id: 'ready-works', title: 'ReadyWorksByJS', path: 'ReadyWorksByJS', topics: 'Clocks, tables, sliders, carousels, calculator, spinner, drag, vote/register, puzzle, etc.' },
      { id: 'ready-cool', title: 'Cool_mini_projects_by_js', path: 'Cool_mini_projects_by_js', topics: 'Sliders, puzzle stages, zoom, loto, search, input/interval tables, RGB/div demos' },
    ],
  },
  other: {
    title: 'Other',
    items: [
      { id: 'other-modules', title: 'Modules_import_and_export', path: 'Modules_import_and_export', topics: 'ES modules' },
      { id: 'other-modules-proj', title: 'ModulesProjects', path: 'ModulesProjects', topics: 'Module-based small projects' },
      { id: 'other-must', title: 'Must_Know_abot-JS', path: 'Must_Know_abot-JS', topics: 'e.g. Object.assign' },
      { id: 'other-interview', title: 'Interview Questions', path: 'Interview Questions', topics: 'Interview prep' },
      { id: 'other-exam', title: 'EXAM', path: 'EXAM', topics: 'Exam materials' },
    ],
  },
}
