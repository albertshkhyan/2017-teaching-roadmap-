/**
 * Quiz data per lesson — multiple choice. correctIndex is 0-based.
 */
export const QUIZZES = {
  '01': {
    title: 'Lesson 01 — Intro, basics',
    questions: [
      {
        q: 'What is JavaScript?',
        options: ['A markup language', 'A scripting language for the web', 'A styling language', 'A database'],
        correctIndex: 1,
      },
      {
        q: 'Which keyword declares a variable (older style)?',
        options: ['let', 'const', 'var', 'variable'],
        correctIndex: 2,
      },
      {
        q: 'What does typeof return?',
        options: ['A number', 'A string describing the type', 'A boolean', 'An object'],
        correctIndex: 1,
      },
    ],
  },
  '04': {
    title: 'Lesson 04 — Loops, String methods, Number/Math',
    questions: [
      {
        q: 'Which loop runs at least once?',
        options: ['for', 'while', 'do...while', 'forEach'],
        correctIndex: 2,
      },
      {
        q: 'String method to get a substring?',
        options: ['slice()', 'cut()', 'part()', 'sub()'],
        correctIndex: 0,
      },
      {
        q: 'Math method to round down?',
        options: ['round()', 'floor()', 'ceil()', 'trunc()'],
        correctIndex: 1,
      },
    ],
  },
  '15': {
    title: 'Lesson 15 — Callbacks, forEach, reduce',
    questions: [
      {
        q: 'What is a callback function?',
        options: ['A function that runs first', 'A function passed as an argument to another function', 'A function that returns a number', 'A built-in only'],
        correctIndex: 1,
      },
      {
        q: 'What does forEach return?',
        options: ['A new array', 'The element', 'undefined', 'The index'],
        correctIndex: 2,
      },
      {
        q: 'reduce() is used to:',
        options: ['Filter an array', 'Turn an array into a single value', 'Sort an array', 'Copy an array'],
        correctIndex: 1,
      },
    ],
  },
}

export const PLAYGROUND_STARTER = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Playground</title></head>
<body>
  <h1>Hello from the playground</h1>
  <p id="out">Edit HTML/JS and click Run.</p>
  <script>
    document.getElementById('out').textContent = 'You ran the code at ' + new Date().toLocaleTimeString();
  </script>
</body>
</html>`
