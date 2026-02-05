/**
 * Ace Editor code playground. Popular, zero-config syntax highlighting.
 */
import 'ace-builds/css/ace.css'
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/theme-chrome'

/**
 * @param {HTMLElement} container - Element to mount the editor in.
 * @param {string} initialCode - Initial document content.
 * @param {{ onRun?: () => void }} [options] - Optional: onRun called on Ctrl+Enter.
 * @returns {{ getValue: () => string, destroy: () => void, resize: () => void }}
 */
export function mountPlaygroundEditor(container, initialCode, options = {}) {
  if (!container?.isConnected) throw new Error('Playground container not in DOM')
  const value = typeof initialCode === 'string' ? initialCode : ''
  const editor = ace.edit(container, {
    mode: 'ace/mode/html',
    theme: 'ace/theme/chrome',
    fontSize: 14,
    showPrintMargin: false,
    wrap: true,
  })
  editor.setValue(value, -1)
  if (typeof options.onRun === 'function') {
    editor.commands.addCommand({
      name: 'runPlayground',
      bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
      exec: () => options.onRun(),
    })
  }
  editor.resize()
  return {
    getValue: () => editor.getValue(),
    setValue: (v) => editor.setValue(typeof v === 'string' ? v : '', -1),
    destroy: () => editor.destroy(),
    resize: () => editor.resize(),
  }
}
