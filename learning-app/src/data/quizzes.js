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
  '02': {
    title: 'Lesson 02 — Logic operators, variables',
    questions: [
      {
        q: 'Which is a logical AND operator?',
        options: ['&&', '||', '!', 'and'],
        correctIndex: 0,
      },
      {
        q: 'Which operator checks strict equality (no type coercion)?',
        options: ['=', '==', '===', 'equals'],
        correctIndex: 2,
      },
      {
        q: 'What does the ! operator do?',
        options: ['Increment', 'Logical NOT (negation)', 'Concatenate', 'Comment'],
        correctIndex: 1,
      },
    ],
  },
  '03': {
    title: 'Lesson 03 — Conditions, switch, loops',
    questions: [
      {
        q: 'Which keyword starts a conditional block?',
        options: ['when', 'if', 'case', 'cond'],
        correctIndex: 1,
      },
      {
        q: 'What is switch used for?',
        options: ['Looping', 'Multiple value comparison', 'Function definition', 'Variable declaration'],
        correctIndex: 1,
      },
      {
        q: 'Which loop checks the condition before executing?',
        options: ['do...while', 'while', 'repeat', 'loop'],
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
  '05': {
    title: 'Lesson 05 — Arrays, array methods',
    questions: [
      {
        q: 'How do you add an element to the end of an array?',
        options: ['push()', 'append()', 'add()', 'insert()'],
        correctIndex: 0,
      },
      {
        q: 'Which method returns a new array with filtered elements?',
        options: ['filter()', 'find()', 'slice()', 'splice()'],
        correctIndex: 0,
      },
      {
        q: 'What does array.length give you?',
        options: ['The last element', 'The number of elements', 'The first element', 'A copy of the array'],
        correctIndex: 1,
      },
    ],
  },
  '06': {
    title: 'Lesson 06 — Arrays intro, Math/fibonacci',
    questions: [
      { q: 'How do you create an empty array?', options: ['array()', '[] or new Array()', 'createArray()', 'empty()'], correctIndex: 1 },
      { q: 'Which method removes the last element from an array?', options: ['pop()', 'shift()', 'remove()', 'delete()'], correctIndex: 0 },
      { q: 'What does index 0 refer to in an array?', options: ['The last element', 'The first element', 'The length', 'Nothing'], correctIndex: 1 },
    ],
  },
  '07': {
    title: 'Lesson 07 — Array methods, tasks',
    questions: [
      { q: 'Which method creates a new array by transforming each element?', options: ['map()', 'filter()', 'forEach()', 'loop()'], correctIndex: 0 },
      { q: 'What does find() return?', options: ['All matching elements', 'The first matching element or undefined', 'The index', 'A boolean'], correctIndex: 1 },
      { q: 'Which method joins array elements into a string?', options: ['join()', 'concat()', 'merge()', 'string()'], correctIndex: 0 },
    ],
  },
  '08': {
    title: 'Lesson 08 — defer/async, Math, sort',
    questions: [
      { q: 'What does the defer attribute do on a script tag?', options: ['Runs immediately', 'Defers execution until HTML is parsed', 'Disables the script', 'Loads async'], correctIndex: 1 },
      { q: 'Which Math method returns a random number 0–1?', options: ['random()', 'rand()', 'randomNumber()', 'rnd()'], correctIndex: 0 },
      { q: 'How does sort() order by default?', options: ['Numeric ascending', 'Lexicographic (string) order', 'Reverse order', 'Random'], correctIndex: 1 },
    ],
  },
  '09': {
    title: 'Lesson 09 — Array methods Part 2, functions intro',
    questions: [
      { q: 'Which method adds elements at the beginning of an array?', options: ['unshift()', 'push()', 'prepend()', 'addFirst()'], correctIndex: 0 },
      { q: 'What is an associative array in JavaScript?', options: ['A typed array', 'An object used as a key-value map', 'A linked list', 'A stack'], correctIndex: 1 },
      { q: 'Which method reverses an array in place?', options: ['reverse()', 'flip()', 'backwards()', 'invert()'], correctIndex: 0 },
    ],
  },
  '10': {
    title: 'Lesson 10 — Functions, gradient, loops',
    questions: [
      {
        q: 'How do you declare a function?',
        options: ['function myFunc() {}', 'func myFunc() {}', 'def myFunc() {}', 'fn myFunc() {}'],
        correctIndex: 0,
      },
      {
        q: 'What does return do in a function?',
        options: ['Stops the function and sends a value back', 'Restarts the function', 'Logs to console', 'Declares a variable'],
        correctIndex: 0,
      },
      {
        q: 'Can a function call itself?',
        options: ['No', 'Yes (recursion)', 'Only once', 'Only in strict mode'],
        correctIndex: 1,
      },
    ],
  },
  '11': {
    title: 'Lesson 11 — Functions, homework',
    questions: [
      { q: 'What is a function parameter?', options: ['The return value', 'A variable that receives an argument', 'A global variable', 'A loop'], correctIndex: 1 },
      { q: 'Can a function have multiple return statements?', options: ['No', 'Yes', 'Only in strict mode', 'Only one per block'], correctIndex: 1 },
      { q: 'What is an argument?', options: ['The function name', 'The value passed to a function when called', 'A keyword', 'A type'], correctIndex: 1 },
    ],
  },
  '12': {
    title: 'Lesson 12 — Functions, use strict',
    questions: [
      { q: 'What does "use strict" do?', options: ['Speeds up code', 'Enables strict mode (stricter parsing, no silent errors)', 'Disables functions', 'Forces types'], correctIndex: 1 },
      { q: 'In strict mode, what happens to undeclared variables?', options: ['They become global', 'ReferenceError is thrown', 'They are null', 'They are undefined'], correctIndex: 1 },
      { q: 'Where can you place "use strict"?', options: ['Only in HTML', 'At the top of a file or function', 'Only in loops', 'Nowhere'], correctIndex: 1 },
    ],
  },
  '13': {
    title: 'Lesson 13 — Recursion, scope',
    questions: [
      {
        q: 'What is recursion?',
        options: ['A type of loop', 'A function that calls itself', 'A global variable', 'An event handler'],
        correctIndex: 1,
      },
      {
        q: 'Where is a variable declared with let visible?',
        options: ['Everywhere', 'Only in its block (and inner blocks)', 'Only in the same function', 'Nowhere'],
        correctIndex: 1,
      },
      {
        q: 'What is the scope of a variable declared inside a function?',
        options: ['Global', 'Block', 'Function (local)', 'Module'],
        correctIndex: 2,
      },
    ],
  },
  '14': {
    title: 'Lesson 14 — Objects (associative), homework',
    questions: [
      { q: 'How do you access an object property?', options: ['object->prop', 'object.prop or object["prop"]', 'object(prop)', 'object:prop'], correctIndex: 1 },
      { q: 'What is an object literal?', options: ['A constructor', '{} with key-value pairs', 'A class', 'A function'], correctIndex: 1 },
      { q: 'How do you add a new property to an object?', options: ['add(obj, key, value)', 'obj.key = value', 'object.add()', 'You cannot'], correctIndex: 1 },
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
  '16': {
    title: 'Lesson 16 — Primitive vs reference, timers',
    questions: [
      { q: 'How are objects passed in JavaScript?', options: ['By value (copy)', 'By reference', 'By pointer', 'By name'], correctIndex: 1 },
      { q: 'Which function runs code after a delay (ms)?', options: ['setTimeout()', 'delay()', 'wait()', 'after()'], correctIndex: 0 },
      { q: 'What are primitives copied by?', options: ['Reference', 'Value', 'Pointer', 'Name'], correctIndex: 1 },
    ],
  },
  '17': {
    title: 'Lesson 17 — ES6 primitives, timers',
    questions: [
      { q: 'Which ES6 primitive is a unique identifier?', options: ['Symbol', 'BigInt', 'Number', 'String'], correctIndex: 0 },
      { q: 'What does setInterval() return?', options: ['Nothing', 'A timer ID you can pass to clearInterval()', 'The callback', 'A Promise'], correctIndex: 1 },
      { q: 'What is BigInt used for?', options: ['Small integers', 'Arbitrarily large integers', 'Decimals', 'Strings'], correctIndex: 1 },
    ],
  },
  '18': {
    title: 'Lesson 18 — Errors, try/catch, spread/rest',
    questions: [
      { q: 'What does try/catch do?', options: ['Prevents errors', 'Handles errors so code can continue', 'Stops the script', 'Logs only'], correctIndex: 1 },
      { q: 'What does the spread operator (...) do?', options: ['Merges objects only', 'Expands iterables (e.g. array into elements)', 'Creates a copy only', 'Nothing'], correctIndex: 1 },
      { q: 'What is the Error object?', options: ['A string', 'A built-in object with message and stack', 'A function', 'A number'], correctIndex: 1 },
    ],
  },
  '19': {
    title: 'Lesson 19 — DOM intro, childNode/children',
    questions: [
      { q: 'What is childNodes?', options: ['Only element nodes', 'All node types (elements, text, etc.)', 'Only text nodes', 'A method'], correctIndex: 1 },
      { q: 'What is children?', options: ['All node types', 'Only element nodes (HTML elements)', 'Only the first child', 'A string'], correctIndex: 1 },
      { q: 'Which property gets the first child element?', options: ['firstChild', 'firstElementChild', 'child[0]', 'getFirst()'], correctIndex: 1 },
    ],
  },
  '20': {
    title: 'Lesson 20 — DOM',
    questions: [
      {
        q: 'What does DOM stand for?',
        options: ['Data Object Model', 'Document Object Model', 'Dynamic Output Model', 'Document Order Model'],
        correctIndex: 1,
      },
      {
        q: 'Which method selects an element by ID?',
        options: ['getByClass()', 'getElementById()', 'queryId()', 'findById()'],
        correctIndex: 1,
      },
      {
        q: 'How do you change the text content of an element?',
        options: ['element.text', 'element.textContent', 'element.innerHTML only', 'element.value'],
        correctIndex: 1,
      },
    ],
  },
  '21': {
    title: 'Lesson 21 — DOM',
    questions: [
      { q: 'Which method selects elements by CSS selector?', options: ['getById()', 'querySelector()', 'find()', 'select()'], correctIndex: 1 },
      { q: 'How do you get all elements matching a selector?', options: ['querySelector()', 'querySelectorAll()', 'getAll()', 'findAll()'], correctIndex: 1 },
      { q: 'What does classList.add() do?', options: ['Removes a class', 'Adds a CSS class to the element', 'Creates a list', 'Nothing'], correctIndex: 1 },
    ],
  },
  '22': {
    title: 'Lesson 22 — Cloning, innerHTML, events',
    questions: [
      { q: 'How do you clone a DOM node?', options: ['copy()', 'cloneNode(true/false)', 'duplicate()', 'clone()'], correctIndex: 1 },
      { q: 'What does innerHTML contain?', options: ['Only text', 'The HTML string inside the element', 'The tag name', 'Nothing'], correctIndex: 1 },
      { q: 'In an event, what is event.target?', options: ['The element that triggered the listener', 'The element the listener is on', 'The document', 'The window'], correctIndex: 0 },
    ],
  },
  '23': {
    title: 'Lesson 23 — DOM, events',
    questions: [
      { q: 'How do you attach a click handler?', options: ['element.click = fn', 'element.addEventListener("click", fn)', 'element.on("click", fn)', 'element.handle("click")'], correctIndex: 1 },
      { q: 'What is event.currentTarget?', options: ['The element that triggered the event', 'The element the listener is attached to', 'The parent', 'The document'], correctIndex: 1 },
      { q: 'How do you prevent default link behavior?', options: ['event.stop()', 'event.preventDefault()', 'event.cancel()', 'return false only'], correctIndex: 1 },
    ],
  },
  '24': {
    title: 'Lesson 24 — DOM, events',
    questions: [
      { q: 'What is event bubbling?', options: ['Events do not propagate', 'Events propagate from target up to document', 'Events only on target', 'Events are async'], correctIndex: 1 },
      { q: 'How do you stop event propagation?', options: ['event.stop()', 'event.stopPropagation()', 'event.cancel()', 'return true'], correctIndex: 1 },
      { q: 'Which phase is the target phase?', options: ['Capturing', 'Bubbling', 'At the target element', 'None'], correctIndex: 2 },
    ],
  },
  '25': {
    title: 'Lesson 25 — DOM',
    questions: [
      { q: 'How do you create a new element?', options: ['document.newElement("div")', 'document.createElement("div")', 'document.add("div")', 'new Element("div")'], correctIndex: 1 },
      { q: 'How do you add a node as a child?', options: ['parent.add(child)', 'parent.appendChild(child)', 'parent.insert(child)', 'parent.append(child) only in newer APIs'], correctIndex: 1 },
      { q: 'How do you remove a child node?', options: ['child.remove() or parent.removeChild(child)', 'parent.delete(child)', 'child.delete()', 'parent.clear()'], correctIndex: 0 },
    ],
  },
  '26': {
    title: 'Lesson 26 — BOM, OOP intro, this, Date',
    questions: [
      { q: 'What does BOM stand for?', options: ['Document Object Model', 'Browser Object Model', 'Binary Object Model', 'Base Object Model'], correctIndex: 1 },
      { q: 'In a method, what does "this" refer to?', options: ['The window', 'The object the method is called on', 'The function', 'undefined'], correctIndex: 1 },
      { q: 'How do you create a Date for now?', options: ['Date.now() only', 'new Date()', 'date()', 'Date.current()'], correctIndex: 1 },
    ],
  },
  '27': {
    title: 'Lesson 27 — OOP this, call/apply/bind',
    questions: [
      { q: 'What does call() do?', options: ['Calls a function with a given "this" and arguments', 'Only calls a function', 'Creates a new function', 'Binds once'], correctIndex: 0 },
      { q: 'What is the difference between call and apply?', options: ['No difference', 'apply passes arguments as an array', 'call is async', 'apply is for methods only'], correctIndex: 1 },
      { q: 'What does bind() return?', options: ['The original function', 'A new function with "this" and args fixed', 'undefined', 'The object'], correctIndex: 1 },
    ],
  },
  '28': {
    title: 'Lesson 28 — Constructors, encapsulation, prototype',
    questions: [
      {
        q: 'What is a constructor function used for?',
        options: ['Creating loops', 'Creating multiple similar objects', 'Defining CSS', 'Handling events'],
        correctIndex: 1,
      },
      {
        q: 'What is the prototype in JavaScript?',
        options: ['A copy of an object', 'An object that shares properties with instances', 'A type of array', 'A built-in function'],
        correctIndex: 1,
      },
      {
        q: 'Which keyword is used with constructor to create a new instance?',
        options: ['create', 'new', 'instance', 'make'],
        correctIndex: 1,
      },
    ],
  },
  '29': {
    title: 'Lesson 29 — Getter/setter, __proto__, prototype',
    questions: [
      { q: 'What is a getter?', options: ['A function that sets a value', 'A property that runs a function when read', 'A private method', 'A constructor'], correctIndex: 1 },
      { q: 'What is __proto__?', options: ['The same as prototype', 'The internal prototype link of an instance', 'A method', 'Deprecated only'], correctIndex: 1 },
      { q: 'Where does prototype live?', options: ['On every instance', 'On the constructor function', 'On Object only', 'On window'], correctIndex: 1 },
    ],
  },
  '30': {
    title: 'Lesson 30 — ES6 class, inheritance, Object.create',
    questions: [
      {
        q: 'Which keyword defines an ES6 class?',
        options: ['function', 'object', 'class', 'struct'],
        correctIndex: 2,
      },
      {
        q: 'How do you inherit from another class in ES6?',
        options: ['extends', 'inherits', 'superclass', 'parent'],
        correctIndex: 0,
      },
      {
        q: 'What does super() do in a subclass constructor?',
        options: ['Calls the parent constructor', 'Creates a new object', 'Returns undefined', 'Stops execution'],
        correctIndex: 0,
      },
    ],
  },
  '31': {
    title: 'Lesson 31 — Arrow functions, ES6 class get/set/static',
    questions: [
      { q: 'Do arrow functions have their own "this"?', options: ['Yes', 'No, they inherit from enclosing scope', 'Only in strict mode', 'Only when called'], correctIndex: 1 },
      { q: 'What does static in a class mean?', options: ['Instance method', 'Method/property on the class itself', 'Constant', 'Private'], correctIndex: 1 },
      { q: 'Can you use get/set in an ES6 class?', options: ['No', 'Yes', 'Only in subclasses', 'Only for numbers'], correctIndex: 1 },
    ],
  },
  '32': {
    title: 'Lesson 32 — OOP conclusion',
    questions: [
      { q: 'What is encapsulation?', options: ['Exposing all data', 'Bundling data and methods, hiding implementation', 'Inheritance only', 'A loop'], correctIndex: 1 },
      { q: 'What is polymorphism?', options: ['One type only', 'Same interface, different behavior (e.g. overridden methods)', 'Multiple inheritance only', 'A keyword'], correctIndex: 1 },
      { q: 'What does Object.create(proto) do?', options: ['Clones an object', 'Creates a new object with proto as its prototype', 'Creates a class', 'Nothing'], correctIndex: 1 },
    ],
  },
  '33': {
    title: 'Lesson 33 — ES6',
    questions: [
      { q: 'Which keyword declares a block-scoped constant?', options: ['var', 'let', 'const', 'constant'], correctIndex: 2 },
      { q: 'What are template literals?', options: ['Strings with "', "Strings with ` and ${} for interpolation", 'Arrays', 'Objects'], correctIndex: 1 },
      { q: 'What is destructuring?', options: ['Breaking code', 'Unpacking values from arrays/objects into variables', 'Deleting properties', 'A loop'], correctIndex: 1 },
    ],
  },
  '34': {
    title: 'Lesson 34 — Set, collections',
    questions: [
      { q: 'What is a Set?', options: ['An array', 'A collection of unique values', 'A key-value map', 'A function'], correctIndex: 1 },
      { q: 'How do you add a value to a Set?', options: ['set.push()', 'set.add()', 'set.insert()', 'set.append()'], correctIndex: 1 },
      { q: 'Does Set keep insertion order?', options: ['No', 'Yes', 'Only for numbers', 'Random'], correctIndex: 1 },
    ],
  },
  '35': {
    title: 'Lesson 35 — Iterators, generators',
    questions: [
      { q: 'What does a generator function use?', options: ['return only', 'yield to pause and return values', 'async only', 'throw only'], correctIndex: 1 },
      { q: 'What is an iterator?', options: ['A loop', 'An object with next() returning { value, done }', 'A function', 'An array'], correctIndex: 1 },
      { q: 'How do you define a generator?', options: ['function* gen() {}', 'generator gen() {}', 'function gen*() {}', 'gen() * {}'], correctIndex: 0 },
    ],
  },
  '36': {
    title: 'Lesson 36 — Event Loop, Promise',
    questions: [
      { q: 'What does a Promise represent?', options: ['A value now', 'A value that might be available later (async)', 'A loop', 'A callback only'], correctIndex: 1 },
      { q: 'What are the Promise states?', options: ['pending, done', 'pending, fulfilled, rejected', 'running, stopped', 'sync, async'], correctIndex: 1 },
      { q: 'Which method runs when a Promise is fulfilled?', options: ['catch()', 'then()', 'finally() only', 'done()'], correctIndex: 1 },
    ],
  },
  '37': {
    title: 'Lesson 37 — Async, Fetch, async/await',
    questions: [
      {
        q: 'What does async/await help with?',
        options: ['Synchronous code', 'Asynchronous code that looks synchronous', 'Loops only', 'Variables'],
        correctIndex: 1,
      },
      {
        q: 'What does fetch() return?',
        options: ['The response data directly', 'A Promise', 'A callback', 'A string'],
        correctIndex: 1,
      },
      {
        q: 'What keyword waits for a Promise to resolve?',
        options: ['wait', 'await', 'then', 'sync'],
        correctIndex: 1,
      },
    ],
  },
  '38': {
    title: 'Lesson 38 — Summary',
    questions: [
      { q: 'What is the call stack?', options: ['A data structure for async code', 'Where function calls are tracked (LIFO)', 'A type of array', 'The DOM'], correctIndex: 1 },
      { q: 'What is the event loop?', options: ['A for loop', 'Mechanism that takes tasks from queue and runs when stack is empty', 'A callback', 'setInterval'], correctIndex: 1 },
      { q: 'Which is a key JavaScript concept?', options: ['Only synchronous execution', 'Single-threaded with async via queue and event loop', 'Multi-threaded only', 'No functions'], correctIndex: 1 },
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
