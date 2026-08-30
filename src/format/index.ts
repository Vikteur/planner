/**
 * Every display string the planner shows, derived rather than stored.
 *
 * The screens used to read pre-baked strings straight out of the seed files —
 * `'IN 42 DAYS'`, `'Playlists: 6 of 6 lists in'`, `'20 SONGS'`. That worked
 * while the data was a transcription of a design mock and stops working the
 * moment it comes from an API, which returns a date and a count and has no
 * opinion about capitals.
 *
 * This module exists so that swap is one commit and not a rewrite of every
 * screen. Its tests assert the output is byte-identical to the strings the mock
 * shipped with, so the visual result is unchanged by construction.
 *
 * Dutch/Belgian weddings, English UI: months are English and dates are
 * day-first, matching the mock.
 */

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
] as const

/** The middle dot the mock separates clauses with. */
const DOT = ' · '

/**
 * An ISO date, split without going through Date.
 *
 * `new Date('2027-06-14')` is midnight UTC, which in a browser west of
 * Greenwich renders as the 13th. A wedding date is a calendar date, not an
 * instant, and the couple would notice.
 */
function parts(isoDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = isoDate.split('-').map(Number)
  return { year, month, day }
}

/** `'2027-06-14'` → `'14 JUN 2027'`. Day padded, as in the overview list. */
export function formatDateShort(isoDate: string): string {
  const { year, month, day } = parts(isoDate)
  return `${String(day).padStart(2, '0')} ${MONTHS[month - 1].slice(0, 3)} ${year}`
}

/** `'2027-06-14'` → `'14 JUNE 2027'`. Day unpadded, as in the detail header. */
export function formatDateLong(isoDate: string): string {
  const { year, month, day } = parts(isoDate)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

/**
 * `42` → `'IN 42 DAYS'`.
 *
 * The count is computed on the server, in the wedding's own timezone, so a
 * couple checking from another country sees the same number as their planner.
 * The last week is where a wrong number would actually be noticed, so today and
 * tomorrow get their own words.
 */
export function formatCountdown(daysUntil: number): string {
  if (daysUntil < 0) return 'PAST'
  if (daysUntil === 0) return 'TODAY'
  if (daysUntil === 1) return 'TOMORROW'
  return `IN ${daysUntil} DAYS`
}

/** `'14 JUNE 2027 · IN 42 DAYS'` — the detail screen's header line. */
export function formatDateLine(isoDate: string, daysUntil: number): string {
  return `${formatDateLong(isoDate)}${DOT}${formatCountdown(daysUntil)}`
}

/**
 * `'Playlists: 6 of 6 lists in'`, or `'Playlists: not started'` at zero.
 *
 * Zero is worth its own sentence: "0 of 6" reads as a problem, and a couple who
 * simply has not opened their link yet is not a problem.
 */
export function formatPlaylistsLine(listsIn: number, listsTotal: number): string {
  if (listsIn === 0) return 'Playlists: not started'
  return `Playlists: ${listsIn} of ${listsTotal} lists in`
}

/** `'THEIR MUSIC · 6 OF 6 LISTS IN'`, and its two special cases. */
export function formatMusicHeading(
  listsIn: number,
  listsTotal: number,
  archived = false,
): string {
  if (archived) return `THEIR MUSIC${DOT}ARCHIVED`
  if (listsIn === 0) return `THEIR MUSIC${DOT}NOT STARTED`
  return `THEIR MUSIC${DOT}${listsIn} OF ${listsTotal} LISTS IN`
}

/**
 * `'20 SONGS'`, `'1 SONG'`, or `'WAITING'`.
 *
 * `null` and `0` are different answers. A list the couple deliberately left
 * empty — no never-list, say — is submitted and reads as `0 SONGS`; one they
 * have not reached yet is `WAITING`. Collapsing them would make "6 of 6 lists
 * in" unreachable for a couple who wants nothing banned.
 */
export function formatSongCount(songCount: number | null): string {
  if (songCount === null) return 'WAITING'
  return songCount === 1 ? '1 SONG' : `${songCount} SONGS`
}

/**
 * A song list's count, as the detail screen shows it.
 *
 * The API sends `state` and `song_count` separately, and the difference between
 * them is the point: a WAITING list reads `WAITING`, and a submitted list with
 * nothing in it reads `0 SONGS`.
 */
export function formatListCount(state: string, songCount: number): string {
  return state === 'WAITING' ? formatSongCount(null) : formatSongCount(songCount)
}

/**
 * A team slot as one name: `'Petra Willems · Smaakmakers'`.
 *
 * The person comes first, because that is who gets phoned.
 */
export function formatTeamName(
  contactName: string | null | undefined,
  vendorName: string | null | undefined,
  personName: string | null | undefined,
): string {
  const who = contactName || personName || ''
  if (who && vendorName) return `${who}${DOT}${vendorName}`
  return who || vendorName || ''
}

/**
 * `'ceremony 13:30, opening dance 20:30'` — the times a wedding actually turns
 * on, in the order they happen.
 *
 * Each clause appears only when its time is known, which is what makes
 * `'ceremony 15:00, music stops 01:00'` fall out of the same function: that
 * wedding has a venue curfew and no first dance recorded, not a different
 * format.
 */
export function formatCeremonyLine(
  ceremonyTime: string | null,
  firstDanceTime: string | null,
  musicEndsTime: string | null,
): string {
  const clauses: string[] = []
  if (ceremonyTime) clauses.push(`ceremony ${ceremonyTime}`)
  if (firstDanceTime) clauses.push(`opening dance ${firstDanceTime}`)
  if (musicEndsTime) clauses.push(`music stops ${musicEndsTime}`)
  return clauses.join(', ')
}

/**
 * The detail screen's one-line summary.
 *
 * A finished wedding says so instead of listing times nobody is going to act
 * on again.
 */
export function formatSummary(
  venue: string | null,
  guests: number | null,
  times: string,
  archived = false,
): string {
  const clauses: string[] = []
  if (venue) clauses.push(venue)
  if (guests !== null) clauses.push(`${guests} guests`)
  const tail = archived ? 'archived' : times
  if (tail) clauses.push(tail)
  return clauses.join(DOT)
}

/** `'12 WEDDINGS PLANNED THIS YEAR · 2 NEED A VENDOR'`. */
export function formatOverviewFooter(plannedThisYear: number, needAVendor: number): string {
  const planned = `${plannedThisYear} WEDDING${plannedThisYear === 1 ? '' : 'S'} PLANNED THIS YEAR`
  return `${planned}${DOT}${needAVendor} NEED${needAVendor === 1 ? 'S' : ''} A VENDOR`
}

/**
 * A venue as one line: `'De Oude Tuinderij, Aalsmeer'`.
 *
 * The API keeps the name and the town apart, because a directory has to search
 * and sort on them separately. Every screen that shows a venue wants them
 * joined, so the joining lives here rather than in each screen.
 */
export function venueLine(venue: { name: string; place?: string | null } | null | undefined): string {
  if (!venue) return ''
  return venue.place ? venue.name + ', ' + venue.place : venue.name
}

/**
 * The date field, back into an ISO date. `null` when it is not a date yet.
 *
 * The field's placeholder promises `DD / MM / YYYY` and it is day-first
 * everywhere this product is used, so 06/07/2027 is July, never June. It also
 * accepts what `formatDateLong` produces, because the edit screen fills the
 * field with exactly that and re-saving must not corrupt the date.
 *
 * Deliberately not `new Date(text)`: that parses 06/07/2027 as the sixth of
 * July in an American locale and silently moves a wedding by a month.
 */
export function parseDateInput(text: string): string | null {
  const clean = (text ?? '').trim()
  if (!clean) return null

  const iso = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) return valid(+iso[1], +iso[2], +iso[3])

  const numeric = clean.match(/^(\d{1,2})\s*[\/.\- ]\s*(\d{1,2})\s*[\/.\- ]\s*(\d{4})$/)
  if (numeric) return valid(+numeric[3], +numeric[2], +numeric[1])

  const named = clean.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
  if (named) {
    // The typed word has to be a prefix of the month, not merely share its
    // first three letters — otherwise "Junetime" is accepted as June.
    const word = named[2].toUpperCase()
    const month = MONTHS.findIndex((name) => word.length >= 3 && name.startsWith(word))
    if (month >= 0) return valid(+named[3], month + 1, +named[1])
  }
  return null
}

/** Rejects the 31st of February rather than rolling it into March. */
function valid(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1) return null
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  if (day > daysInMonth) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}`
}
