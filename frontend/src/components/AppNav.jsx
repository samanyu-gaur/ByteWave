import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import WaveMark from './WaveMark'

const IconDashboard = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)

const IconMap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
  </svg>
)

const IconChat = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const IconAnimate = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
    <rect x="3" y="6" width="12" height="12" rx="2" ry="2" />
  </svg>
)

const IconCommunity = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const NAV_LINKS = [
  { to: '/learn', label: 'Dashboard', Icon: IconDashboard, match: p => p === '/learn' || p === '/learn/' },
  { to: '/learn/skill-map', label: 'Skill Map', Icon: IconMap, match: p => p.startsWith('/learn/skill-map') || p.startsWith('/learn/cases') || p.startsWith('/learn/assess') || p.startsWith('/learn/feedback') },
  { to: '/animate', label: 'Animate', Icon: IconAnimate, match: p => p.startsWith('/animate') },
  { to: '/chat', label: 'AI Chat', Icon: IconChat, match: p => p === '/chat' },
  { to: '/forum', label: 'Community', Icon: IconCommunity, match: p => p.startsWith('/forum') },
]

// Memo: AppNav only re-renders when the URL changes (useLocation triggers it internally)
export default memo(function AppNav() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 1px 0 var(--border-light), 0 4px 24px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto', height: 60,
        padding: '0 28px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 24,
      }}>

        {/* ── Logo (links home) ── */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 9,
          textDecoration: 'none', flexShrink: 0,
        }}>
          <WaveMark />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
            color: 'var(--primary-text)', letterSpacing: '-0.03em',
          }}>
            Byte Wave
          </span>
        </Link>

        {/* ── Nav tabs (centered) ── */}
        <nav style={{
          display: 'flex', gap: 2, flex: 1, justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-light)',
          borderRadius: 12, padding: 4,
          maxWidth: 600,
        }}>
          {NAV_LINKS.map(({ to, label, Icon, match }) => {
            const active = match(pathname)
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '7px 10px',
                  borderRadius: 9,
                  fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  transition: 'all 0.15s ease',
                  color: active ? '#fff' : 'var(--primary-text-muted)',
                  background: active ? 'var(--gradient-accent)' : 'transparent',
                  boxShadow: active ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* ── Right: user profile & theme toggle ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-text)' }}>
                {user.name}
              </span>
              <button
                onClick={logout}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" style={{
              fontSize: 13, fontWeight: 600, color: 'var(--primary-text)',
              textDecoration: 'none', padding: '6px 12px',
            }}>
              Log in
            </Link>
          )}
          <ThemeToggle />
        </div>

      </div>
    </header>
  )
})
