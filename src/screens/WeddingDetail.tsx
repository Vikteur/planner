import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Hov } from '../components/Hov'
import { ContactActions } from '../components/ContactActions'
import { c, family, mono } from '../theme'
import { musicFootnote, weddingDetails, weddingTimelines } from '../data/weddingDetail'
import { venueLine } from '../data/planner'
import {
  formatCeremonyLine,
  formatDateLine,
  formatListCount,
  formatMusicHeading,
  formatSummary,
  formatTeamName,
} from '../format'

/** A role used as a stand-in owner, as the mock wrote it: "DJ open". */
const ROLE_LABEL: Record<string, string> = {
  VENUE: 'Venue', DJ: 'DJ', CATERING: 'Caterer', PHOTO: 'Photographer', MC: 'MC', OTHER: 'Someone',
}

const sectionLabel = { font: mono(600, '9.5px'), letterSpacing: '.2em', color: c.muteSoft } as const
const rowLabel = { font: mono(600, '8.5px'), letterSpacing: '.14em', color: c.muteSoft } as const
const phone = { font: mono(500, '11px'), color: c.inkSoft } as const

const tabBase = { borderRadius: 999, padding: '6px 15px', fontSize: 11.5, cursor: 'pointer' } as const

export function WeddingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'event' | 'schema'>('event')
  const [copied, setCopied] = useState(false)

  const w = id ? weddingDetails[id] : undefined
  if (!w) return <Navigate to="/weddings" replace />

  const archived = w.status === 'COMPLETED'
  const timeline = weddingTimelines[id!] ?? []

  return (
    <div className="rp-shell-col" style={{ background: c.shell, fontFamily: family.sans, color: c.ink }}>
      <header className="rp-head-center rp-cap" style={{ flex: 'none', padding: '20px var(--rp-pad-x) 0' }}>
        <Hov
          as="span"
          onClick={() => navigate('/weddings')}
          style={{ fontSize: 12, color: c.mute, cursor: 'pointer' }}
          hover={{ color: c.inkSoft }}
        >
          ← Your weddings
        </Hov>
        <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ font: mono(400, '10px'), color: c.muteFaint }}>
            {formatDateLine(w.wedding_date, w.days_until ?? 0)}
          </span>
          <Hov
            as="button"
            type="button"
            onClick={() => navigate(`/weddings/${w.slug}/edit`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              border: `1px solid ${c.line}`,
              borderRadius: 999,
              background: c.white,
              color: c.inkSoft,
              fontFamily: 'inherit',
              fontSize: 11.5,
              fontWeight: 600,
              padding: '5px 14px',
              cursor: 'pointer',
            }}
            hover={{ borderColor: c.lineHover, color: c.ink }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M11.4 2.2a1.4 1.4 0 0 1 2 2l-7 7-2.7.7.7-2.7 7-7Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M2.5 14h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Edit
          </Hov>
        </span>
      </header>

      <div className="rp-head rp-cap" style={{ flex: 'none', padding: '14px var(--rp-pad-x) 0' }}>
        <div>
          <div
            style={{
              fontFamily: family.serif,
              fontStyle: 'italic',
              fontSize: 'clamp(26px, 4vw, 33px)',
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {w.couple_display_name}
          </div>
          <div style={{ marginTop: 5, fontSize: 12.5, color: c.inkSoft }}>
            {formatSummary(
              venueLine(w.venue),
              w.guest_count ?? null,
              formatCeremonyLine(
                w.ceremony_time ?? null,
                w.first_dance_time ?? null,
                w.music_ends_time ?? null,
              ),
              archived,
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {tab === 'event' ? (
            <span style={{ ...tabBase, background: c.ink, color: c.shell, fontWeight: 600 }}>The event</span>
          ) : (
            <Hov
              as="span"
              onClick={() => setTab('event')}
              style={{ ...tabBase, border: `1px solid ${c.line}`, background: c.white, color: c.inkSoft }}
              hover={{ borderColor: c.lineHover, color: c.ink }}
            >
              The event
            </Hov>
          )}
          {tab === 'schema' ? (
            <span style={{ ...tabBase, background: c.ink, color: c.shell, fontWeight: 600 }}>Schema of the day</span>
          ) : (
            <Hov
              as="span"
              onClick={() => setTab('schema')}
              style={{ ...tabBase, border: `1px solid ${c.line}`, background: c.white, color: c.inkSoft }}
              hover={{ borderColor: c.lineHover, color: c.ink }}
            >
              Schema of the day
            </Hov>
          )}
        </div>
      </div>

      {tab === 'event' ? (
        <main
          className="rp-detail rp-cap"
          style={{ flex: 1, minHeight: 0, padding: '16px var(--rp-pad-x) 0', overflow: 'auto' }}
        >
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={sectionLabel}>THE TEAM ON THE DAY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {w.team.map((m) => (
                <div
                  key={m.role}
                  className="rp-team"
                  style={{
                    background: c.white,
                    border: `1px solid ${c.line}`,
                    borderRadius: 11,
                    padding: '11px 15px',
                  }}
                >
                  <span className="rp-team-role" style={rowLabel}>
                    {m.role}
                  </span>
                  <div className="rp-team-body" style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      {formatTeamName(m.contact_name, m.vendor_name, m.person_name)}
                    </div>
                    <div style={{ fontSize: 10.5, color: c.mute }}>{m.note}</div>
                  </div>
                  <span className="rp-team-phone rp-right" style={phone}>
                    {m.phone}
                  </span>
                  <ContactActions
                    className="rp-team-actions"
                    name={formatTeamName(m.contact_name, m.vendor_name, m.person_name)}
                    email={m.email ?? ''}
                    phone={m.phone ?? ''}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 6, ...sectionLabel }}>THE COUPLE</div>

            <div className="rp-pair">
              {w.people.map((p) => (
                <div
                  key={p.id}
                  className="rp-person"
                  style={{
                    background: c.white,
                    border: `1px solid ${c.line}`,
                    borderRadius: 11,
                    padding: '11px 15px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      {[p.given_name, p.family_name].filter(Boolean).join(' ')}
                    </div>
                    <div style={{ fontSize: 10.5, color: c.mute }}>{p.note}</div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
                    <span style={phone}>{p.phone}</span>
                    <ContactActions
                      name={[p.given_name, p.family_name].filter(Boolean).join(' ')}
                      email={p.email ?? ''}
                      phone={p.phone ?? ''}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={sectionLabel}>
              {formatMusicHeading(w.music.lists_in, w.music.lists_total, archived)}
            </div>
            <div
              style={{
                marginTop: 10,
                flex: 1,
                minHeight: 0,
                background: c.white,
                border: `1px solid ${c.line}`,
                borderRadius: 13,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                overflow: 'auto',
              }}
            >
              {w.song_lists.map((p, i) => (
                <div
                  key={p.kind}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 2px',
                    ...(i < w.song_lists.length - 1 ? { borderBottom: `1px solid ${c.lineSoft}` } : null),
                  }}
                >
                  {/*
                    No preview of song titles here, deliberately. The footnote
                    under this list has always said the music stays between the
                    couple and their DJ; the API has no field to put one in.
                  */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.label}</div>
                  </div>
                  <span style={{ font: mono(400, '9px'), color: c.muteFaint }}>
                    {formatListCount(p.state, p.song_count)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 10,
                  borderTop: `1px solid ${c.lineSoft}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 11, color: c.mute }}>{musicFootnote}</span>
                <Hov
                  as="span"
                  style={{ fontSize: 11.5, color: c.goldDeep, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  hover={{ color: c.inkSoft }}
                >
                  open all lists →
                </Hov>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="rp-cap" style={{ flex: 1, minHeight: 0, padding: '16px var(--rp-pad-x) 0', overflow: 'auto' }}>
          <div style={sectionLabel}>SCHEMA OF THE DAY</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {timeline.map((s) => (
              <div
                key={s.id}
                className="rp-schema"
                style={{
                  background: c.white,
                  border: `1px solid ${c.line}`,
                  borderRadius: 11,
                  padding: '11px 15px',
                }}
              >
                <span className="rp-schema-time" style={{ font: mono(500, '12px'), color: c.goldDeep }}>
                  {s.at_time}
                </span>
                <span className="rp-schema-what" style={{ fontSize: 13, fontWeight: 600 }}>
                  {s.what}
                </span>
                <span className="rp-schema-who rp-right" style={{ fontSize: 11, color: c.mute }}>
                  {s.owner_label ??
                    (s.owner_role ? `${ROLE_LABEL[s.owner_role] ?? s.owner_role} open` : '')}
                </span>
              </div>
            ))}
          </div>
        </main>
      )}

      <footer className="rp-detail-foot rp-cap" style={{ flex: 'none', padding: '14px var(--rp-pad-x) 18px' }}>
        <div
          className="rp-share"
          style={{
            background: c.cream,
            border: `1px solid ${c.lineCream}`,
            borderRadius: 11,
            padding: '10px 15px',
          }}
        >
          <span style={rowLabel}>THEIR PAGE</span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              font: mono(500, '11.5px'),
              color: c.goldDeep,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {w.portal?.url ?? ''}
          </span>
          <span
            onClick={() => {
              void navigator.clipboard?.writeText(`https://${w.portal?.url ?? ''}`)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1600)
            }}
            style={{
              borderRadius: 999,
              background: c.goldWashStrong,
              color: c.goldDeep,
              padding: '3px 10px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.06em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? 'COPIED' : 'COPY LINK'}
          </span>
          <span style={{ fontSize: 11, color: c.mute }}>made when you created this wedding</span>
        </div>
      </footer>
    </div>
  )
}
