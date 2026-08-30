import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hov } from '../components/Hov'
import { c, family, mono } from '../theme'
import { tabFor } from '../data/directoryTabs'
import type { Vendor } from '../api/client'
import { useAssignRole, useCreateWedding, useUpdateWedding, useVendors, useWedding } from '../data/queries'
import type { Wedding } from '../api/client'
import { formatDateLong, parseDateInput } from '../format'

const fieldLabel = { font: mono(600, '8.5px'), letterSpacing: '.16em', color: c.muteSoft } as const
const rowLabel = { font: mono(600, '9px'), letterSpacing: '.14em', color: c.muteSoft } as const

const cardBase = {
  background: c.white,
  border: `1px solid ${c.line}`,
  borderRadius: 11,
  padding: '11px 14px',
} as const

const cardFocused = {
  background: c.white,
  border: `1.5px solid ${c.gold}`,
  borderRadius: 11,
  padding: '11px 14px',
  boxShadow: '0 0 0 4px rgba(176,141,87,.1)',
} as const

const rowFilled = {
  background: c.white,
  border: `1px solid ${c.line}`,
  borderRadius: 12,
  padding: '12px 16px',
} as const

const rowOpen = {
  background: c.cream,
  border: `1.5px dashed ${c.dash}`,
  borderRadius: 12,
  padding: '12px 16px',
} as const

/** '' is still open, 'none' is not needed, anything else is a vendor id. */
const NOT_NEEDED = 'none'

type Slot = { tab: string; label: string; role: string; prompt: string }


const slots: Slot[] = [
  {
    tab: 'locations',
    label: 'LOCATION',
    role: 'VENUE',
    prompt: 'Choose from your venues, or leave open for now…',
  },
  {
    tab: 'photographers',
    label: 'PHOTOGRAPHER',
    role: 'PHOTO',
    prompt: 'Choose from your photographers, or leave open for now…',
  },
  {
    tab: 'djs',
    label: 'DJ',
    role: 'DJ',
    prompt: 'Choose from your DJs, or leave open for now…',
  },
  {
    tab: 'catering',
    label: 'CATERING',
    role: 'CATERING',
    prompt: 'Choose from your eight caterers, or leave open for now…',
  },
]

/** Venues read better with their town, the way the mock writes them. */
function optionLabel(vendor: Vendor, slot: Slot) {
  if (slot.tab !== 'locations' || !vendor.place) return vendor.name
  const town = vendor.place[0] + vendor.place.slice(1).toLowerCase()
  return `${vendor.name}, ${town}`
}

function detailLine(vendor: Vendor) {
  const summary = (vendor.blurb ?? '').split('.')[0]
  // A vendor can be on file with a name and nothing else, which is how a
  // directory actually starts out.
  const lead = vendor.contacts[0]
  if (!lead) return summary
  // Solo vendors are their own contact, so do not print the name twice.
  const who = lead.name === vendor.name ? lead.phone : `${lead.name}, ${lead.phone}`
  return [summary, who].filter(Boolean).join(' · ')
}

function AssignRow({ slot, value, onChange }: { slot: Slot; value: string; onChange: (v: string) => void }) {
  const section = tabFor(slot.tab)
  const { data } = useVendors(section?.category)
  const vendors = data?.vendors ?? []
  const vendor = vendors.find((v) => v.id === value)
  const open = value === ''

  const status = open ? 'pick one' : value === NOT_NEEDED ? 'not needed' : 'assigned'

  return (
    <div className="rp-assign" style={open ? rowOpen : rowFilled}>
      <span className="rp-assign-role" style={rowLabel}>
        {slot.label}
      </span>
      <div className="rp-assign-body" style={{ minWidth: 0 }}>
        <select
          className={open ? 'rp-select rp-select--empty' : 'rp-select'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={slot.label.toLowerCase()}
        >
          <option value="">{slot.prompt}</option>
          <option value={NOT_NEEDED}>Not needed</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {optionLabel(v, slot)}
            </option>
          ))}
        </select>
        {vendor && <div style={{ marginTop: 1, fontSize: 11, color: c.mute }}>{detailLine(vendor)}</div>}
        {value === NOT_NEEDED && (
          <div style={{ marginTop: 1, fontSize: 11, color: c.mute }}>Not needed for this wedding.</div>
        )}
      </div>
      <span
        className="rp-assign-act rp-right"
        style={{ fontSize: 11.5, color: status === 'assigned' ? c.goldDeep : c.muteSoft }}
      >
        {status}
      </span>
    </div>
  )
}

/**
 * Screen 1c. Serves both `/weddings/new` and `/weddings/:id/edit`; the edit route
 * opens the same form with the wedding already filled in.
 */
export function NewWedding() {
  const { id } = useParams()
  const { data: editing, isPending } = useWedding(id)

  /*
    The form below seeds its fields from `editing` with useState initialisers,
    which run once. If it mounted while the wedding was still loading, every
    field would keep the empty value it started with and the edit screen would
    silently discard what it was meant to be editing.

    So the form is a separate component and does not mount until the data is
    there, keyed on the id so switching weddings remounts it rather than
    keeping the previous one's answers.
  */
  if (id && isPending) return <Loading />
  return <WeddingForm key={id ?? 'new'} editing={editing} />
}

function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.shell,
        fontFamily: family.sans,
        color: c.mute,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
      }}
    >
      Loading…
    </div>
  )
}

function WeddingForm({ editing }: { editing: Wedding | undefined }) {
  const navigate = useNavigate()

  const [couple, setCouple] = useState(editing ? editing.couple_display_name : 'Lisa & Tom')
  const [date, setDate] = useState(editing ? formatDateLong(editing.wedding_date) : '')
  const [guests, setGuests] = useState(editing ? String(editing.guest_count ?? '') : '150')
  const [dateFocused, setDateFocused] = useState(!editing)
  const [assigned, setAssigned] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      slots.map((s) => {
        // A new wedding starts with nothing assigned. These used to be
        // pre-filled with two vendors from the design mock, whose ids stopped
        // existing when the directory became real data.
        if (!editing) return [s.tab, '']
        const member = editing.team.find((m) => m.role === s.role)
        if (!member) return [s.tab, '']
        // The slot carries the vendor it was assigned to. This used to guess,
        // by checking whether the team member's name contained a vendor's name
        // — which quietly picked the wrong vendor whenever two of them shared a
        // contact, and picked none whenever a name was written differently.
        if (member.state === 'NOT_NEEDED') return [s.tab, NOT_NEEDED]
        return [s.tab, member.vendor_id ?? '']
      }),
    ),
  )

  const done = () => navigate(editing ? `/weddings/${editing.id}` : '/weddings')

  const createWedding = useCreateWedding()
  const updateWedding = useUpdateWedding(editing?.id ?? '')
  const assignRole = useAssignRole()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  /**
   * "Emma & Julian" into two people.
   *
   * The couple types one line because that is how they say it, but the access
   * code is built from both partners' initials, so the two names have to be
   * separable. An ampersand or the word "and" covers what people actually
   * write; anything else is stored as one partner and the planner can split it
   * on the detail screen rather than being blocked here.
   */
  function partnersFrom(display: string) {
    const halves = display.split(/\s+(?:&|and|\+)\s+/i).map((half) => half.trim())
    return halves
      .filter(Boolean)
      .slice(0, 2)
      .map((half, index) => ({
        kind: 'PARTNER' as const,
        given_name: half.split(/\s+/)[0],
        family_name: half.split(/\s+/).slice(1).join(' ') || null,
        sort_order: index + 1,
      }))
  }

  /**
   * Save, then assign whatever the selects say.
   *
   * The team is written after the wedding exists because each slot is its own
   * PUT — the contract models a role as a slot that is replaced, not as a field
   * on the wedding. A slot that fails does not lose the wedding.
   */
  async function save() {
    if (saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const isoDate = parseDateInput(date)
      if (!isoDate) {
        setSaveError('That date is not one we can read. Try 14 / 06 / 2027.')
        setSaving(false)
        return
      }
      const input = {
        couple_display_name: couple.trim(),
        wedding_date: isoDate,
        guest_count: guests.trim() ? Number(guests) : null,
        partners: partnersFrom(couple),
      }
      const saved = editing
        ? await updateWedding.mutateAsync(input)
        : await createWedding.mutateAsync(input)

      /*
        The wedding exists from here on, so a failing role must not read as a
        failed save. Assignments are collected and reported on the wedding
        itself rather than throwing the whole thing away — the alternative is
        an error screen next to a wedding that was, in fact, created.
      */
      const refused: string[] = []
      for (const slot of slots) {
        const value = assigned[slot.tab]
        if (!value) continue
        try {
          await assignRole.mutateAsync({
            weddingId: saved.id,
            role: slot.role,
            input:
              value === NOT_NEEDED
                ? { state: 'NOT_NEEDED' }
                : { state: 'PENCILLED', vendor_id: value },
          })
        } catch {
          refused.push(slot.label)
        }
      }
      if (refused.length > 0) {
        setSaveError(
          `Saved, but could not assign: ${refused.join(', ')}. ` +
            'Open the wedding and set those again.',
        )
        setSaving(false)
        return
      }
      navigate(`/weddings/${saved.id}`)
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught.message : 'Could not save this wedding.')
      setSaving(false)
    }
  }

  return (
    <div className="rp-shell-col" style={{ background: c.shell, fontFamily: family.sans, color: c.ink }}>
      <header className="rp-head-center rp-cap" style={{ flex: 'none', padding: '22px var(--rp-pad-x) 0' }}>
        <Hov
          as="span"
          onClick={done}
          style={{ fontSize: 12, color: c.mute, cursor: 'pointer' }}
          hover={{ color: c.inkSoft }}
        >
          {editing ? `← Back to ${editing.couple_display_name}` : '← Back to your weddings'}
        </Hov>
        <span style={{ font: mono(400, '10px'), color: c.muteFaint }}>draft saved ✓</span>
      </header>

      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'auto',
          padding: '18px var(--rp-pad-x) 0',
        }}
      >
        <div className="rp-form">
          <div
            style={{
              fontFamily: family.serif,
              fontSize: 'clamp(26px, 4vw, 33px)',
              fontWeight: 600,
              lineHeight: 1.15,
            }}
          >
            {editing ? 'Edit this wedding.' : 'A new wedding.'}
          </div>
          <div style={{ marginTop: 7, fontSize: 13, color: c.inkSoft }}>
            The couple, the date, the place. Assign vendors now or leave them open.
          </div>

          <div className="rp-form-top" style={{ marginTop: 18 }}>
            <div style={cardBase}>
              <div style={fieldLabel}>THE COUPLE</div>
              <input
                className="rp-field"
                style={{ marginTop: 4 }}
                value={couple}
                onChange={(e) => setCouple(e.target.value)}
                aria-label="The couple"
              />
            </div>
            <div className="rp-form-pair">
              <div style={dateFocused ? cardFocused : cardBase}>
                <div style={fieldLabel}>DATE</div>
                <input
                  className="rp-field"
                  style={{ marginTop: 4 }}
                  value={date}
                  autoFocus={!editing}
                  onFocus={() => setDateFocused(true)}
                  onBlur={() => setDateFocused(false)}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD / MM / YYYY"
                  aria-label="Date"
                />
              </div>
              <div style={cardBase}>
                <div style={fieldLabel}>GUESTS</div>
                <input
                  className="rp-field"
                  style={{ marginTop: 4 }}
                  value={guests}
                  inputMode="numeric"
                  onChange={(e) => setGuests(e.target.value.replace(/\D/g, ''))}
                  aria-label="Guests"
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, font: mono(600, '9.5px'), letterSpacing: '.2em', color: c.muteSoft }}>
            ASSIGN FROM YOUR DIRECTORY
          </div>

          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {slots.map((slot) => (
              <AssignRow
                key={slot.tab}
                slot={slot}
                value={assigned[slot.tab]}
                onChange={(v) => setAssigned((prev) => ({ ...prev, [slot.tab]: v }))}
              />
            ))}
          </div>

          {saveError && (
            <div
              role="alert"
              style={{ marginTop: 14, fontSize: 12.5, color: '#8a3c3c' }}
            >
              {saveError}
            </div>
          )}

          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Hov
              as="button"
              type="button"
              onClick={() => void save()}
              disabled={saving || !couple.trim() || !date.trim()}
              style={{
                border: 0,
                borderRadius: 999,
                background: c.ink,
                color: c.shell,
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                padding: '12px 26px',
                cursor: 'pointer',
              }}
              hover={{ background: c.inkHover }}
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create wedding'}
            </Hov>
            <Hov
              as="button"
              type="button"
              onClick={done}
              style={{
                border: `1px solid ${c.line}`,
                borderRadius: 999,
                background: c.white,
                color: c.inkSoft,
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                padding: '12px 26px',
                cursor: 'pointer',
              }}
              hover={{ borderColor: c.lineHover, color: c.ink }}
            >
              Save as draft
            </Hov>
          </div>
        </div>
      </main>

      <footer style={{ flex: 'none', padding: '14px var(--rp-pad-x) 18px' }} />
    </div>
  )
}
