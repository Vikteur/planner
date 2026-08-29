import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Hov } from '../components/Hov'
import { c, family, mono } from '../theme'
import { overviewFooter, overviewSubtitle, past, upcoming } from '../data/planner'
import type { Tag } from '../data/planner'

const label = { font: mono(600, '9.5px'), letterSpacing: '.2em' } as const

function TagPill({ tag }: { tag: Tag }) {
  return tag.confirmed ? (
    <span
      style={{
        borderRadius: 999,
        background: c.goldWash,
        color: c.goldDeep,
        padding: '3px 10px',
        fontSize: 10.5,
        fontWeight: 600,
      }}
    >
      {tag.label} ✓
    </span>
  ) : (
    <span
      style={{
        borderRadius: 999,
        border: `1px dashed ${c.dash}`,
        color: c.muteSoft,
        padding: '3px 10px',
        fontSize: 10.5,
        fontWeight: 600,
      }}
    >
      {tag.label}?
    </span>
  )
}

export function WeddingsOverview() {
  const navigate = useNavigate()

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
              Your weddings.
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: c.inkSoft }}>{overviewSubtitle}</div>
          </div>
          <Hov
            as="button"
            type="button"
            onClick={() => navigate('/weddings/new')}
            style={{
              border: 0,
              borderRadius: 999,
              background: c.ink,
              color: c.shell,
              fontFamily: 'inherit',
              fontSize: 12.5,
              fontWeight: 600,
              padding: '11px 22px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            hover={{ background: c.inkHover }}
          >
            + New wedding
          </Hov>
        </header>

        <main
          className="rp-cap"
          style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '20px var(--rp-pad-x) 0' }}
        >
          <div style={{ ...label, color: c.muteSoft }}>UPCOMING</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {upcoming.map((w) => (
              <Hov
                key={w.id}
                className="rp-wrow"
                onClick={() => navigate(`/weddings/${w.id}`)}
                style={{
                  background: c.white,
                  border: `1px solid ${c.line}`,
                  borderRadius: 12,
                  padding: '14px 18px',
                  cursor: 'pointer',
                }}
                hover={{ borderColor: c.lineHover }}
              >
                <div className="rp-wrow-date">
                  <div style={{ font: mono(500, '12px'), color: c.goldDeep }}>{w.date}</div>
                  <div style={{ marginTop: 2, font: mono(400, '9.5px'), color: c.muteFaint }}>{w.countdown}</div>
                </div>
                <div className="rp-wrow-couple">
                  <div style={{ fontFamily: family.serif, fontStyle: 'italic', fontSize: 19, fontWeight: 600 }}>
                    {w.couple}
                  </div>
                  <div style={{ marginTop: 2, fontSize: 11.5, color: c.mute }}>
                    {w.venue} · {w.guests} guests
                  </div>
                </div>
                <div className="rp-wrow-tags" style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {w.tags.map((t) => (
                    <TagPill key={t.label} tag={t} />
                  ))}
                </div>
                <div className="rp-wrow-lists" style={{ fontSize: 11.5, color: c.inkSoft }}>
                  {w.playlists}
                </div>
                <span className="rp-wrow-open rp-right" style={{ fontSize: 11.5, color: c.goldDeep }}>
                  open →
                </span>
              </Hov>
            ))}
          </div>

          <div style={{ marginTop: 20, ...label, color: c.muteFaint }}>PAST</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {past.map((w) => (
              <Hov
                key={w.id}
                className="rp-prow"
                onClick={() => navigate(`/weddings/${w.id}`)}
                style={{
                  border: `1px solid ${c.lineSoft}`,
                  borderRadius: 12,
                  padding: '11px 18px',
                  cursor: 'pointer',
                  opacity: 0.75,
                }}
                hover={{ opacity: 1 }}
              >
                <span className="rp-prow-date" style={{ font: mono(500, '11.5px'), color: c.muteSoft }}>
                  {w.date}
                </span>
                <div className="rp-prow-couple">
                  <span style={{ fontFamily: family.serif, fontStyle: 'italic', fontSize: 16, fontWeight: 600 }}>
                    {w.couple}
                  </span>
                  <span style={{ marginLeft: 10, fontSize: 11, color: c.mute }}>{w.venue}</span>
                </div>
                <span className="rp-prow-note" style={{ fontSize: 11, color: c.mute }}>
                  {w.note}
                </span>
                <span className="rp-prow-open rp-right" style={{ fontSize: 11.5, color: c.muteSoft }}>
                  open →
                </span>
              </Hov>
            ))}
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
          {overviewFooter}
        </footer>
      </div>
    </div>
  )
}
