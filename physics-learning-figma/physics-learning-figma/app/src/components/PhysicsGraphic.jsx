// Simple physics-style SVG: position–time style line (slope = velocity)
const styles = { display: 'block', margin: '0 auto' }

export function PositionTimeGraph({ width = 120, height = 64 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 64" fill="none" style={styles}>
      <line x1="12" y1="52" x2="108" y2="12" stroke="var(--accent-main)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="60" x2="12" y2="12" stroke="var(--border-medium)" strokeWidth="1" />
      <line x1="12" y1="52" x2="108" y2="52" stroke="var(--border-medium)" strokeWidth="1" />
      <text x="58" y="58" fill="var(--primary-text-muted)" fontSize="8" textAnchor="middle">t</text>
      <text x="6" y="20" fill="var(--primary-text-muted)" fontSize="8" textAnchor="middle">x</text>
    </svg>
  )
}

// Graph-paper grid for decorative backgrounds
export function GraphGrid({ width = 200, height = 120, step = 20, className = '' }) {
  const lines = []
  for (let x = 0; x <= width; x += step) {
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} stroke="var(--graph-line)" strokeWidth="0.5" />)
  }
  for (let y = 0; y <= height; y += step) {
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} stroke="var(--graph-line)" strokeWidth="0.5" />)
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ display: 'block' }}>
      {lines}
    </svg>
  )
}

// Force-arrow style accent
export function ForceArrow({ width = 40, height = 24 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 24" fill="none" style={styles}>
      <path d="M4 12 L32 12 M28 8 L34 12 L28 16" stroke="var(--accent-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Formula badge (e.g. slope / velocity) – physics textbook style
export function FormulaBadge({ formula = 'v = Δx/Δt', className = '' }) {
  return (
    <span
      className={`formula-badge ${className}`.trim()}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-formula)',
        fontStyle: 'italic',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--primary-text-muted)',
        padding: '6px 12px',
        borderRadius: 10,
        background: 'var(--formula-bg)',
        border: '1px solid var(--formula-border)',
      }}
    >
      {formula}
    </span>
  )
}
