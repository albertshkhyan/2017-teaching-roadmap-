/**
 * Per-lesson starter HTML for the code playground. Key = lesson id (e.g. '22').
 * Used by "Load lesson starter" when a lesson has a starter.
 */
import { PLAYGROUND_STARTER } from './quizzes.js'

export const DEFAULT_STARTER = PLAYGROUND_STARTER

/** @type {Record<string, string>} lesson id → full HTML document */
export const PLAYGROUND_STARTERS = {
  '01': `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Hello</title></head>
<body>
  <h1>Hello from the playground</h1>
  <p id="out">Edit and click Run.</p>
  <script>
    document.getElementById('out').textContent = 'Ran at ' + new Date().toLocaleTimeString();
  </script>
</body>
</html>`,
  '22': `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Slider</title></head>
<body>
  <div class="slider-wrap" style="padding: 1rem;">
    <input type="range" id="slider" min="0" max="100" value="50" style="width: 200px;">
    <output id="value">50</output>
  </div>
  <script>
    var slider = document.getElementById('slider');
    var output = document.getElementById('value');
    slider.addEventListener('input', function() {
      output.textContent = slider.value;
    });
  </script>
</body>
</html>`,
  '26': `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Digital clock</title></head>
<body>
  <div style="font-family: monospace; font-size: 2rem; padding: 1rem;" id="clock">--:--:--</div>
  <script>
    function tick() {
      var now = new Date();
      document.getElementById('clock').textContent = now.toLocaleTimeString();
    }
    tick();
    setInterval(tick, 1000);
  </script>
</body>
</html>`,
  '19': `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>DOM intro</title></head>
<body>
  <p id="target">Change me.</p>
  <button id="btn">Click</button>
  <script>
    document.getElementById('btn').addEventListener('click', function() {
      document.getElementById('target').textContent = 'Clicked at ' + new Date().toLocaleTimeString();
    });
  </script>
</body>
</html>`,
}
