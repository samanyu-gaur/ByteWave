import { Link, useLocation } from 'react-router-dom'

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    padding: '0 28px',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-light)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 36,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--primary-text)',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: 6,
  },
  link: {
    padding: '10px 16px 12px',
    borderRadius: 0,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--primary-text-muted)',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '2px solid transparent',
    transition: 'color 0.2s ease, border-color 0.2s ease',
  },
  linkActive: {
    color: 'var(--primary-text)',
    borderBottomColor: 'var(--graph-axis-thick)',
    background: 'transparent',
  },
  homeLink: {
    fontSize: 13,
    color: 'var(--primary-text-muted)',
    textDecoration: 'none',
    fontFamily: 'var(--font-readout)',
    letterSpacing: '0.04em',
  },
}

export default function AppNav() {
  const location = useLocation()
  const path = location.pathname

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>Byte Wave</Link>
        <nav style={styles.nav}>
          <Link
            to="/learn"
            style={{ ...styles.link, ...(path === '/learn' ? styles.linkActive : {}) }}
          >
            Dashboard
          </Link>
          <Link
            to="/learn/skill-map"
            style={{ ...styles.link, ...(path.startsWith('/learn/skill-map') ? styles.linkActive : {}) }}
          >
            Skill map
          </Link>
          <Link
            to="/chat"
            style={{ ...styles.link, ...(path === '/chat' ? styles.linkActive : {}) }}
          >
            Chat
          </Link>
        </nav>
      </div>
      <Link to="/" style={styles.homeLink}>Back to site</Link>
    </header>
  )
}
