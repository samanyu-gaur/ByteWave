// Full-page / standalone physics-themed loader.
// Shows a projectile arc: a ball launches from the left, follows a parabolic
// path (classic kinematics), bounces off the ground, and loops — drawn live
// with an SVG path that reveals itself as the particle travels.

export default function PhysicsLoader({ label = 'Loading…' }) {
  // Parabolic arc path from (10,70) to (190,70) peaking at (100,10)
  // Quadratic bezier: M 10 70  Q 100 -5  190 70
  const arcPath   = 'M 10,70 Q 100,-2 190,70'
  const groundY   = 70
  const totalLen  = 220   // approximate stroke length for dashoffset trick

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            16,
      padding:        32,
    }}>

      {/* ── Physics scene ── */}
      <div style={{
        position:     'relative',
        background:   'rgba(99,102,241,0.04)',
        border:       '1px solid rgba(99,102,241,0.15)',
        borderRadius: 16,
        padding:      '20px 24px 14px',
      }}>
        <svg
          width={200} height={90}
          viewBox="0 0 200 90"
          fill="none"
          overflow="visible"
        >
          {/* ── Ground line ── */}
          <line x1={0} y1={groundY} x2={200} y2={groundY}
            stroke="rgba(99,102,241,0.25)" strokeWidth={1.5} strokeLinecap="round" />

          {/* ── Faint grid ── */}
          {[20, 45].map(y => (
            <line key={y} x1={0} y1={y} x2={200} y2={y}
              stroke="rgba(99,102,241,0.06)" strokeWidth={0.8} />
          ))}
          {[50, 100, 150].map(x => (
            <line key={x} x1={x} y1={0} x2={x} y2={groundY}
              stroke="rgba(99,102,241,0.06)" strokeWidth={0.8} />
          ))}

          {/* ── Axis labels ── */}
          <text x={2}   y={groundY - 4} fontSize={7} fill="rgba(99,102,241,0.4)"
            fontFamily="var(--font-display)">x</text>
          <text x={196} y={groundY - 4} fontSize={7} fill="rgba(99,102,241,0.4)"
            fontFamily="var(--font-display)">→</text>
          <text x={100} y={8} fontSize={7} fill="rgba(99,102,241,0.4)"
            fontFamily="var(--font-display)" textAnchor="middle">y_max</text>

          {/* ── Dashed ghost arc (full trajectory preview) ── */}
          <path
            d={arcPath}
            stroke="rgba(99,102,241,0.15)"
            strokeWidth={1.2}
            strokeDasharray="4 3"
            strokeLinecap="round"
          />

          {/* ── Live-drawing arc (reveals as ball moves) ── */}
          <path
            id="bw-arc"
            d={arcPath}
            stroke="rgba(129,140,248,0.7)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={totalLen}
            style={{ animation: 'bw-arc-draw 1.8s ease-in-out infinite' }}
          />

          {/* ── Glow halo behind ball ── */}
          <circle r={10} fill="rgba(99,102,241,0.12)">
            <animateMotion dur="1.8s" repeatCount="indefinite" calcMode="spline"
              keySplines="0.4 0 0.6 1">
              <mpath href="#bw-arc" />
            </animateMotion>
          </circle>

          {/* ── Ball (particle) riding the arc ── */}
          <circle r={5} fill="url(#bw-ball-grad)"
            style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.9))' }}>
            <animateMotion dur="1.8s" repeatCount="indefinite" calcMode="spline"
              keySplines="0.4 0 0.6 1">
              <mpath href="#bw-arc" />
            </animateMotion>
          </circle>

          {/* ── Velocity vector arrow (shows at launch point) ── */}
          <line x1={10} y1={70} x2={28} y2={52}
            stroke="rgba(167,139,250,0.5)" strokeWidth={1.5} strokeLinecap="round"
            style={{ animation: 'bw-vec-fade 1.8s ease-in-out infinite' }}
          />
          {/* Arrow head */}
          <polygon points="28,52 22,54 26,60"
            fill="rgba(167,139,250,0.5)"
            style={{ animation: 'bw-vec-fade 1.8s ease-in-out infinite' }}
          />

          {/* ── Shadow on ground (shrinks/grows with height) ── */}
          <ellipse cx={100} cy={groundY + 4} rx={8} ry={2}
            fill="rgba(99,102,241,0.2)"
            style={{ animation: 'bw-shadow 1.8s ease-in-out infinite' }}
          />

          {/* ── Landing flash ── */}
          <circle cx={190} cy={groundY} r={6} fill="rgba(167,139,250,0)"
            style={{ animation: 'bw-land-flash 1.8s ease-in-out infinite' }}
          />

          {/* Gradient for ball */}
          <defs>
            <radialGradient id="bw-ball-grad" cx="35%" cy="35%">
              <stop offset="0%"   stopColor="#c4b5fd" />
              <stop offset="60%"  stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </radialGradient>
          </defs>
        </svg>

        {/* Physics formula badge */}
        <div style={{
          position:   'absolute',
          top:         10,
          right:       14,
          fontFamily: 'var(--font-display)',
          fontSize:    9,
          color:       'rgba(129,140,248,0.7)',
          letterSpacing: '0.02em',
        }}>
          y = v₀t − ½gt²
        </div>
      </div>

      {/* ── Label ── */}
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {[0, 0.2, 0.4].map(d => (
            <div key={d} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'var(--accent-main)',
              animation:  `bw-dot-pulse 1.2s ${d}s ease-in-out infinite`,
            }} />
          ))}
          <span style={{
            fontFamily:    'var(--font-display)',
            fontSize:      13,
            fontWeight:    600,
            color:         'var(--primary-text-muted)',
            letterSpacing: '0.03em',
            marginLeft:    4,
          }}>
            {label}
          </span>
        </div>
      )}

      <style>{`
        /* Arc draws itself in, then vanishes */
        @keyframes bw-arc-draw {
          0%   { stroke-dashoffset: ${totalLen}; opacity: 0.2; }
          20%  { opacity: 1; }
          80%  { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        /* Velocity vector fades out as ball leaves */
        @keyframes bw-vec-fade {
          0%,15% { opacity: 1; }
          40%,100% { opacity: 0; }
        }
        /* Shadow pulses — widest at launch/land, thinnest at peak */
        @keyframes bw-shadow {
          0%,100% { rx: 8; opacity: 0.25; }
          50%      { rx: 2; opacity: 0.08; }
        }
        /* Landing flash */
        @keyframes bw-land-flash {
          0%,79%  { r: 0;  opacity: 0; }
          82%     { r: 10; opacity: 0.7; fill: rgba(167,139,250,0.7); }
          100%    { r: 14; opacity: 0; }
        }
        /* Trailing dots under label */
        @keyframes bw-dot-pulse {
          0%,80%,100% { transform: scale(1);   opacity: 0.4; }
          40%          { transform: scale(1.6); opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
