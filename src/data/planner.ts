/** Seed content transcribed from the mock. Strings match the design verbatim. */

export type Tag = { label: string; confirmed: boolean }

export type Wedding = {
  id: string
  date: string
  countdown: string
  couple: string
  venue: string
  guests: number
  tags: Tag[]
  playlists: string
}

export type PastWedding = {
  id: string
  date: string
  couple: string
  venue: string
  note: string
}

export const upcoming: Wedding[] = [
  {
    id: 'emma-julian',
    date: '14 JUN 2027',
    countdown: 'IN 42 DAYS',
    couple: 'Emma & Julian',
    venue: 'De Oude Tuinderij, Aalsmeer',
    guests: 120,
    tags: [
      { label: 'DJ Daan', confirmed: true },
      { label: 'Catering', confirmed: true },
      { label: 'Photo', confirmed: true },
    ],
    playlists: 'Playlists: 6 of 6 lists in',
  },
  {
    id: 'sofie-mark',
    date: '03 JUL 2027',
    countdown: 'IN 61 DAYS',
    couple: 'Sofie & Mark',
    venue: 'Landgoed Ter Hooge, Middelburg',
    guests: 85,
    tags: [
      { label: 'DJ Yara', confirmed: true },
      { label: 'Catering', confirmed: false },
      { label: 'Photo', confirmed: true },
    ],
    playlists: 'Playlists: 3 of 6 lists in',
  },
  {
    id: 'lisa-tom',
    date: '21 AUG 2027',
    countdown: 'IN 110 DAYS',
    couple: 'Lisa & Tom',
    venue: 'Strandpaviljoen Zuid, Bloemendaal',
    guests: 150,
    tags: [
      { label: 'DJ', confirmed: false },
      { label: 'Catering', confirmed: false },
      { label: 'Photo', confirmed: true },
    ],
    playlists: 'Playlists: not started',
  },
]

export const past: PastWedding[] = [
  {
    id: 'nora-wessel',
    date: '02 MAY 2026',
    couple: 'Nora & Wessel',
    venue: 'Kasteel Wijenburg, Echteld',
    note: 'All playlists archived',
  },
  {
    id: 'femke-ruben',
    date: '18 APR 2026',
    couple: 'Femke & Ruben',
    venue: 'De Oude Tuinderij, Aalsmeer',
    note: 'All playlists archived',
  },
]

export const overviewSubtitle = 'Five coming up this season, two waiting on vendors.'
export const overviewFooter = '12 WEDDINGS PLANNED THIS YEAR · 2 NEED A VENDOR'
