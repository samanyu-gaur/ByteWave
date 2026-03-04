import { memo, useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import WaveMark from './WaveMark'
import { useAuth } from '../hooks/useAuth'

const IconDashboard = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconMap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
)
const IconChat = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconCommunity = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const NAV_LINKS = [
  { to: '/learn',           label: 'Dashboard', Icon: IconDashboard, match: p => p === '/learn' || p === '/learn/' },
  { to: '/learn/skill-map', label: 'Skill Map', Icon: IconMap,       match: p => p.startsWith('/learn/skill-map') || p.startsWith('/learn/assess') || p.startsWith('/learn/feedback') },
  { to: '/chat',            label: 'AI Chat',   Icon: IconChat,      match: p => p === '/chat' },
  { to: '/forum',           label: 'Community', Icon: IconCommunity, match: p => p.startsWith('/forum') },
]

function UserMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const initials = (user.name || 'S').slice(0, 2).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title={user.name || 'Account'}
        style={{
          width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          border: open ? '2px solid rgba(129,140,248,0.8)' : '2px solid rgba(129,140,248,0.3)',
          color: '#fff', fontSize: 12, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.15s',
          boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
        }}
      >
        {initials}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0, zIndex: 200,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          minWidth: 200, overflow: 'hidden',
        }}>
          {/* User info */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-text)' }}>{user.name || 'Student'}</div>
            {user.email && <div style={{ fontSize: 11, color: 'var(--primary-text-muted)', marginTop: 2 }}>{user.email}</div>}
            {user.isGuest && (
              <div style={{
                marginTop: 6, fontSize: 10, fontWeight: 700, color: '#f59e0b',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 6, padding: '2px 8px', display: 'inline-block',
              }}>GUEST SESSION</div>
            )}
          </div>

          {/* Menu items */}
          {user.isGuest && (
            <button
              onClick={() => { setOpen(false); navigate('/auth') }}
              style={MENU_ITEM_STYLE}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Create account — save progress
            </button>
          )}
          <button
            onClick={() => { setOpen(false); navigate('/learn/skill-map') }}
            style={MENU_ITEM_STYLE}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            </svg>
            My Skill Map
          </button>
          <button
            onClick={() => { setOpen(false); onSignOut() }}
            style={{ ...MENU_ITEM_STYLE, color: '#ef4444' }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

const MENU_ITEM_STYLE = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '10px 16px', width: '100%', background: 'none', border: 'none',
  cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary-text)',
  textAlign: 'left',
}

export default memo(function AppNav() {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

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
        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
          <WaveMark />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--primary-text)', letterSpacing: '-0.03em' }}>
            Byte Wave
          </span>
        </Link>

        {/* ── Nav tabs ── */}
        <nav style={{
          display: 'flex', gap: 2, flex: 1, justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-light)',
          borderRadius: 12, padding: 4, maxWidth: 480,
        }}>
          {NAV_LINKS.map(({ to, label, Icon, match }) => {
            const active = match(pathname)
            return (
              <Link key={to} to={to} aria-current={active ? 'page' : undefined} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '7px 10px', borderRadius: 9,
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                letterSpacing: '0.01em', transition: 'all 0.15s ease',
                color: active ? '#fff' : 'var(--primary-text-muted)',
                background: active ? 'var(--gradient-accent)' : 'transparent',
                boxShadow: active ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
                whiteSpace: 'nowrap',
              }}>
                <Icon />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* ── Right: theme + user ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Link to="/auth" style={{
              padding: '7px 16px', borderRadius: 9,
              background: 'var(--gradient-accent)', color: '#fff',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
})
