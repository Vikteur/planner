import type { VendorCategory } from '../api/client'

/**
 * The directory's four tabs: their URL segment, their category, and their copy.
 *
 * This is UI text, not data. It stayed behind when the vendors themselves moved
 * to the API, because a subtitle reading "Eight caterers you work with" is a
 * thing the product says, not a thing the server knows — and the count in it is
 * derived from the list, so it is written here as a shape and filled in below.
 */
export type DirectoryTab = {
  key: string
  category: VendorCategory
  nav: string
  title: string
  /** `(count) => string`, because the number comes from the fetched list. */
  subtitle: (count: number) => string
  search: string
  add: string
  note: string
  noteLink: string
}

/** "Eight caterers", not "8 caterers" — the mock writes small numbers in words. */
const WORDS = [
  'No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve',
] as const

function count(n: number, singular: string, plural: string): string {
  const word = n < WORDS.length ? WORDS[n] : String(n)
  return `${word} ${n === 1 ? singular : plural}`
}

export const DIRECTORY_TABS: DirectoryTab[] = [
  {
    key: 'catering',
    category: 'CATERING',
    nav: 'Catering',
    title: 'Catering.',
    subtitle: (n) => `${count(n, 'caterer', 'caterers')} you work with, and who to call at each.`,
    search: 'Search a name or dish…',
    add: '+ Add caterer',
    note: 'Works the same for photographers, locations and DJs.',
    noteLink: 'Switch tabs on the left.',
  },
  {
    key: 'photographers',
    category: 'PHOTO',
    nav: 'Photographers',
    title: 'Photographers.',
    subtitle: (n) =>
      `${count(n, 'photographer', 'photographers')} you work with, and how they shoot a day.`,
    search: 'Search a name or style…',
    add: '+ Add photographer',
    note: 'Works the same for catering, locations and DJs.',
    noteLink: 'Switch tabs on the left.',
  },
  {
    key: 'locations',
    category: 'LOCATION',
    nav: 'Locations',
    title: 'Locations.',
    subtitle: () => 'The venues you keep coming back to, and who holds the keys.',
    search: 'Search a venue or town…',
    add: '+ Add location',
    note: 'Works the same for catering, photographers and DJs.',
    noteLink: 'Switch tabs on the left.',
  },
  {
    key: 'djs',
    category: 'DJ',
    nav: 'DJs',
    title: 'DJs.',
    subtitle: () => 'The DJs you trust with the floor, and what they play best.',
    search: 'Search a name or genre…',
    add: '+ Add DJ',
    note: 'Works the same for catering, photographers and locations.',
    noteLink: 'Switch tabs on the left.',
  },
]

export const tabFor = (key: string | undefined): DirectoryTab | undefined =>
  DIRECTORY_TABS.find((tab) => tab.key === key)

export const directoryFooter =
  'EVERY CONTACT HERE CAN BE ASSIGNED TO A WEDDING IN ONE TAP'
