import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Hov } from '../components/Hov'
import { ContactActions } from '../components/ContactActions'
import { c, family, mono } from '../theme'
import { directory, directoryFooter } from '../data/directory'
import type { Contact, Vendor } from '../data/directory'

function ContactRow({ contact, first }: { contact: Contact; first: boolean }) {
  return (
    <div
      className="rp-contact"
      style={
        first
          ? { marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.lineSoft}` }
          : { marginTop: 8 }
      }
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{contact.name}</div>
        <div style={{ marginTop: 1, font: mono(400, '9px'), letterSpacing: '.08em', color: c.muteSoft }}>
          {contact.role}
        </div>
      </div>
      <span style={{ font: mono(500, '11.5px'), color: c.inkSoft }}>{contact.phone}</span>
      <ContactActions name={contact.name} email={contact.email} phone={contact.phone} />
    </div>
  )
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div
      style={{
        position: 'relative',
        background: c.white,
        border: `1px solid ${c.line}`,
        borderRadius: 13,
        padding: '16px 18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>{vendor.name}</span>
        <span style={{ font: mono(400, '9.5px'), color: c.muteFaint }}>{vendor.place}</span>
      </div>
      <div style={{ marginTop: 3, fontSize: 11.5, color: c.mute }}>{vendor.blurb}</div>
      {vendor.contacts.map((contact, i) => (
        <ContactRow key={contact.name} contact={contact} first={i === 0} />
      ))}
    </div>
  )
}

export function VendorDirectory() {
  const { tab } = useParams()
  const [query, setQuery] = useState('')
  const section = directory.find((d) => d.key === tab)

  const vendors = useMemo(() => {
    if (!section) return []
    const q = query.trim().toLowerCase()
    if (!q) return section.vendors
    return section.vendors.filter((v) =>
      [v.name, v.place, v.blurb, ...v.contacts.flatMap((p) => [p.name, p.role, p.phone, p.email])]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [section, query])

  if (!section) return <Navigate to="/catering" replace />

  return (
    <div className="rp-shell" style={{ background: c.shell, fontFamily: family.sans, color: c.ink }}>
      <Sidebar />

      <div className="rp-pane">
        <header className="rp-head rp-cap" style={{ flex: 'none', padding: '26px var(--rp-pad-x) 0' }}>
          <div>
            <div
              style={{
                fontFamily: family.serif,
                fontSize: 'clamp(26px, 4vw, 32px)',
                fontWeight: 600,
                lineHeight: 1.12,
              }}
            >
              {section.title}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: c.inkSoft }}>{section.subtitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 auto', justifyContent: 'flex-end' }}>
            <div
              className="rp-search-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: c.white,
                border: `1px solid ${c.line}`,
                borderRadius: 999,
                padding: '9px 15px',
              }}
            >
              <span style={{ color: c.gold, fontSize: 13, lineHeight: 1 }}>⌕</span>
              <input
                className="rp-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={section.search}
                aria-label={section.search}
                style={{ flex: 1, minWidth: 0 }}
              />
            </div>
            <Hov
              as="button"
              type="button"
              style={{
                border: 0,
                borderRadius: 999,
                background: c.ink,
                color: c.shell,
                fontFamily: 'inherit',
                fontSize: 12.5,
                fontWeight: 600,
                padding: '10px 20px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              hover={{ background: c.inkHover }}
            >
              {section.add}
            </Hov>
          </div>
        </header>

        <main
          className="rp-cap"
          style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '20px var(--rp-pad-x) 0' }}
        >
          <div className="rp-cards">
            {vendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
            <div
              style={{
                boxSizing: 'border-box',
                border: `1px dashed ${c.dashSoft}`,
                borderRadius: 13,
                padding: '16px 18px',
                fontSize: 12,
                color: c.mute,
                lineHeight: 1.55,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {section.note}{' '}
              <span style={{ marginTop: 4, color: c.goldDeep, cursor: 'pointer' }}>{section.noteLink}</span>
            </div>
          </div>
        </main>

        <footer
          className="rp-cap"
          style={{
            flex: 'none',
            padding: '14px var(--rp-pad-x) 18px',
            font: mono(400, '10px'),
            letterSpacing: '.1em',
            color: c.muteFaint,
          }}
        >
          {directoryFooter}
        </footer>
      </div>
    </div>
  )
}
