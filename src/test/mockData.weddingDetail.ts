/**
 * Wedding detail content, in the shape the API returns.
 *
 * One field from the mock is deliberately gone: every playlist row used to
 * carry a `preview` of real song titles — `'Dreams, September, Tender, Golden…'`
 * — on the same screen that says *"Read only. The music stays between couple
 * and DJ."* The API cannot supply it: the planner's projection has no field a
 * song could occupy, which is the product's own rule expressed so it cannot be
 * violated by forgetting a filter. The rows now show the list and its count,
 * which is what the heading already promised.
 */

import type { components } from '../api/schema'

export type Wedding = components['schemas']['Wedding']
export type TeamSlot = components['schemas']['TeamSlot']
export type Person = components['schemas']['Person']
export type SongListSummary = components['schemas']['SongListSummary']
export type TimelineItem = components['schemas']['TimelineItem']

export const musicFootnote = 'Read only. The music stays between couple and DJ.'

/** The six chapters, in the order the couple fills them in. */
const CHAPTERS = [
  { kind: 'opening_dance', label: 'Opening dance', max_songs: 1 },
  { kind: 'second_third', label: 'Second & third song', max_songs: 2 },
  { kind: 'couple_top20', label: 'Their top 20', max_songs: 20 },
  { kind: 'friends_top20', label: "Friends' top 20", max_songs: 20 },
  { kind: 'never', label: 'The never list', max_songs: null },
  { kind: 'must_plays', label: 'Must-plays, no matter what', max_songs: 5 },
] as const

/**
 * Six list summaries from six counts. `null` is a list the couple has not
 * reached; `0` would be one they finished and left empty.
 */
function lists(counts: (number | null)[]): SongListSummary[] {
  return CHAPTERS.map((chapter, order) => ({
    kind: chapter.kind,
    label: chapter.label,
    order: order + 1,
    state: counts[order] === null ? 'WAITING' : 'SUBMITTED',
    song_count: counts[order] ?? 0,
    max_songs: chapter.max_songs,
  }))
}

let nextId = 0
/** Stable enough for seed data; every one of these is replaced by a real uuid. */
const id = () => `00000000-0000-4000-8000-${String(++nextId).padStart(12, '0')}`

export const weddingDetails: Record<string, Wedding> = {
  'emma-julian': {
    id: '11111111-1111-4111-8111-111111111111',
    slug: 'emma-julian',
    status: 'CONFIRMED',
    wedding_date: '2027-06-14',
    days_until: 42,
    couple_display_name: 'Emma & Julian',
    venue: { name: 'De Oude Tuinderij', place: 'Aalsmeer', note: 'rain plan: glass house' },
    guest_count: 120,
    timezone: 'Europe/Amsterdam',
    ceremony_time: '13:30',
    first_dance_time: '20:30',
    music_ends_time: null,
    music: { lists_in: 6, lists_total: 6 },
    team: [
      { id: id(), role: 'VENUE', state: 'CONFIRMED', vendor_name: 'De Oude Tuinderij', contact_name: 'Sanne de Groot', note: 'De Oude Tuinderij · rain plan: glass house', phone: '+31 20 555 0184', email: 'sanne@oudetuinderij.nl', historical: false },
      { id: id(), role: 'DJ', state: 'CONFIRMED', contact_name: 'Daan Vermeer', note: 'On the decks 20:30 · load-in side door 19:45', phone: '+31 6 14 82 30 77', email: 'daan@daanvermeer.nl', historical: false },
      { id: id(), role: 'CATERING', state: 'CONFIRMED', vendor_name: 'Smaakmakers', contact_name: 'Petra Willems', note: 'Dinner 17:30 · 4 vegan, 2 gluten free', phone: '+31 6 58 09 12 76', email: 'petra@smaakmakers.nl', historical: false },
      { id: id(), role: 'PHOTO', state: 'CONFIRMED', contact_name: 'Merel Jansen', note: "Arrives 08:00 at the bride's parents", phone: '+31 6 22 70 45 18', email: 'merel@mereljansen.nl', historical: false },
      { id: id(), role: 'MC', state: 'CONFIRMED', person_name: 'Tim Bakker', note: 'Friend of the groom · runs the speeches', phone: '+31 6 40 71 29 55', email: 'tim.bakker@gmail.com', historical: false },
    ],
    people: [
      { id: id(), kind: 'PARTNER', given_name: 'Emma', family_name: 'Verhoeven', note: "bride · getting ready at her parents", phone: '+31 6 30 55 81 40', email: 'emma.verhoeven@gmail.com', sort_order: 1 },
      { id: id(), kind: 'PARTNER', given_name: 'Julian', family_name: 'Meijer', note: 'groom · reachable until 12:00', phone: '+31 6 19 72 03 66', email: 'julian.meijer@gmail.com', sort_order: 2 },
    ],
    song_lists: lists([1, 2, 20, 17, 2, 3]),
    portal: { scope: 'COUPLE', url: 'rekordmatch.app/g/emma-julian-14june', code: 'EJ14062027', code_stale: false, revoked: false },
  },

  'sofie-mark': {
    id: '22222222-2222-4222-8222-222222222222',
    slug: 'sofie-mark',
    status: 'CONFIRMED',
    wedding_date: '2027-07-03',
    days_until: 61,
    couple_display_name: 'Sofie & Mark',
    venue: { name: 'Landgoed Ter Hooge', place: 'Middelburg', note: 'chapel on the estate' },
    guest_count: 85,
    timezone: 'Europe/Amsterdam',
    ceremony_time: '14:00',
    first_dance_time: '21:00',
    music_ends_time: null,
    music: { lists_in: 3, lists_total: 6 },
    team: [
      { id: id(), role: 'VENUE', state: 'CONFIRMED', vendor_name: 'Landgoed Ter Hooge', contact_name: 'Wouter Roelofs', note: 'Landgoed Ter Hooge · chapel on the estate', phone: '+31 118 555 26 40', email: 'wouter@terhooge.nl', historical: false },
      { id: id(), role: 'DJ', state: 'CONFIRMED', contact_name: 'Yara Postma', note: 'On the decks 21:00 · load-in courtyard 20:15', phone: '+31 6 27 55 91 02', email: 'yara@yarapostma.nl', historical: false },
      { id: id(), role: 'PHOTO', state: 'CONFIRMED', vendor_name: 'Studio Noord', contact_name: 'Bram Hoekstra', note: 'Two shooters · same-day preview', phone: '+31 50 555 41 08', email: 'bram@studionoord.nl', historical: false },
    ],
    people: [
      { id: id(), kind: 'PARTNER', given_name: 'Sofie', family_name: 'Brouwer', note: 'bride · reachable until 11:00', phone: '+31 6 45 20 73 18', email: 'sofie.brouwer@gmail.com', sort_order: 1 },
      { id: id(), kind: 'PARTNER', given_name: 'Mark', family_name: 'Nieuwenhuis', note: 'groom · staying at the estate', phone: '+31 6 52 88 04 27', email: 'mark.nieuwenhuis@gmail.com', sort_order: 2 },
    ],
    song_lists: lists([1, null, 14, null, null, 2]),
    portal: { scope: 'COUPLE', url: 'rekordmatch.app/g/sofie-mark-3july', code: 'SM03072027', code_stale: false, revoked: false },
  },

  'lisa-tom': {
    id: '33333333-3333-4333-8333-333333333333',
    slug: 'lisa-tom',
    status: 'DRAFT',
    wedding_date: '2027-08-21',
    days_until: 110,
    couple_display_name: 'Lisa & Tom',
    venue: { name: 'Strandpaviljoen Zuid', place: 'Bloemendaal', note: 'hard stop on music at 01:00' },
    guest_count: 150,
    timezone: 'Europe/Amsterdam',
    ceremony_time: '15:00',
    first_dance_time: null,
    music_ends_time: '01:00',
    music: { lists_in: 0, lists_total: 6 },
    team: [
      { id: id(), role: 'VENUE', state: 'CONFIRMED', vendor_name: 'Strandpaviljoen Zuid', contact_name: 'Karin Smit', note: 'Strandpaviljoen Zuid · hard stop on music at 01:00', phone: '+31 23 555 07 22', email: 'karin@strandpaviljoenzuid.nl', historical: false },
      { id: id(), role: 'PHOTO', state: 'CONFIRMED', contact_name: 'Merel Jansen', note: 'Golden hour portraits on the beach', phone: '+31 6 22 70 45 18', email: 'merel@mereljansen.nl', historical: false },
    ],
    people: [
      { id: id(), kind: 'PARTNER', given_name: 'Lisa', family_name: 'Kuiper', note: 'bride · getting ready at the hotel', phone: '+31 6 12 66 39 84', email: 'lisa.kuiper@gmail.com', sort_order: 1 },
      { id: id(), kind: 'PARTNER', given_name: 'Tom', family_name: 'de Waal', note: 'groom · reachable all morning', phone: '+31 6 29 41 57 03', email: 'tom.dewaal@gmail.com', sort_order: 2 },
    ],
    song_lists: lists([null, null, null, null, null, null]),
    portal: { scope: 'COUPLE', url: 'rekordmatch.app/g/lisa-tom-21august', code: 'LT21082027', code_stale: false, revoked: false },
  },

  'nora-wessel': {
    id: '44444444-4444-4444-8444-444444444444',
    slug: 'nora-wessel',
    status: 'COMPLETED',
    wedding_date: '2026-05-02',
    days_until: -1,
    couple_display_name: 'Nora & Wessel',
    venue: { name: 'Kasteel Wijenburg', place: 'Echteld', note: 'castle hall' },
    guest_count: 95,
    timezone: 'Europe/Amsterdam',
    ceremony_time: '13:00',
    first_dance_time: '20:45',
    music_ends_time: null,
    music: { lists_in: 6, lists_total: 6 },
    team: [
      { id: id(), role: 'VENUE', state: 'CONFIRMED', vendor_name: 'Kasteel Wijenburg', contact_name: 'Elke Vermeulen', note: 'Kasteel Wijenburg · castle hall', phone: '+31 344 555 61 20', email: 'elke@kasteelwijenburg.nl', historical: true },
      { id: id(), role: 'DJ', state: 'CONFIRMED', contact_name: 'Daan Vermeer', note: 'Played 20:45 to 01:30', phone: '+31 6 14 82 30 77', email: 'daan@daanvermeer.nl', historical: true },
      { id: id(), role: 'CATERING', state: 'CONFIRMED', vendor_name: 'Bureau Banket', contact_name: 'Annelies de Jong', note: 'Seated dinner, five courses', phone: '+31 30 555 02 91', email: 'annelies@bureaubanket.nl', historical: true },
    ],
    people: [
      { id: id(), kind: 'PARTNER', given_name: 'Nora', family_name: 'Bosman', note: 'bride', phone: '+31 6 33 71 08 45', email: 'nora.bosman@gmail.com', sort_order: 1 },
      { id: id(), kind: 'PARTNER', given_name: 'Wessel', family_name: 'Kramer', note: 'groom', phone: '+31 6 21 90 54 66', email: 'wessel.kramer@gmail.com', sort_order: 2 },
    ],
    song_lists: lists([1, 2, 20, 20, 2, 2]),
    portal: { scope: 'COUPLE', url: 'rekordmatch.app/g/nora-wessel-2may', code: 'NW02052026', code_stale: false, revoked: true },
  },

  'femke-ruben': {
    id: '55555555-5555-4555-8555-555555555555',
    slug: 'femke-ruben',
    status: 'COMPLETED',
    wedding_date: '2026-04-18',
    days_until: -1,
    couple_display_name: 'Femke & Ruben',
    venue: { name: 'De Oude Tuinderij', place: 'Aalsmeer', note: 'glass house' },
    guest_count: 110,
    timezone: 'Europe/Amsterdam',
    ceremony_time: '14:30',
    first_dance_time: '21:00',
    music_ends_time: null,
    music: { lists_in: 6, lists_total: 6 },
    team: [
      { id: id(), role: 'VENUE', state: 'CONFIRMED', vendor_name: 'De Oude Tuinderij', contact_name: 'Sanne de Groot', note: 'De Oude Tuinderij · glass house', phone: '+31 20 555 0184', email: 'sanne@oudetuinderij.nl', historical: true },
      { id: id(), role: 'DJ', state: 'CONFIRMED', contact_name: 'Yara Postma', note: 'Played 21:00 to 01:00', phone: '+31 6 27 55 91 02', email: 'yara@yarapostma.nl', historical: true },
      { id: id(), role: 'CATERING', state: 'CONFIRMED', vendor_name: 'Fest & Food', contact_name: 'Milan Petrović', note: 'Food trucks in the garden', phone: '+31 6 77 20 94 41', email: 'milan@festenfood.nl', historical: true },
    ],
    people: [
      { id: id(), kind: 'PARTNER', given_name: 'Femke', family_name: 'Dijkstra', note: 'bride', phone: '+31 6 47 12 88 30', email: 'femke.dijkstra@gmail.com', sort_order: 1 },
      { id: id(), kind: 'PARTNER', given_name: 'Ruben', family_name: 'Hoogendoorn', note: 'groom', phone: '+31 6 55 03 26 71', email: 'ruben.hoogendoorn@gmail.com', sort_order: 2 },
    ],
    song_lists: lists([1, 2, 18, 19, 1, 2]),
    portal: { scope: 'COUPLE', url: 'rekordmatch.app/g/femke-ruben-18april', code: 'FR18042026', code_stale: false, revoked: true },
  },
}

/**
 * The running order, per wedding.
 *
 * `day_offset: 1` is what keeps a 01:00 last song below the 08:00 photographer
 * instead of at the top of the list — sorting on the clock alone puts the small
 * hours first, and the row that gets misplaced is always the end of the night.
 *
 * `owner_role` with no name is the mock's `'DJ open'` and `'Caterer open'`:
 * a slot that has not been filled, rendered from the role rather than stored as
 * a person who does not exist.
 */
export const weddingTimelines: Record<string, TimelineItem[]> = {
  'emma-julian': [
    { id: id(), day_offset: 0, at_time: '08:00', what: "Photographer at the bride's parents", owner_label: 'Merel Jansen' },
    { id: id(), day_offset: 0, at_time: '13:30', what: 'Ceremony in the garden', owner_label: 'Sanne de Groot' },
    { id: id(), day_offset: 0, at_time: '15:00', what: 'Reception, drinks on the lawn', owner_label: 'Petra Willems' },
    { id: id(), day_offset: 0, at_time: '17:30', what: 'Dinner, speeches between courses', owner_label: 'Tim Bakker' },
    { id: id(), day_offset: 0, at_time: '19:45', what: 'DJ load-in through the side door', owner_label: 'Daan Vermeer' },
    { id: id(), day_offset: 0, at_time: '20:30', what: 'Opening dance, floor opens after', owner_label: 'Daan Vermeer' },
    { id: id(), day_offset: 1, at_time: '01:00', what: 'Last song, lights up', owner_label: 'Daan Vermeer' },
  ],
  'sofie-mark': [
    { id: id(), day_offset: 0, at_time: '10:00', what: 'Getting ready at the estate', owner_label: 'Bram Hoekstra' },
    { id: id(), day_offset: 0, at_time: '14:00', what: 'Ceremony in the chapel', owner_label: 'Wouter Roelofs' },
    { id: id(), day_offset: 0, at_time: '18:00', what: 'Dinner in the orangery', owner_role: 'CATERING' },
    { id: id(), day_offset: 0, at_time: '20:15', what: 'DJ load-in through the courtyard', owner_label: 'Yara Postma' },
    { id: id(), day_offset: 0, at_time: '21:00', what: 'Opening dance, floor opens after', owner_label: 'Yara Postma' },
  ],
  'lisa-tom': [
    { id: id(), day_offset: 0, at_time: '12:00', what: 'Getting ready at the hotel', owner_label: 'Merel Jansen' },
    { id: id(), day_offset: 0, at_time: '15:00', what: 'Ceremony on the beach', owner_label: 'Karin Smit' },
    { id: id(), day_offset: 0, at_time: '18:30', what: 'Dinner in the pavilion', owner_role: 'CATERING' },
    { id: id(), day_offset: 0, at_time: '21:00', what: 'Opening dance, DJ still open', owner_role: 'DJ' },
    { id: id(), day_offset: 1, at_time: '01:00', what: 'Music stops, house rule', owner_label: 'Karin Smit' },
  ],
  'nora-wessel': [
    { id: id(), day_offset: 0, at_time: '13:00', what: 'Ceremony in the castle hall', owner_label: 'Elke Vermeulen' },
    { id: id(), day_offset: 0, at_time: '18:00', what: 'Seated dinner, five courses', owner_label: 'Annelies de Jong' },
    { id: id(), day_offset: 0, at_time: '20:45', what: 'Opening dance', owner_label: 'Daan Vermeer' },
    { id: id(), day_offset: 1, at_time: '01:30', what: 'Last song', owner_label: 'Daan Vermeer' },
  ],
  'femke-ruben': [
    { id: id(), day_offset: 0, at_time: '14:30', what: 'Ceremony in the glass house', owner_label: 'Sanne de Groot' },
    { id: id(), day_offset: 0, at_time: '17:00', what: 'Food trucks open in the garden', owner_label: 'Milan Petrović' },
    { id: id(), day_offset: 0, at_time: '21:00', what: 'Opening dance', owner_label: 'Yara Postma' },
    { id: id(), day_offset: 1, at_time: '01:00', what: 'Last song', owner_label: 'Yara Postma' },
  ],
}
