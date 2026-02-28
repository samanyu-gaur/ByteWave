import { useNavigate } from 'react-router-dom'

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 48,
    padding: '12px 0',
    marginBottom: 24,
    gap: 12,
  },
  back: {
    background: 'none',
    border: 'none',
    padding: 8,
    cursor: 'pointer',
    color: 'var(--primary-text)',
    fontSize: 24,
    lineHeight: 1,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--primary-text)',
  },
  titleMuted: {
    flex: 1,
    fontSize: 14,
    color: 'var(--primary-text-muted)',
  },
}

export default function NavBar({ back, title, titleMuted }) {
  const navigate = useNavigate()
  return (
    <nav style={styles.bar}>
      {back ? (
        <button type="button" style={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          ←
        </button>
      ) : (
        <span style={{ width: 40 }} />
      )}
      <span style={titleMuted ? styles.titleMuted : styles.title}>
        {title || 'Physics'}
      </span>
    </nav>
  )
}
