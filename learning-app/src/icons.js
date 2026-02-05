/**
 * Lightweight SVG icons (Lucide paths). Used in sidebar and search.
 * Attributes: 24x24 viewBox, stroke currentColor, 2px stroke.
 */
const svgAttrs = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'

/** Chevron right (section expand/collapse). */
export const chevronRightSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><path d="m9 18 6-6-6-6"/></svg>`

/** Search (search input). */
export const searchSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/></svg>`

/** X (clear search). */
export const xSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`

/** Sun (switch to light mode). */
export const sunSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`

/** Moon (switch to dark mode). */
export const moonSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`

/** Circle outline (lesson not completed). */
export const circleSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="10"/></svg>`

/** Circle with check (lesson completed). */
export const checkCircleSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`

/** Clock (in progress). */
export const clockSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`

/** Grip horizontal (resize handle affordance). */
export const gripHorizontalSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0 pointer-events-none"><path d="M6 8h12M6 12h12M6 16h12"/></svg>`

/** Check (correct answer). */
export const checkSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>`

/** Cross / X (wrong answer). */
export const crossSvg = `<svg ${svgAttrs} class="w-4 h-4 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
