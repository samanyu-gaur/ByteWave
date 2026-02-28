const styles = {
  block: {
    padding: '14px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    border: '1px solid var(--graph-axis)',
    borderLeft: '2px solid var(--graph-axis-thick)',
    borderRadius: '0 10px 0 0',
    paddingLeft: 14,
    paddingRight: 14,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--primary-text)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  score: { fontFamily: 'var(--font-readout)', fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em', color: 'var(--accent-success)' },
  trackWrap: { position: 'relative' },
  track: {
    height: 10,
    borderRadius: 2,
    background: 'var(--border-light)',
    overflow: 'hidden',
    position: 'relative',
  },
  trackTicks: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  tick: { width: 1, background: 'var(--graph-axis)', flexShrink: 0 },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  fillSuccess: { background: 'var(--accent-success)' },
  fillWarning: { background: 'var(--accent-warning)' },
  fillNeutral: { background: 'var(--accent-neutral)' },
  scaleLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
    fontFamily: 'var(--font-readout)',
    fontSize: 10,
    fontWeight: 500,
    color: 'var(--primary-text-muted)',
    letterSpacing: '0.02em',
  },
}

export default function MasteryScore({ label = 'Slope', percent = 72 }) {
  const fillStyle =
    percent >= 80 ? { ...styles.fill, ...styles.fillSuccess } :
    percent > 0 ? { ...styles.fill, ...styles.fillWarning } :
    { ...styles.fill, ...styles.fillNeutral }
  const pct = Math.min(100, percent)
  return (
    <div style={styles.block}>
      <div style={styles.row}>
        <span style={styles.label}>{label}</span>
        <span style={styles.score}>{percent}%</span>
      </div>
      <div style={styles.trackWrap}>
        <div style={styles.track}>
          <div style={{ ...fillStyle, width: `${pct}%` }} />
          <div style={styles.trackTicks}>
            {[0, 25, 50, 75, 100].map((_) => <div key={_} style={styles.tick} />)}
          </div>
        </div>
        <div style={styles.scaleLabels}>
          <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
        </div>
      </div>
    </div>
  )
}
