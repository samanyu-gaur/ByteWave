import { Outlet } from 'react-router-dom'
import AppNav from './AppNav'

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'var(--primary-bg)',
  },
  main: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '28px 24px 48px',
    border: '1px solid var(--graph-axis)',
    borderLeft: '2px solid var(--graph-axis-thick)',
    borderBottom: '2px solid var(--graph-axis-thick)',
    borderRadius: '0 20px 0 0',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.12)',
  },
  corner: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 12,
    height: 12,
    border: '2px solid var(--graph-axis-thick)',
    borderRight: 'none',
    borderBottom: 'none',
    borderRadius: 2,
  },
}

export default function LearnLayout() {
  return (
    <div style={styles.wrapper}>
      <AppNav />
      <main style={styles.main}>
        <div style={styles.corner} aria-hidden />
        <Outlet />
      </main>
    </div>
  )
}
