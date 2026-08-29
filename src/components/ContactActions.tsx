import { c } from '../theme'

const button = {
  width: 22,
  height: 22,
  flex: 'none',
  borderRadius: 999,
  background: c.goldWashStrong,
  color: c.goldDeep,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  textDecoration: 'none',
} as const

function MailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 4.6 8 8.9l6-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.1 2.2h2.3l1.1 2.8-1.4 1a7.6 7.6 0 0 0 3.9 3.9l1-1.4 2.8 1.1v2.3c0 .6-.5 1.1-1.1 1A11.4 11.4 0 0 1 2.1 3.3c0-.6.4-1.1 1-1.1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Mail and call buttons for one person. */
export function ContactActions({
  name,
  email,
  phone,
  className,
}: {
  name: string
  email: string
  phone: string
  className?: string
}) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flex: 'none' }}>
      <a href={`mailto:${email}`} style={button} title={email} aria-label={`Email ${name}`}>
        <MailIcon />
      </a>
      <a href={`tel:${phone.replace(/\s/g, '')}`} style={button} title={phone} aria-label={`Call ${name}`}>
        <PhoneIcon />
      </a>
    </span>
  )
}
