import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { c, family, mono } from '../theme'

const items = [
  { to: '/weddings', label: 'Weddings' },
  { to: '/catering', label: 'Catering' },
  { to: '/photographers', label: 'Photographers' },
  { to: '/locations', label: 'Locations' },
  { to: '/djs', label: 'DJs' },
]

const itemBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 12.5,
  cursor: 'pointer',
  textDecoration: 'none',
} as const

function NavItem({ to, label }: { to: string; label: string }) {
  const [hover, setHover] = useState(false)
  return (
    <NavLink
      to={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={({ isActive }) =>
        isActive
          ? { ...itemBase, background: c.ink, color: c.shell, fontWeight: 600 }
          : { ...itemBase, color: c.inkSoft, ...(hover ? { background: c.navHover } : null) }
      }
    >
      {label}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="rp-aside">
      <div className="rp-brand">
        <div style={{ font: mono(600, '10px'), letterSpacing: '.28em', color: c.muteFaint }}>REKORD MATCH</div>
        <div style={{ marginTop: 3, fontFamily: family.serif, fontStyle: 'italic', fontSize: 17, color: c.inkSoft }}>
          for planners
        </div>
      </div>

      <nav className="rp-nav">
        {items.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="rp-aside-user">
        <div style={{ fontSize: 12.5, fontWeight: 700 }}>Iris van Dalen</div>
        <div style={{ marginTop: 2, font: mono(400, '9.5px'), color: c.muteSoft }}>WEDDING PLANNER</div>
      </div>
    </aside>
  )
}
