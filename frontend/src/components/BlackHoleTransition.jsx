import { useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

// ─── Constants ────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 24
const TOTAL_DURATION  = 1400  // ms

// Particles span the entire screen — start far out, spiral into center
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  angle:  (i / PARTICLE_COUNT) * 360,
  // Mix of near and far starting distances for a full-screen feel
  radius: 140 + (i % 6) * 80,   // 140 / 220 / 300 / 380 / 460 / 540 px
  size:   2.5 + (i % 4) * 1.5,  // 2.5 / 4 / 5.5 / 7 px
  delay:  (i % 8) * 0.03,
  color:  ['#f97316','#a78bfa','#fbbf24','#818cf8','#ef4444','#22d3ee'][i % 6],
}))

// ─── Overlay (portal) ────────────────────────────────────────────────────────
function BlackHoleOverlay({ originX, originY, phase }) {
  const visible = phase !== 'done'

  // Black hole always lives at viewport center for maximum visual impact
  const cx = window.innerWidth  / 2
  const cy = window.innerHeight / 2

  return createPortal(
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        pointerEvents: visible ? 'all' : 'none',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes bh-overlay-in {
          from { opacity: 0; } to { opacity: 1; }
        }

        /* Event horizon: small → huge → implode */
        @keyframes bh-horizon-grow {
          0%   { transform: scale(0);   opacity: 0; }
          12%  { transform: scale(1);   opacity: 1; }
          80%  { transform: scale(1);   opacity: 1; }
          100% { transform: scale(0);   opacity: 0; }
        }

        /* Accretion disk */
        @keyframes bh-accretion {
          to { transform: rotate(360deg); }
        }
        @keyframes bh-accretion-rev {
          to { transform: rotate(-360deg); }
        }

        /* Lensing halo pulse */
        @keyframes bh-lens {
          0%,100% { transform: scale(1);    opacity: 0.5; }
          50%      { transform: scale(1.06); opacity: 0.85; }
        }
        @keyframes bh-lens-outer {
          0%,100% { transform: scale(1);    opacity: 0.25; }
          50%      { transform: scale(1.04); opacity: 0.5;  }
        }

        /* White flash crossing the event horizon */
        @keyframes bh-flash {
          0%,72% { opacity: 0; }
          85%     { opacity: 1; }
          100%    { opacity: 0; }
        }

        /* Full-page suck — transform-origin is the BUTTON, not the center */
        @keyframes bh-suck {
          0%   { transform: scale(1)    rotate(0deg);     filter: blur(0px);   opacity: 1;   }
          40%  { transform: scale(0.6)  rotate(360deg);   filter: blur(0.5px); opacity: 0.95; }
          75%  { transform: scale(0.12) rotate(900deg);   filter: blur(6px);   opacity: 0.5; }
          100% { transform: scale(0)    rotate(1080deg);  filter: blur(20px);  opacity: 0;   }
        }

        /* Gravitational distortion ring that expands outward */
        @keyframes bh-shockwave {
          0%   { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(4.5); opacity: 0;   }
        }

        /* Particle spiral keyframes — 24 unique variants */
        ${PARTICLES.map(({ angle, radius, delay }, i) => `
          @keyframes bh-p-${i} {
            0%   { transform: rotate(${angle}deg)       translateX(${radius}px)           scale(1);   opacity: 0.95; }
            55%  { transform: rotate(${angle + 600}deg) translateX(${radius * 0.25}px)    scale(0.6); opacity: 0.7;  }
            85%  { transform: rotate(${angle + 960}deg) translateX(${radius * 0.04}px)    scale(0.2); opacity: 0.3;  }
            100% { transform: rotate(${angle + 1080}deg) translateX(0px)                  scale(0);   opacity: 0;   }
          }
        `).join('')}

        /* Hawking radiation sparks — escape outward */
        @keyframes bh-hk-0 { 0%{transform:translate(0,0);opacity:.9} 100%{transform:translate(-120px,-160px) scale(0);opacity:0} }
        @keyframes bh-hk-1 { 0%{transform:translate(0,0);opacity:.9} 100%{transform:translate(150px,-120px) scale(0);opacity:0} }
        @keyframes bh-hk-2 { 0%{transform:translate(0,0);opacity:.9} 100%{transform:translate(110px, 155px) scale(0);opacity:0} }
        @keyframes bh-hk-3 { 0%{transform:translate(0,0);opacity:.9} 100%{transform:translate(-140px,110px) scale(0);opacity:0} }
        @keyframes bh-hk-4 { 0%{transform:translate(0,0);opacity:.7} 100%{transform:translate(70px,-190px) scale(0);opacity:0}  }
        @keyframes bh-hk-5 { 0%{transform:translate(0,0);opacity:.7} 100%{transform:translate(-80px,175px) scale(0);opacity:0}  }
      `}</style>

      {/* ── Dark void background ── */}
      {visible && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at ${cx}px ${cy}px, rgba(6,6,20,0.88) 0%, rgba(0,0,4,0.97) 100%)`,
          animation: 'bh-overlay-in 0.18s ease forwards',
        }} />
      )}

      {/* ── Page-suck layer — transform-origin locked to clicked button ── */}
      {phase === 'suck' && (
        <div style={{
          position: 'absolute', inset: 0,
          transformOrigin: `${originX}px ${originY}px`,
          animation: `bh-suck ${TOTAL_DURATION * 0.78}ms cubic-bezier(0.55, 0, 1, 0.45) 80ms forwards`,
          pointerEvents: 'none',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.03)' }} />
        </div>
      )}

      {/* ── Black hole assembly — always at viewport center ── */}
      {visible && (
        <div style={{
          position: 'absolute',
          left: cx, top: cy,
          transform: 'translate(-50%, -50%)',
          width: 0, height: 0,
        }}>

          {/* Outermost glow halo — very large, subtle */}
          <div style={{
            position: 'absolute',
            width: 700, height: 700,
            marginLeft: -350, marginTop: -350,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: '0 0 180px 80px rgba(99,102,241,0.08), 0 0 320px 140px rgba(139,92,246,0.04)',
            animation: 'bh-lens-outer 2.2s ease-in-out infinite',
          }} />

          {/* Lensing halo */}
          <div style={{
            position: 'absolute',
            width: 440, height: 440,
            marginLeft: -220, marginTop: -220,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: '0 0 90px 40px rgba(139,92,246,0.18), 0 0 200px 80px rgba(99,102,241,0.09)',
            animation: 'bh-lens 1.6s ease-in-out infinite',
          }} />

          {/* Shockwave ring — expands outward once on appear */}
          <div style={{
            position: 'absolute',
            width: 300, height: 300,
            marginLeft: -150, marginTop: -150,
            borderRadius: '50%',
            border: '2px solid rgba(129,140,248,0.4)',
            animation: `bh-shockwave 0.7s cubic-bezier(0.2, 0, 1, 0.8) forwards`,
            pointerEvents: 'none',
          }} />

          {/* Outer accretion disk — counter-rotating, wider */}
          <div style={{
            position: 'absolute',
            width: 320, height: 320,
            marginLeft: -160, marginTop: -160,
            borderRadius: '50%',
            background: 'conic-gradient(from 180deg, transparent 0%, #f97316 8%, #fbbf24 16%, transparent 24%, transparent 48%, #8b5cf6 56%, #818cf8 64%, transparent 72%)',
            opacity: 0.6,
            animation: 'bh-accretion-rev 3.2s linear infinite',
            filter: 'blur(3px)',
          }} />

          {/* Inner accretion disk — main spinning ring */}
          <div style={{
            position: 'absolute',
            width: 240, height: 240,
            marginLeft: -120, marginTop: -120,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #f97316, #fbbf24, #f97316 30%, #a78bfa 50%, #6366f1 65%, #818cf8 80%, #f97316)',
            opacity: 0.9,
            animation: 'bh-accretion 0.9s linear infinite',
            filter: 'blur(1.5px)',
          }} />

          {/* Bright inner ring edge */}
          <div style={{
            position: 'absolute',
            width: 200, height: 200,
            marginLeft: -100, marginTop: -100,
            borderRadius: '50%',
            background: 'conic-gradient(from 45deg, transparent 0%, rgba(251,191,36,0.8) 5%, transparent 12%, transparent 50%, rgba(249,115,22,0.6) 55%, transparent 62%)',
            animation: 'bh-accretion 0.6s linear infinite',
            filter: 'blur(0.5px)',
          }} />

          {/* Mask — black circle that hides inner disk, creates the ring */}
          <div style={{
            position: 'absolute',
            width: 168, height: 168,
            marginLeft: -84, marginTop: -84,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #000 60%, rgba(0,0,0,0.85) 80%, transparent 100%)',
          }} />

          {/* Event horizon — the actual black circle */}
          <div style={{
            position: 'absolute',
            width: 130, height: 130,
            marginLeft: -65, marginTop: -65,
            borderRadius: '50%',
            background: '#000',
            animation: `bh-horizon-grow ${TOTAL_DURATION * 0.88}ms cubic-bezier(0.34, 1.15, 0.64, 1) forwards`,
            boxShadow: '0 0 0 3px rgba(139,92,246,0.4), 0 0 40px rgba(99,102,241,0.6), inset 0 0 30px rgba(0,0,0,1)',
          }} />

          {/* Singularity dot — pure white center */}
          <div style={{
            position: 'absolute',
            width: 6, height: 6,
            marginLeft: -3, marginTop: -3,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 12px 6px rgba(255,255,255,0.9)',
            zIndex: 2,
          }} />

          {/* Spiraling particles — spread across full screen */}
          {PARTICLES.map(({ size, color, delay }, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size, height: size,
              marginLeft: -size / 2, marginTop: -size / 2,
              borderRadius: '50%',
              background: color,
              transformOrigin: '50% 50%',
              animation: `bh-p-${i} ${TOTAL_DURATION * 0.82}ms cubic-bezier(0.35, 0, 0.95, 0.55) ${delay}s forwards`,
              boxShadow: `0 0 ${size * 3}px ${size}px ${color}88`,
            }} />
          ))}

          {/* Hawking radiation — escape sparks */}
          {[0,1,2,3,4,5].map(i => (
            <div key={`hk${i}`} style={{
              position: 'absolute',
              width: 4, height: 4,
              borderRadius: '50%',
              background: i < 4 ? '#fbbf24' : '#818cf8',
              boxShadow: `0 0 6px ${i < 4 ? '#fbbf24' : '#818cf8'}`,
              animation: `bh-hk-${i} ${TOTAL_DURATION * 0.6}ms ease-out ${0.1 + i * 0.05}s forwards`,
            }} />
          ))}
        </div>
      )}

      {/* ── Event horizon crossing flash — full screen white burst ── */}
      {visible && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at ${cx}px ${cy}px, rgba(255,255,255,0.98) 0%, rgba(139,92,246,0.5) 30%, rgba(99,102,241,0.1) 55%, transparent 75%)`,
          animation: `bh-flash ${TOTAL_DURATION}ms ease forwards`,
          pointerEvents: 'none',
        }} />
      )}

      {/* ── Schwarzschild radius label ── */}
      {visible && (
        <div style={{
          position: 'absolute', bottom: '15%', left: 0, right: 0,
          textAlign: 'center',
          fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(129,140,248,0.5)',
          animation: 'bh-overlay-in 0.4s 0.1s ease forwards',
          opacity: 0,
        }}>
          r<sub>s</sub> = 2GM/c² &nbsp;·&nbsp; entering byte wave
        </div>
      )}
    </div>,
    document.body
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useBlackHoleTransition() {
  const [state, setState] = useState({ active: false, originX: 0, originY: 0, phase: 'done' })
  const timerRef = useRef([])

  const trigger = useCallback((rect, callback) => {
    const originX = rect.left + rect.width  / 2
    const originY = rect.top  + rect.height / 2

    timerRef.current.forEach(clearTimeout)
    timerRef.current = []

    setState({ active: true, originX, originY, phase: 'enter' })

    timerRef.current.push(setTimeout(() =>
      setState(s => ({ ...s, phase: 'suck' })), 80))

    timerRef.current.push(setTimeout(() => {
      setState({ active: false, originX: 0, originY: 0, phase: 'done' })
      callback()
    }, TOTAL_DURATION))
  }, [])

  const overlay = state.active
    ? <BlackHoleOverlay originX={state.originX} originY={state.originY} phase={state.phase} />
    : null

  return { trigger, overlay }
}
