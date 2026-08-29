import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hov } from '../components/Hov'
import { c, family, mono } from '../theme'
import { tabFor } from '../data/directory'
import type { Vendor } from '../data/directory'
import { weddingDetails } from '../data/weddingDetail'

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

type Slot = { tab: string; label: string; role: string; prompt: string; initial: string }

const slots: Slot[] = [
  {
    tab: 'locations',
    label: 'LOCATION',
    role: 'VENUE',
    prompt: 'Choose from your venues, or leave open for now…',
    initial: 'strandpaviljoen-zuid',
  },
  {
    tab: 'photographers',
    label: 'PHOTOGRAPHER',
    role: 'PHOTO',
    prompt: 'Choose from your photographers, or leave open for now…',
    initial: 'merel-jansen',
  },
  {
    tab: 'djs',
    label: 'DJ',
    role: 'DJ',
    prompt: 'Choose from your DJs, or leave open for now…',
    initial: '',
  },
  {
    tab: 'catering',
    label: 'CATERING',
    role: 'CATERING',
    prompt: 'Choose from your eight caterers, or leave open for now…',
    initial: '',
  },
]

/** Venues read better with their town, the way the mock writes them. */
function optionLabel(vendor: Vendor, slot: Slot) {
  if (slot.tab !== 'locations') return vendor.name
  const town = vendor.place[0] + vendor.place.slice(1).toLowerCase()
  return `${vendor.name}, ${town}`
}

function detailLine(vendor: Vendor) {
  const summary = vendor.blurb.split('.')[0]
  const lead = vendor.contacts[0]
  // Solo vendors are their own contact, so do not print the name twice.
  return lead.name === vendor.name ? `${summary} · ${lead.phone}` : `${summary} · ${lead.name}, ${lead.phone}`
}

/** A team member is stored by person, so match back to the vendor they belong to. */
function vendorIdFor(tab: string, teamName: string) {
  const hit = tabFor(tab).vendors.find(
    (v) => teamName.includes(v.name) || v.contacts.some((p) => teamName.includes(p.name)),
  )
  return hit?.id ?? ''
}

function AssignRow({ slot, value, onChange }: { slot: Slot; value: string; onChange: (v: string) => void }) {
  const section = tabFor(slot.tab)
  const vendor = section.vendors.find((v) => v.id === value)
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
          {section.vendors.map((v) => (
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
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = id ? weddingDetails[id] : undefined

  const [couple, setCouple] = useState(editing ? editing.couple : 'Lisa & Tom')
  const [date, setDate] = useState(editing ? editing.dateLine.split(' · ')[0] : '')
  const [guests, setGuests] = useState(editing ? (editing.summary.match(/(\d+) guests/)?.[1] ?? '') : '150')
  const [dateFocused, setDateFocused] = useState(!editing)
  const [assigned, setAssigned] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      slots.map((s) => {
        if (!editing) return [s.tab, s.initial]
        const member = editing.team.find((m) => m.role === s.role)
        return [s.tab, member ? vendorIdFor(s.tab, member.name) : '']
      }),
    ),
  )

  const done = () => navigate(editing ? `/weddings/${editing.id}` : '/weddings')

  return (
    <div className="rp-shell-col" style={{ background: c.shell, fontFamily: family.sans, color: c.ink }}>
      <header className="rp-head-center rp-cap" style={{ flex: 'none', padding: '22px var(--rp-pad-x) 0' }}>
        <Hov
          as="span"
          onClick={done}
          style={{ fontSize: 12, color: c.mute, cursor: 'pointer' }}
          hover={{ color: c.inkSoft }}
        >
          {editing ? `← Back to ${editing.couple}` : '← Back to your weddings'}
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

          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Hov
              as="button"
              type="button"
              onClick={done}
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
              {editing ? 'Save changes' : 'Create wedding'}
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
