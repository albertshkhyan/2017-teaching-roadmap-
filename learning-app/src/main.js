import './style.css'

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">2017 Educator Lessons</h1>
    <p class="text-gray-600 mb-6">Interactive learning web tool — coming soon</p>
    <div class="flex gap-3">
      <a href="#" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">View roadmap</a>
      <a href="#" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Repo README</a>
    </div>
  </div>
`
