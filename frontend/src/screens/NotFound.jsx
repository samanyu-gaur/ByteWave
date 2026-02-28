import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#060614', color: '#fff',
      textAlign: 'center', padding: '24px', gap: 0,
    }}>
      <style>{`
        @keyframes nf-orbit { to { transform: rotate(360deg); } }
        @keyframes nf-orbit-rev { to { transform: rotate(-360deg); } }
        @keyframes nf-pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.9;transform:scale(1.08)} }
        @keyframes nf-float { 0%,100%{transform:translateY(0);opacity:.06} 50%{transform:translateY(-14px);opacity:.12} }
        @keyframes nf-flash { 0%,100%{opacity:0} 50%{opacity:1} }
      `}</style>

      {/* Floating formulas */}
      {['404','v=c','?','∞','Δx→0','lost'].map((f, i) => (
        <div key={f} style={{
          position: 'fixed',
          left: `${12 + i * 16}%`, top: `${15 + (i % 3) * 28}%`,
          fontFamily: 'monospace', fontSize: 13, fontWeight: 700,
          color: '#818cf8', opacity: 0.06, pointerEvents: 'none',
          animation: `nf-float ${10 + i * 2}s ${i * 1.5}s ease-in-out infinite`,
        }}>{f}</div>
      ))}

      {/* Black hole graphic */}
      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 36 }}>
        {/* Outer glow */}
        <div style={{
          position: 'absolute', inset: -30,
          borderRadius: '50%',
          boxShadow: '0 0 80px 30px rgba(99,102,241,0.12)',
          animation: 'nf-pulse 3s ease-in-out infinite',
        }} />
        {/* Accretion disk outer */}
        <div style={{
          position: 'absolute', inset: 8,
          borderRadius: '50%',
          background: 'conic-gradient(from 180deg, transparent, #f97316 12%, #fbbf24 24%, transparent 36%, transparent 60%, #8b5cf6 72%, #818cf8 84%, transparent)',
          animation: 'nf-orbit-rev 4s linear infinite',
          filter: 'blur(2px)', opacity: 0.6,
        }} />
        {/* Accretion disk inner */}
        <div style={{
          position: 'absolute', inset: 22,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #f97316, #fbbf24, #a78bfa, #6366f1, #f97316)',
          animation: 'nf-orbit 1.8s linear infinite',
          filter: 'blur(1px)', opacity: 0.9,
        }} />
        {/* Mask */}
        <div style={{
          position: 'absolute', inset: 42,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #000 58%, transparent 100%)',
        }} />
        {/* Event horizon */}
        <div style={{
          position: 'absolute', inset: 48,
          borderRadius: '50%', background: '#000',
          boxShadow: '0 0 0 2px rgba(139,92,246,0.45), 0 0 30px rgba(99,102,241,0.5)',
        }} />
        {/* 404 in the black hole */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 900, color: 'rgba(129,140,248,0.5)',
          fontFamily: 'monospace', letterSpacing: '-0.02em',
        }}>404</div>
      </div>

      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
        color: 'rgba(129,140,248,0.55)', textTransform: 'uppercase', marginBottom: 12,
      }}>Page not found</div>

      <h1 style={{
        fontSize: 30, fontWeight: 800, margin: '0 0 10px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>It crossed the event horizon</h1>

      <p style={{
        fontSize: 15, color: 'rgba(255,255,255,0.42)',
        maxWidth: 360, lineHeight: 1.7, margin: '0 0 36px',
      }}>
        The page you're looking for doesn't exist — or it's been sucked into a singularity. Either way, it's gone.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{
          padding: '11px 28px', borderRadius: 12,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff', fontSize: 14, fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
        }}>
          Back to home →
        </Link>
        <Link to="/learn" style={{
          padding: '11px 24px', borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 600,
          textDecoration: 'none',
        }}>
          Go to dashboard
        </Link>
      </div>

      <div style={{
        marginTop: 48,
        fontSize: 12, color: 'rgba(129,140,248,0.3)',
        fontFamily: 'monospace', letterSpacing: '0.08em',
      }}>
        r<sub>s</sub> = 2GM/c² · byte wave
      </div>
    </div>
  )
}
