/**
 * Seed content for the overview, in the shape the API returns.
 *
 * It used to store finished display strings — `'14 JUN 2027'`, `'IN 42 DAYS'`,
 * `'Playlists: 6 of 6 lists in'` — because it was a transcription of a design
 * mock and nothing needed to compute them. Now it holds the same facts the API
 * sends, and `src/format` turns them into those exact strings.
 *
 * The point of doing it in this order is that this file can be deleted in one
 * commit when the data hook lands, without touching a screen.
 */

import type { components } from '../api/schema'

export type WeddingSummary = components['schemas']['WeddingSummary']

/** Every wedding, upcoming and past. The overview splits them on `days_until`. */
export const weddings: WeddingSummary[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    slug: 'emma-julian',
    status: 'CONFIRMED',
    wedding_date: '2027-06-14',
    days_until: 42,
    couple_display_name: 'Emma & Julian',
    venue: { name: 'De Oude Tuinderij', place: 'Aalsmeer' },
    guest_count: 120,
    roles: [
      { role: 'DJ', state: 'CONFIRMED', label: 'DJ Daan' },
      { role: 'CATERING', state: 'CONFIRMED', label: 'Catering' },
      { role: 'PHOTO', state: 'CONFIRMED', label: 'Photo' },
    ],
    music: { lists_in: 6, lists_total: 6 },
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    slug: 'sofie-mark',
    status: 'CONFIRMED',
    wedding_date: '2027-07-03',
    days_until: 61,
    couple_display_name: 'Sofie & Mark',
    venue: { name: 'Landgoed Ter Hooge', place: 'Middelburg' },
    guest_count: 85,
    roles: [
      { role: 'DJ', state: 'CONFIRMED', label: 'DJ Yara' },
      { role: 'CATERING', state: 'OPEN', label: 'Catering' },
      { role: 'PHOTO', state: 'CONFIRMED', label: 'Photo' },
    ],
    music: { lists_in: 3, lists_total: 6 },
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    slug: 'lisa-tom',
    status: 'DRAFT',
    wedding_date: '2027-08-21',
    days_until: 110,
    couple_display_name: 'Lisa & Tom',
    venue: { name: 'Strandpaviljoen Zuid', place: 'Bloemendaal' },
    guest_count: 150,
    roles: [
      { role: 'DJ', state: 'OPEN', label: 'DJ' },
      { role: 'CATERING', state: 'OPEN', label: 'Catering' },
      { role: 'PHOTO', state: 'CONFIRMED', label: 'Photo' },
    ],
    music: { lists_in: 0, lists_total: 6 },
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    slug: 'nora-wessel',
    status: 'COMPLETED',
    wedding_date: '2026-05-02',
    days_until: -1,
    couple_display_name: 'Nora & Wessel',
    venue: { name: 'Kasteel Wijenburg', place: 'Echteld' },
    guest_count: 95,
    roles: [],
    music: { lists_in: 6, lists_total: 6 },
    note: 'All playlists archived',
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    slug: 'femke-ruben',
    status: 'COMPLETED',
    wedding_date: '2026-04-18',
    days_until: -1,
    couple_display_name: 'Femke & Ruben',
    venue: { name: 'De Oude Tuinderij', place: 'Aalsmeer' },
    guest_count: 110,
    roles: [],
    music: { lists_in: 6, lists_total: 6 },
    note: 'All playlists archived',
  },
]

/** A venue as one line: `'De Oude Tuinderij, Aalsmeer'`. */
export function venueLine(venue: WeddingSummary['venue']): string {
  if (!venue) return ''
  return venue.place ? `${venue.name}, ${venue.place}` : venue.name
}

export const upcoming = weddings.filter((w) => (w.days_until ?? 0) >= 0)
export const past = weddings.filter((w) => (w.days_until ?? 0) < 0)

export const overviewSubtitle = 'Five coming up this season, two waiting on vendors.'

/** The counts behind the footer line, until the API supplies them. */
export const overviewCounts = { plannedThisYear: 12, needAVendor: 2 }
