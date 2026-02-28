import TopicIcon from './TopicIcon'

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-card)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--border-light)',
    borderLeft: '3px solid var(--graph-axis-thick)',
    borderBottom: '3px solid var(--graph-axis-thick)',
    borderRadius: '0 12px 0 0',
    padding: '16px 20px',
    paddingLeft: 18,
    cursor: 'pointer',
    gap: 12,
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 6,
    height: 6,
    background: 'var(--graph-axis-thick)',
    borderRadius: '0 2px 0 0',
  },
  left: { display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  title: { margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--primary-text)' },
  score: { fontFamily: 'var(--font-readout)', fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' },
  caption: { fontSize: 11, color: 'var(--primary-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
}

const matchColor = (pct) =>
  pct >= 85 ? 'var(--rec-high)' : pct >= 60 ? 'var(--rec-mid)' : 'var(--rec-low)'

export default function RecommendationCard({ title, matchPercent, topicId, onClick }) {
  return (
    <button type="button" style={styles.card} onClick={onClick}>
      <div style={styles.corner} aria-hidden />
      <div style={styles.left}>
        {topicId && <TopicIcon topicId={topicId} size="small" />}
        <span style={styles.title}>{title}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...styles.score, color: matchColor(matchPercent) }}>{matchPercent}%</div>
        <div style={styles.caption}>match</div>
      </div>
    </button>
  )
}
