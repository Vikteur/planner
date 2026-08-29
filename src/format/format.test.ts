import { describe, expect, it } from 'vitest'
import {
  formatCeremonyLine,
  formatCountdown,
  formatDateLine,
  formatDateLong,
  formatDateShort,
  formatListCount,
  formatMusicHeading,
  formatOverviewFooter,
  formatPlaylistsLine,
  formatSongCount,
  formatSummary,
  formatTeamName,
} from './index'
import { overviewCounts, past, upcoming, venueLine } from '../data/planner'
import { weddingDetails } from '../data/weddingDetail'

/**
 * The formatters reproduce the design mock exactly.
 *
 * Every expected string below shipped in the original transcription, when the
 * seed files stored finished text instead of facts. They are written out as
 * literals here because that is what they are: a record of what the screens
 * said before this layer existed. If one of these changes, the UI changed —
 * which is a decision, not a refactor.
 */
describe('the strings the mock shipped with', () => {
  it('renders the overview rows', () => {
    expect(formatDateShort('2027-06-14')).toBe('14 JUN 2027')
    expect(formatDateShort('2027-07-03')).toBe('03 JUL 2027')
    expect(formatDateShort('2027-08-21')).toBe('21 AUG 2027')
    expect(formatDateShort('2026-05-02')).toBe('02 MAY 2026')
    expect(formatDateShort('2026-04-18')).toBe('18 APR 2026')

    expect(formatCountdown(42)).toBe('IN 42 DAYS')
    expect(formatCountdown(61)).toBe('IN 61 DAYS')
    expect(formatCountdown(110)).toBe('IN 110 DAYS')
    expect(formatCountdown(-1)).toBe('PAST')
  })

  it('renders the detail headers', () => {
    expect(formatDateLine('2027-06-14', 42)).toBe('14 JUNE 2027 · IN 42 DAYS')
    expect(formatDateLine('2027-07-03', 61)).toBe('3 JULY 2027 · IN 61 DAYS')
    expect(formatDateLine('2027-08-21', 110)).toBe('21 AUGUST 2027 · IN 110 DAYS')
    expect(formatDateLine('2026-05-02', -1)).toBe('2 MAY 2026 · PAST')
    expect(formatDateLine('2026-04-18', -1)).toBe('18 APRIL 2026 · PAST')
  })

  it('renders the playlist progress line for all three states', () => {
    expect(formatPlaylistsLine(6, 6)).toBe('Playlists: 6 of 6 lists in')
    expect(formatPlaylistsLine(3, 6)).toBe('Playlists: 3 of 6 lists in')
    // Zero gets its own sentence: "0 of 6" reads as a problem, and a couple
    // who has not opened their link yet is not a problem.
    expect(formatPlaylistsLine(0, 6)).toBe('Playlists: not started')
  })

  it('renders every music heading', () => {
    expect(formatMusicHeading(6, 6)).toBe('THEIR MUSIC · 6 OF 6 LISTS IN')
    expect(formatMusicHeading(3, 6)).toBe('THEIR MUSIC · 3 OF 6 LISTS IN')
    expect(formatMusicHeading(0, 6)).toBe('THEIR MUSIC · NOT STARTED')
    expect(formatMusicHeading(6, 6, true)).toBe('THEIR MUSIC · ARCHIVED')
  })

  it('renders every song count', () => {
    expect(formatSongCount(1)).toBe('1 SONG')
    expect(formatSongCount(2)).toBe('2 SONGS')
    expect(formatSongCount(20)).toBe('20 SONGS')
    expect(formatSongCount(null)).toBe('WAITING')
  })

  it('renders the summary lines', () => {
    expect(
      formatSummary(
        'De Oude Tuinderij, Aalsmeer', 120,
        formatCeremonyLine('13:30', '20:30', null),
      ),
    ).toBe('De Oude Tuinderij, Aalsmeer · 120 guests · ceremony 13:30, opening dance 20:30')

    // Same function, different facts: a venue curfew and no first dance.
    expect(
      formatSummary(
        'Strandpaviljoen Zuid, Bloemendaal', 150,
        formatCeremonyLine('15:00', null, '01:00'),
      ),
    ).toBe('Strandpaviljoen Zuid, Bloemendaal · 150 guests · ceremony 15:00, music stops 01:00')

    expect(
      formatSummary('Kasteel Wijenburg, Echteld', 95, formatCeremonyLine(null, null, null), true),
    ).toBe('Kasteel Wijenburg, Echteld · 95 guests · archived')
  })

  it('renders the team names', () => {
    expect(formatTeamName('Petra Willems', 'Smaakmakers', null))
      .toBe('Petra Willems · Smaakmakers')
    expect(formatTeamName('Daan Vermeer', null, null)).toBe('Daan Vermeer')
    // The MC is a friend of the groom, not a booked vendor.
    expect(formatTeamName(null, null, 'Tim Bakker')).toBe('Tim Bakker')
  })

  it('renders the overview footer', () => {
    expect(formatOverviewFooter(12, 2)).toBe('12 WEDDINGS PLANNED THIS YEAR · 2 NEED A VENDOR')
    expect(formatOverviewFooter(overviewCounts.plannedThisYear, overviewCounts.needAVendor))
      .toBe('12 WEDDINGS PLANNED THIS YEAR · 2 NEED A VENDOR')
  })
})

describe('against the seed data, which now holds facts rather than strings', () => {
  it('produces the mock text for every seeded wedding', () => {
    const expected: Record<string, { short: string; line: string; lists: string }> = {
      'emma-julian': {
        short: '14 JUN 2027',
        line: '14 JUNE 2027 · IN 42 DAYS',
        lists: 'Playlists: 6 of 6 lists in',
      },
      'sofie-mark': {
        short: '03 JUL 2027',
        line: '3 JULY 2027 · IN 61 DAYS',
        lists: 'Playlists: 3 of 6 lists in',
      },
      'lisa-tom': {
        short: '21 AUG 2027',
        line: '21 AUGUST 2027 · IN 110 DAYS',
        lists: 'Playlists: not started',
      },
    }
    for (const wedding of upcoming) {
      const want = expected[wedding.slug]
      expect(formatDateShort(wedding.wedding_date), wedding.slug).toBe(want.short)
      expect(
        formatPlaylistsLine(wedding.music.lists_in, wedding.music.lists_total),
        wedding.slug,
      ).toBe(want.lists)

      const detail = weddingDetails[wedding.slug]
      expect(formatDateLine(detail.wedding_date, detail.days_until ?? 0), wedding.slug)
        .toBe(want.line)
    }
    for (const wedding of past) {
      expect(formatCountdown(wedding.days_until ?? 0), wedding.slug).toBe('PAST')
    }
  })

  it('renders the first wedding detail exactly as the mock did', () => {
    const w = weddingDetails['emma-julian']
    expect(
      formatSummary(
        venueLine(w.venue), w.guest_count ?? null,
        formatCeremonyLine(w.ceremony_time ?? null, w.first_dance_time ?? null, w.music_ends_time ?? null),
      ),
    ).toBe('De Oude Tuinderij, Aalsmeer · 120 guests · ceremony 13:30, opening dance 20:30')

    expect(formatMusicHeading(w.music.lists_in, w.music.lists_total))
      .toBe('THEIR MUSIC · 6 OF 6 LISTS IN')
    expect(w.song_lists.map((l) => formatListCount(l.state, l.song_count)))
      .toEqual(['1 SONG', '2 SONGS', '20 SONGS', '17 SONGS', '2 SONGS', '3 SONGS'])
  })

  it('shows WAITING only for lists the couple has not reached', () => {
    const sofie = weddingDetails['sofie-mark']
    expect(sofie.song_lists.map((l) => formatListCount(l.state, l.song_count)))
      .toEqual(['1 SONG', 'WAITING', '14 SONGS', 'WAITING', 'WAITING', '2 SONGS'])

    const lisa = weddingDetails['lisa-tom']
    expect(lisa.song_lists.every((l) => formatListCount(l.state, l.song_count) === 'WAITING'))
      .toBe(true)
  })

  it('carries no song titles anywhere in the planner data', () => {
    // The screen this feeds says "Read only. The music stays between couple and
    // DJ", and the mock contradicted it with a preview of real titles. The API
    // has no field for one; neither does this.
    const serialised = JSON.stringify(weddingDetails)
    for (const title of ['Dreams', 'September', 'Macarena', 'Purple Rain', 'Elvis']) {
      expect(serialised, title).not.toContain(title)
    }
  })
})

describe('the cases the mock never showed', () => {
  it('names today and tomorrow rather than counting them', () => {
    expect(formatCountdown(0)).toBe('TODAY')
    expect(formatCountdown(1)).toBe('TOMORROW')
    expect(formatCountdown(2)).toBe('IN 2 DAYS')
    expect(formatCountdown(-400)).toBe('PAST')
  })

  it('keeps a submitted empty list distinct from an unopened one', () => {
    // A couple who wants nothing banned has finished their never list. If this
    // said WAITING they could never reach "6 of 6 lists in".
    expect(formatListCount('SUBMITTED', 0)).toBe('0 SONGS')
    expect(formatListCount('WAITING', 0)).toBe('WAITING')
  })

  it('does not shift a date across a timezone boundary', () => {
    // new Date('2027-01-01') is midnight UTC, which renders as 31 December
    // anywhere west of Greenwich. A wedding date is a calendar date.
    expect(formatDateShort('2027-01-01')).toBe('01 JAN 2027')
    expect(formatDateLong('2027-01-01')).toBe('1 JANUARY 2027')
    expect(formatDateShort('2027-12-31')).toBe('31 DEC 2027')
  })

  it('drops clauses it has no data for rather than printing blanks', () => {
    expect(formatSummary('A Venue', null, '')).toBe('A Venue')
    expect(formatSummary(null, 80, '', true)).toBe('80 guests · archived')
    expect(formatCeremonyLine('13:30', null, null)).toBe('ceremony 13:30')
    expect(formatCeremonyLine(null, null, null)).toBe('')
    expect(formatCeremonyLine('13:30', '20:30', '01:00'))
      .toBe('ceremony 13:30, opening dance 20:30, music stops 01:00')
    expect(formatTeamName(null, null, null)).toBe('')
  })

  it('gets its singulars right', () => {
    expect(formatOverviewFooter(1, 1)).toBe('1 WEDDING PLANNED THIS YEAR · 1 NEEDS A VENDOR')
  })
})
