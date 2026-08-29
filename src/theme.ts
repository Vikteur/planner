/**
 * Design tokens transcribed 1:1 from `planner/Planner UI Mock.dc.html`.
 * Every literal in the mock resolves to exactly one entry here.
 */
export const c = {
  shell: '#faf8f3',
  white: '#fff',
  cream: '#fffdf8',

  ink: '#2b2620',
  inkHover: '#453d33',
  inkSoft: '#6f6759',
  mute: '#a89d8a',
  muteSoft: '#b3a78f',
  muteFaint: '#c4bba7',

  gold: '#b08d57',
  goldDeep: '#8a6b3c',
  goldWash: 'rgba(176,141,87,.13)',
  goldWashStrong: 'rgba(176,141,87,.14)',

  line: '#e7dfd0',
  lineSoft: '#f0e9da',
  lineAside: '#eee6d6',
  lineCream: '#eadfca',
  lineHover: '#cfc3aa',
  dash: '#d8c6a4',
  dashSoft: '#ddd2bc',
  navHover: '#f3edde',
} as const

export const family = {
  sans: "'DM Sans',Helvetica,sans-serif",
  serif: "'Cormorant Garamond',Georgia,serif",
  mono: "'JetBrains Mono',monospace",
} as const

/** `font:` shorthand builders, so the shorthand's line-height reset is preserved. */
export const mono = (weight: number, size: string) => `${weight} ${size} ${family.mono}`
export const sans = (weight: number, size: string) => `${weight} ${size} ${family.sans}`

/**
 * Mirrors the palette into CSS custom properties (`--rp-ink`, `--rp-line`, ...)
 * so `responsive.css` can use the same tokens without a second copy of them.
 * Called once from main.tsx before the first render.
 */
export function installCssVars(el: HTMLElement = document.documentElement) {
  for (const [name, value] of Object.entries(c)) el.style.setProperty(`--rp-${name}`, value)
}
