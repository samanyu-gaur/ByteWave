import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { PHYSICS_TOPICS } from '../physicsTopics'

import ScrollReveal from '../components/ScrollReveal'
import DraggableTiles from '../components/DraggableTiles'
import ThemeToggle from '../components/ThemeToggle'
import WaveMark from '../components/WaveMark'
import { useBlackHoleTransition } from '../components/BlackHoleTransition'

// ─── Constants ────────────────────────────────────────────────────────────────
const HEADER_H = 58     // px — keep in sync with header height below

const PREVIEW_NODES = {
  motion: { x: 185, y: 95 }, gravity: { x: 75, y: 260 },
  forces: { x: 268, y: 262 }, energy: { x: 382, y: 108 },
  heat: { x: 298, y: 398 }, waves: { x: 498, y: 88 },
  electricity: { x: 568, y: 242 }, magnetism: { x: 462, y: 388 },
  light: { x: 658, y: 112 }, quantum: { x: 738, y: 312 },
}

const PREVIEW_EDGES = [
  ['motion', 'gravity'], ['motion', 'forces'], ['motion', 'energy'],
  ['forces', 'gravity'], ['forces', 'energy'], ['energy', 'heat'],
  ['energy', 'waves'], ['heat', 'magnetism'], ['waves', 'electricity'],
  ['waves', 'light'], ['electricity', 'magnetism'], ['electricity', 'light'],
  ['electricity', 'quantum'], ['light', 'quantum'],
]

const MOCK_MAP_NODES = [
  { skill_id: 'motion', name: 'Kinematics', status: 'Mastered', mastery_score: 95 },
  { skill_id: 'forces', name: 'Newton\'s Laws', status: 'In progress', mastery_score: 60 },
  { skill_id: 'energy', name: 'Work & Energy', status: 'Mastered', mastery_score: 88 },
  { skill_id: 'gravity', name: 'Gravitation', status: 'Not started', mastery_score: 0 },
  { skill_id: 'heat', name: 'Thermodynamics', status: 'Not started', mastery_score: 0 },
  { skill_id: 'waves', name: 'Waves & Sound', status: 'In progress', mastery_score: 30 },
  { skill_id: 'electricity', name: 'Electricity', status: 'Not started', mastery_score: 0 },
  { skill_id: 'magnetism', name: 'Magnetism', status: 'Not started', mastery_score: 0 },
  { skill_id: 'light', name: 'Light & Optics', status: 'Not started', mastery_score: 0 },
  { skill_id: 'quantum', name: 'Modern Physics', status: 'Not started', mastery_score: 0 },
]

function ConstellationPreview() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid var(--border-light)',
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <svg viewBox="0 0 820 490" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
        {/* Subtle connecting lines */}
        {PREVIEW_EDGES.map(([a, b]) => {
          const na = PREVIEW_NODES[a], nb = PREVIEW_NODES[b]
          const nodeA = MOCK_MAP_NODES.find(x => x.skill_id === a)
          const nodeB = MOCK_MAP_NODES.find(x => x.skill_id === b)
          const bothMastered = nodeA?.status === 'Mastered' && nodeB?.status === 'Mastered'
          return (
            <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={bothMastered ? '#34d39950' : 'rgba(255,255,255,0.07)'}
              strokeWidth={bothMastered ? 1.5 : 1} />
          )
        })}
        {/* Node Circles */}
        {MOCK_MAP_NODES.map(n => {
          const pos = PREVIEW_NODES[n.skill_id]
          const isMastered = n.status === 'Mastered'
          const isInProgress = n.status === 'In progress'
          const ring = isMastered ? '#34d399' : isInProgress ? '#fbbf24' : '#374151'
          return (
            <g key={n.skill_id}>
              {isInProgress && (
                <circle cx={pos.x} cy={pos.y} r={25} fill="none" stroke={ring} strokeWidth={1.2} opacity={0.5} style={{ animation: 'constellation-pulse 2s ease-in-out infinite' }} />
              )}
              <circle cx={pos.x} cy={pos.y} r={21} fill="rgba(10,10,20,0.85)" stroke={ring} strokeWidth={isMastered ? 2.5 : 1.5} />
              {n.mastery_score > 0 && (
                <circle cx={pos.x} cy={pos.y} r={17} fill="none" stroke={ring} strokeWidth={2.5}
                  strokeDasharray={106.8} strokeDashoffset={106.8 * (1 - n.mastery_score / 100)}
                  strokeLinecap="round" transform={`rotate(-90 ${pos.x} ${pos.y})`} opacity={0.6} />
              )}
              <circle cx={pos.x} cy={pos.y} r={4} fill={n.status === 'Not started' ? 'rgba(255,255,255,0.25)' : ring} />
              <text x={pos.x} y={pos.y + 37} textAnchor="middle" fontSize={12} fontWeight="700" fill="var(--primary-text)" fontFamily="var(--font-display)">
                {n.name}
              </text>
            </g>
          )
        })}
      </svg>
      <style>{`@keyframes constellation-pulse { 0%,100% { r: 21; opacity: 0.5; } 50% { r: 27; opacity: 0.15; } }`}</style>
    </div>
  )
}


// ─── Header ──────────────────────────────────────────────────────────────────
// Over the hero: fully transparent, all text white.
// After scrolling past the hero: glass bg + text switches to theme colour.
// Uses direct DOM writes — zero re-renders on every scroll tick.
function LandingHeader() {
  const wrapRef = useRef(null)
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const scrolled = useRef(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const nav = navRef.current
    const logo = logoRef.current
    if (!wrap || !nav || !logo) return

    const applyScrolled = (isScrolled) => {
      if (isScrolled) {
        wrap.style.background = 'var(--bg-glass)'
        wrap.style.borderBottom = '1px solid var(--border-light)'
        wrap.style.boxShadow = '0 1px 0 var(--border-light), 0 4px 24px rgba(0,0,0,0.08)'
        logo.style.color = 'var(--primary-text)'
        nav.dataset.scrolled = 'true'
        nav.querySelectorAll('.nav-link').forEach(el => {
          el.style.color = 'var(--primary-text-muted)'
        })
      } else {
        wrap.style.background = 'transparent'
        wrap.style.borderBottom = '1px solid transparent'
        wrap.style.boxShadow = 'none'
        logo.style.color = '#fff'
        nav.dataset.scrolled = 'false'
        nav.querySelectorAll('.nav-link').forEach(el => {
          el.style.color = 'rgba(255,255,255,0.72)'
        })
      }
    }

    const onScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight * 0.65
      if (isScrolled !== scrolled.current) {
        scrolled.current = isScrolled
        applyScrolled(isScrolled)
      }
    }

    applyScrolled(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const makeLink = ({ label, href, isAnchor }) => {
    const props = {
      className: 'nav-link',
      style: {
        color: 'rgba(255,255,255,0.72)',
        textDecoration: 'none',
        fontSize: 13, fontWeight: 600,
        padding: '6px 14px', borderRadius: 8,
        transition: 'background 0.15s, color 0.15s',
      },
      onMouseEnter: e => {
        const dark = navRef.current?.dataset.scrolled === 'true'
        e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.1)'
        e.currentTarget.style.color = dark ? 'var(--primary-text)' : '#fff'
      },
      onMouseLeave: e => {
        const dark = navRef.current?.dataset.scrolled === 'true'
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = dark ? 'var(--primary-text-muted)' : 'rgba(255,255,255,0.72)'
      },
    }
    return isAnchor
      ? <a key={label} href={href} {...props}>{label}</a>
      : <Link key={label} to={href} {...props}>{label}</Link>
  }

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
      }}
    >
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: HEADER_H, padding: '0 32px',
        maxWidth: 1200, margin: '0 auto', gap: 24,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <WaveMark />
          <span ref={logoRef} style={{
            fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
            color: '#fff', letterSpacing: '-0.02em',
            transition: 'color 0.35s ease',
          }}>Byte Wave</span>
        </Link>

        <nav ref={navRef} data-scrolled="false" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[
            { label: 'How it works', href: '#how-it-works', isAnchor: true },
            { label: 'AI Chat', href: '/chat' },
            { label: 'Community', href: '/forum' },
          ].map(makeLink)}

          <ThemeToggle />

          <Link to="/login" style={{
            padding: '7px 18px', borderRadius: 8,
            background: 'var(--gradient-accent)', color: '#fff',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(99,102,241,0.4)', flexShrink: 0,
          }}>Get started →</Link>
        </nav>
      </header>
    </div>
  )
}


// ─── Hero background — pure CSS, zero GPU/JS cost ────────────────────────────
// All animations run on the compositor thread (transform + opacity only).
const FORMULAS = [
  { t: 'F = ma', x: '7%', y: '22%', dur: 13, del: 0 },
  { t: 'E = mc²', x: '76%', y: '16%', dur: 15, del: 2 },
  { t: 'v = fλ', x: '62%', y: '58%', dur: 11, del: 1.2 },
  { t: 'ΔKE = W', x: '11%', y: '65%', dur: 16, del: 3.5 },
  { t: 'p = mv', x: '44%', y: '78%', dur: 14, del: 1.8 },
  { t: 'ω = 2πf', x: '82%', y: '45%', dur: 12, del: 4 },
  { t: 'τ = Iα', x: '22%', y: '42%', dur: 17, del: 0.8 },
  { t: 'PV = nRT', x: '55%', y: '88%', dur: 10, del: 2.8 },
]

// Orbiting dots — subtle animated particles using transform only
const DOTS = [
  { r: 180, speed: 22, del: 0, size: 3, op: 0.35 },
  { r: 260, speed: 30, del: 5, size: 2, op: 0.22 },
  { r: 340, speed: 38, del: 11, size: 2.5, op: 0.18 },
  { r: 140, speed: 16, del: 3, size: 4, op: 0.28 },
]

function HeroBG() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#060614' }}>

      {/* Central indigo glow */}
      <div style={{
        position: 'absolute',
        width: '90vw', height: '90vw', maxWidth: 1000, maxHeight: 1000,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.04) 45%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -58%)',
        pointerEvents: 'none',
      }} />

      {/* Secondary purple accent — slow drift */}
      <div style={{
        position: 'absolute',
        width: '55vw', height: '55vw', maxWidth: 650, maxHeight: 650,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 65%)',
        bottom: '0%', right: '-8%',
        willChange: 'transform',
        animation: 'hero-orb 22s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Third accent — top right */}
      <div style={{
        position: 'absolute',
        width: '35vw', height: '35vw', maxWidth: 420, maxHeight: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)',
        top: '-5%', right: '5%',
        willChange: 'transform',
        animation: 'hero-orb2 28s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Grid lines */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#818cf8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hgrid)" />
      </svg>

      {/* Orbiting dots — compositor-only animation */}
      {DOTS.map(({ r, speed, del, size, op }, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: r * 2, height: r * 2,
          marginLeft: -r, marginTop: -r - (window.innerHeight * 0.08),
          borderRadius: '50%',
          border: `1px solid rgba(99,102,241,${op * 0.5})`,
          willChange: 'transform',
          animation: `orbit-${i % 2 === 0 ? 'cw' : 'ccw'} ${speed}s ${del}s linear infinite`,
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            background: `rgba(129,140,248,${op})`,
            top: -size / 2, left: '50%',
            marginLeft: -size / 2,
          }} />
        </div>
      ))}

      {/* Floating physics formulas */}
      {FORMULAS.map(({ t, x, y, dur, del }) => (
        <span key={t} style={{
          position: 'absolute', left: x, top: y,
          color: 'rgba(129,140,248,0.18)',
          fontFamily: 'monospace', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.05em',
          willChange: 'transform, opacity',
          animation: `hero-float ${dur}s ${del}s ease-in-out infinite`,
          pointerEvents: 'none', userSelect: 'none',
        }}>{t}</span>
      ))}

      <style>{`
        @keyframes hero-orb {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-40px,-25px) scale(1.05); }
        }
        @keyframes hero-orb2 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(20px, 30px); }
        }
        @keyframes hero-float {
          0%,100% { transform: translateY(0px);   opacity: 0.18; }
          50%      { transform: translateY(-18px); opacity: 0.42; }
        }
        @keyframes orbit-cw  { to { transform: rotate(360deg);  } }
        @keyframes orbit-ccw { to { transform: rotate(-360deg); } }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes scroll-bob {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(5px); }
        }
      `}</style>
    </div>
  )
}

// ─── Section styles (reused below) ────────────────────────────────────────────
const S = {
  section: {
    padding: '80px 24px',
    maxWidth: 1100,
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 32, fontWeight: 700,
    textAlign: 'center', margin: '0 0 12px',
    color: 'var(--primary-text)',
  },
  sectionSub: {
    textAlign: 'center', margin: '0 0 48px',
    fontSize: 14, fontStyle: 'italic',
    color: 'var(--primary-text-muted)',
    fontFamily: 'var(--font-formula)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24,
  },
  featureCard: {
    padding: 28, borderRadius: 20,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderLeft: '3px solid var(--accent-main)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  },
  steps: {
    display: 'flex', flexDirection: 'column',
    gap: 20, maxWidth: 520, margin: '0 auto',
  },
  step: {
    display: 'flex', gap: 20, alignItems: 'flex-start',
    padding: 20, background: 'var(--bg-card)',
    borderRadius: 16, border: '1px solid var(--border-light)',
    borderLeft: '3px solid var(--accent-main)',
  },
  stepNum: {
    width: 40, height: 40, borderRadius: 4, flexShrink: 0,
    background: 'var(--bg-card)', border: '2px solid var(--graph-axis-thick)',
    color: 'var(--primary-text)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-readout)', fontSize: 16, fontWeight: 700,
  },
  footer: {
    padding: '40px 24px',
    borderTop: '1px solid var(--border-light)',
    textAlign: 'center', color: 'var(--primary-text-muted)', fontSize: 14,
  },
}

// ─── Landing page ────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const { trigger, overlay } = useBlackHoleTransition()

  const handleStartLearning = (e) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    trigger(rect, () => navigate('/login'))
  }

  const scrollToContent = () =>
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ background: 'var(--primary-bg)' }}>
      {overlay}

      <LandingHeader />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* HERO — pure CSS, zero GPU overhead                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: 500,
        overflow: 'hidden',
        background: '#060614',
        userSelect: 'none',
      }}>
        <HeroBG />

        {/* Top vignette — header reads cleanly */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(6,6,20,0.6) 0%, transparent 100%)',
        }} />

        {/* Bottom fade into page */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(6,6,20,1) 0%, rgba(6,6,20,0.5) 65%, transparent 100%)',
        }} />

        {/* Headline + CTA — tight centered group */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
          pointerEvents: 'none',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.28)',
            marginBottom: 24,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#818cf8',
              display: 'inline-block',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.09em' }}>
              HIGH SCHOOL PHYSICS · AI-POWERED GAP ANALYSIS
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6.5vw, 74px)',
            fontWeight: 800, lineHeight: 1.05,
            color: '#fff', margin: '0 0 20px',
            letterSpacing: '-0.04em',
            textShadow: '0 4px 60px rgba(6,6,20,0.9)',
          }}>
            Stop guessing<br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>what to study next</span>
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.65,
            color: 'rgba(255,255,255,0.52)',
            margin: '0 0 36px', maxWidth: 440,
          }}>
            Pick a real physics case. Answer it. The AI finds your exact knowledge gaps and tells you precisely what to review — like a personal tutor, always on.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'all' }}>
            <button onClick={handleStartLearning} style={{
              display: 'inline-block',
              padding: '14px 36px', borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 40px rgba(99,102,241,0.45)',
              letterSpacing: '0.01em',
            }} className="hover-lift">
              Start learning →
            </button>
            <a href="#how-it-works" style={{
              display: 'inline-block',
              padding: '14px 28px', borderRadius: 12,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.72)', fontSize: 15, fontWeight: 600,
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
            }} className="hover-lift">
              How it works
            </a>
          </div>
        </div>

        {/* ── Scroll cue ── */}
        <button
          onClick={scrollToContent}
          aria-label="Scroll to content"
          style={{
            position: 'absolute', bottom: 24, left: '50%',
            transform: 'translateX(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            animation: 'scroll-bob 2.2s ease-in-out infinite',
          }}
        >
          scroll
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M3 9l4 4 4-4"
              stroke="currentColor" strokeWidth={1.4}
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* ── Bridge: dark hero → page background ── */}
      <div style={{
        height: 100,
        background: 'linear-gradient(to bottom, #060614, var(--primary-bg))',
        marginTop: -1,
      }} />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* BELOW-FOLD SECTIONS                                                 */}
      {/* ════════════════════════════════════════════════════════════════════ */}

      {/* ── Problem → Solution strip ── */}
      <div className="prob-sol-grid" style={{
        maxWidth: 980, margin: '0 auto',
        padding: '0 24px 72px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
      }}>
        {/* Problem column */}
        <div style={{
          padding: '36px 40px 36px 0',
          borderRight: '1px solid var(--border-light)',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
            color: '#ef4444', textTransform: 'uppercase', marginBottom: 18,
          }}>The problem</div>
          {[
            'Students re-read textbooks without knowing what they don\'t know.',
            'Generic YouTube videos give no feedback on your specific mistakes.',
            'There\'s no way to know what to practice next — so students wing it.',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              marginBottom: 16,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx={8} cy={8} r={7} fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.35)" strokeWidth={1.2} />
                <path d="M5 8h6M8 5v6" stroke="#ef4444" strokeWidth={1.4} strokeLinecap="round" transform="rotate(45 8 8)" />
              </svg>
              <span style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--primary-text-muted)' }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Solution column */}
        <div style={{ padding: '36px 0 36px 40px' }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
            color: '#22c55e', textTransform: 'uppercase', marginBottom: 18,
          }}>Our solution</div>
          {[
            'Real physics cases that force you to apply knowledge, not just recall it.',
            'MiniMax AI analyzes every answer and pinpoints your exact gap.',
            'A Netflix-like skill map updates after each case — "Next for you" is always clear.',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              marginBottom: 16,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx={8} cy={8} r={7} fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.35)" strokeWidth={1.2} />
                <path d="M5 8.5l2 2 4-4" stroke="#22c55e" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--primary-text-muted)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: '36px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          {[
            { num: '10', label: 'Physics topics', sub: 'from kinematics to thermodynamics' },
            { num: '50+', label: 'Practice cases', sub: 'real problems with AI feedback' },
            { num: '100%', label: 'AI-powered', sub: 'gap analysis on every answer' },
          ].map(({ num, label, sub }) => (
            <div key={label} style={{ textAlign: 'center', padding: '8px 16px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 800,
                lineHeight: 1,
                background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 6,
              }}>{num}</div>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: 'var(--primary-text)',
                marginBottom: 4,
              }}>{label}</div>
              <div style={{
                fontSize: 12,
                color: 'var(--primary-text-muted)',
              }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Product preview ── */}
      <ScrollReveal>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '72px 24px 0', contentVisibility: 'auto' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          }}>
            {/* Mock browser chrome */}
            <div style={{
              background: 'var(--primary-bg)',
              borderBottom: '1px solid var(--border-light)',
              padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 6, padding: '4px 12px',
                fontSize: 11, color: 'var(--primary-text-muted)',
                maxWidth: 260,
              }}>bytewave.app/dashboard</div>
            </div>

            {/* Mock dashboard content */}
            <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>

              {/* Top: Graphical Skill Map */}
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
                  color: 'var(--primary-text-muted)', textTransform: 'uppercase', marginBottom: 12,
                }}>Live Skill Map Snapshot</div>
                <div style={{ height: 260 }}>
                  <ConstellationPreview />
                </div>
              </div>

              {/* Bottom: Progress details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                {/* Left: skill progress */}
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
                    color: 'var(--primary-text-muted)', textTransform: 'uppercase', marginBottom: 16,
                  }}>Mastery progress</div>
                  {[
                    { label: 'Kinematics', pct: 72, color: '#6366f1' },
                    { label: 'Newton\'s Laws', pct: 45, color: '#8b5cf6' },
                    { label: 'Energy & Work', pct: 88, color: '#22c55e' },
                    { label: 'Waves & Sound', pct: 30, color: '#3b82f6' },
                    { label: 'Thermodynamics', pct: 18, color: '#f59e0b' },
                  ].map(({ label, pct, color }) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 12, marginBottom: 5,
                      }}>
                        <span style={{ color: 'var(--primary-text)', fontWeight: 600 }}>{label}</span>
                        <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{
                        height: 6, background: 'var(--border-light)',
                        borderRadius: 100, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: `linear-gradient(90deg, ${color}aa, ${color})`,
                          borderRadius: 100,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: recommendation rows */}
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
                    color: 'var(--primary-text-muted)', textTransform: 'uppercase', marginBottom: 16,
                  }}>Recommended for you</div>
                  {[
                    { title: 'Velocity from a position graph', match: 91, tag: 'Next for you', tagColor: '#6366f1' },
                    { title: 'Newton\'s 3rd law — collision', match: 78, tag: 'Review', tagColor: '#f59e0b' },
                    { title: 'Kinetic energy + ramp problem', match: 95, tag: 'Ready to master', tagColor: '#22c55e' },
                  ].map(({ title, match, tag, tagColor }) => (
                    <div key={title} style={{
                      padding: '12px 14px', borderRadius: 12,
                      background: 'var(--primary-bg)',
                      border: '1px solid var(--border-light)',
                      marginBottom: 10,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: `${tagColor}18`,
                        border: `1px solid ${tagColor}40`,
                        flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: tagColor }}>{match}%</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12, fontWeight: 600,
                          color: 'var(--primary-text)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{title}</div>
                        <div style={{
                          fontSize: 10, fontWeight: 700,
                          color: tagColor, marginTop: 2,
                        }}>{tag}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p style={{
            textAlign: 'center', marginTop: 16,
            fontSize: 12, color: 'var(--primary-text-muted)', fontStyle: 'italic',
          }}>Your dashboard after completing a few cases — mastery scores update in real time.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        {/* content-visibility: auto skips render cost for off-screen sections */}
        <section style={{ ...S.section, contentVisibility: 'auto' }} id="how-it-works">
          <h2 style={S.sectionTitle}>How it works</h2>
          <p style={S.sectionSub}>Four steps from zero to mastery</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 0,
            maxWidth: 960, margin: '0 auto',
            position: 'relative',
          }}>
            {/* Connecting line across desktop */}
            <div style={{
              position: 'absolute',
              top: 36, left: '12.5%', right: '12.5%',
              height: 2,
              background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.3) 20%, rgba(99,102,241,0.3) 80%, transparent)',
              pointerEvents: 'none',
            }} />

            {[
              {
                n: '01', title: 'Open the skill map',
                desc: 'See all 10 physics topics as a constellation. Mastered nodes glow — gaps are obvious at a glance.',
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx={12} cy={12} r={3} /><circle cx={12} cy={12} r={9} strokeDasharray="3 2" />
                    <line x1={12} y1={3} x2={12} y2={6} /><line x1={12} y1={18} x2={12} y2={21} />
                    <line x1={3} y1={12} x2={6} y2={12} /><line x1={18} y1={12} x2={21} y2={12} />
                  </svg>
                ),
              },
              {
                n: '02', title: 'Pick a case',
                desc: 'Each topic has multiple real-world scenarios — ramps, graphs, collisions. Choose one that interests you.',
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                ),
              },
              {
                n: '03', title: 'Answer & get AI feedback',
                desc: 'Submit your answer. The AI finds exactly where your thinking broke down and tells you what to review.',
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                ),
              },
              {
                n: '04', title: 'Track your mastery',
                desc: 'Your dashboard updates with "Next for you", "Review", and "Ready to master" rows — like Netflix for physics.',
                icon: (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x={3} y={13} width={4} height={8} rx={1} /><rect x={10} y={9} width={4} height={12} rx={1} /><rect x={17} y={5} width={4} height={16} rx={1} />
                  </svg>
                ),
              },
            ].map(({ n, title, desc, icon }) => (
              <div key={n} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', padding: '0 20px 0',
              }}>
                {/* Step number circle */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  marginBottom: 20,
                  position: 'relative', zIndex: 1,
                  boxShadow: '0 0 0 6px var(--primary-bg)',
                }}>
                  <span style={{ color: 'var(--accent-main)' }}>{icon}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                    color: 'var(--primary-text-muted)', marginTop: 2,
                  }}>{n}</span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 15,
                  fontWeight: 700, margin: '0 0 8px', color: 'var(--primary-text)',
                }}>{title}</h3>
                <p style={{
                  fontSize: 13, lineHeight: 1.65,
                  color: 'var(--primary-text-muted)', margin: 0,
                }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── Differentiation strip ── */}
      <ScrollReveal>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 24px 80px', contentVisibility: 'auto' }}>
          <h2 style={{ ...S.sectionTitle, marginBottom: 8 }}>Why Byte Wave?</h2>
          <p style={{ ...S.sectionSub, marginBottom: 40 }}>We're not another video library or flashcard app.</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {[
              {
                vs: 'vs Textbooks',
                color: '#ef4444',
                them: 'Read → forget → re-read.',
                us: 'Apply → get AI feedback → remember. Active retrieval beats passive reading every time.',
                icon: (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                ),
              },
              {
                vs: 'vs YouTube / Khan Academy',
                color: '#f59e0b',
                them: 'Watch someone else solve it. No way to know if you actually got it.',
                us: 'You solve it. AI watches your reasoning and flags exactly where the logic breaks.',
                icon: (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" /><rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                  </svg>
                ),
              },
              {
                vs: 'vs Generic AI chatbots',
                color: '#3b82f6',
                them: 'Ask a question, get an answer. You still don\'t know what you don\'t know.',
                us: 'Structured cases + gap analysis + personalized "next step" — not just a chatbot.',
                icon: (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                ),
              },
            ].map(({ vs, color, them, us, icon }) => (
              <div key={vs} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderTop: `3px solid ${color}`,
                borderRadius: 16,
                padding: '24px 22px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ color }}>{icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color, letterSpacing: '0.03em' }}>{vs}</span>
                </div>
                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: `${color}0d`,
                  border: `1px solid ${color}22`,
                  marginBottom: 12,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em', marginBottom: 4 }}>THEM</div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--primary-text-muted)', margin: 0 }}>{them}</p>
                </div>
                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.14)',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#818cf8', letterSpacing: '0.08em', marginBottom: 4 }}>BYTE WAVE</div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--primary-text-muted)', margin: 0 }}>{us}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div style={{ contentVisibility: 'auto' }}>
          <DraggableTiles
            items={PHYSICS_TOPICS}
            title="10 physics topics"
            subtitle="Drag the tiles around — each one has practice cases waiting for you."
          />
        </div>
      </ScrollReveal>

      {/* Community teaser */}
      <ScrollReveal>
        <section style={{ ...S.section, contentVisibility: 'auto' }}>
          <h2 style={S.sectionTitle}>Join the community</h2>
          <p style={S.sectionSub}>Students helping students — discuss cases, share insights, ask questions</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                init: 'AK', name: 'Arjun K.',
                topic: 'Kinematics',
                text: 'I kept confusing velocity and acceleration on position–time graphs. The slope trick finally clicked — the slope of x(t) gives v, and slope of v(t) gives a. Changed everything for me.',
                color: '#6366f1',
              },
              {
                init: 'SL', name: 'Sophia L.',
                topic: 'Newton\'s Laws',
                text: 'Why does the block not move even though I applied a force? Friction! The AI feedback showed me I wasn\'t accounting for static friction before kinetic. Such a clear explanation.',
                color: '#8b5cf6',
              },
              {
                init: 'MR', name: 'Marcus R.',
                topic: 'Energy & Work',
                text: 'The ramp + block case was tricky — I forgot that work done by normal force is zero (perpendicular to motion). The AI caught that gap immediately and sent me to the right review case.',
                color: '#3b82f6',
              },
            ].map(({ init, name, topic, text, color }) => (
              <div key={name} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 20,
                padding: 24,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <p style={{
                  fontSize: 14, lineHeight: 1.7,
                  color: 'var(--primary-text-muted)',
                  margin: 0, flex: 1,
                  fontStyle: 'italic',
                }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `${color}22`,
                    border: `2px solid ${color}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color,
                    flexShrink: 0,
                  }}>{init}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-text)' }}>{name}</div>
                    <div style={{
                      fontSize: 11, fontWeight: 600,
                      color, background: `${color}18`,
                      display: 'inline-block', padding: '2px 8px',
                      borderRadius: 100, marginTop: 2,
                    }}>{topic}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/forum" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 24px', borderRadius: 10,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              color: 'var(--primary-text-muted)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }} className="hover-lift">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Browse community discussions →
            </Link>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section style={{
          padding: '72px 24px 100px', contentVisibility: 'auto',
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-light)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 620, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 100,
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.22)',
              marginBottom: 20,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                animation: 'pulse-dot 1.8s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em' }}>
                LIVE DEMO READY · NO SIGN-UP NEEDED
              </span>
            </div>
            <h2 style={{ ...S.sectionTitle, fontSize: 36, marginBottom: 14 }}>
              Find your gaps in 5 minutes
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--primary-text-muted)', margin: '0 0 12px' }}>
              Open the skill map. Pick any physics topic. Answer one case. The AI will show you exactly where your understanding breaks down — and what to do next.
            </p>
            <p style={{ fontSize: 13, color: 'var(--primary-text-muted)', margin: '0 0 36px', fontStyle: 'italic' }}>
              Pick a case → answer it → get AI gap analysis → see your skill map update.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleStartLearning} style={{
                display: 'inline-block', padding: '15px 40px', borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
                letterSpacing: '0.01em',
              }} className="hover-lift">
                Try a case now →
              </button>
              <Link to="/chat" style={{
                display: 'inline-block', padding: '15px 28px', borderRadius: 12,
                background: 'transparent',
                border: '1px solid var(--border-light)',
                color: 'var(--primary-text-muted)',
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
              }} className="hover-lift">
                Ask the AI tutor
              </Link>
            </div>
            <div style={{
              marginTop: 36, display: 'flex', gap: 24, justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: '⚡', label: 'Instant AI feedback' },
                { icon: '🗺️', label: 'Visual skill map' },
                { icon: '🎯', label: 'Pinpoint your gaps' },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, color: 'var(--primary-text-muted)', fontWeight: 600,
                }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <footer style={{
        borderTop: '1px solid var(--border-light)',
        padding: '40px 32px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
        }}>
          {/* Left: logo + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WaveMark />
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                color: 'var(--primary-text)', letterSpacing: '-0.02em',
              }}>Byte Wave</div>
              <div style={{ fontSize: 12, color: 'var(--primary-text-muted)', marginTop: 2 }}>
                AI-powered physics for high school students
              </div>
            </div>
          </div>

          {/* Right: nav links */}
          <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'How it works', href: '#how-it-works', anchor: true },
              { label: 'AI Chat', href: '/chat' },
              { label: 'Community', href: '/forum' },
              { label: 'Skill map', href: '/learn/skill-map' },
            ].map(({ label, href, anchor }) => (
              anchor
                ? <a key={label} href={href} style={{
                  padding: '6px 12px', borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                  color: 'var(--primary-text-muted)', textDecoration: 'none',
                  transition: 'color 0.15s',
                }}>{label}</a>
                : <Link key={label} to={href} style={{
                  padding: '6px 12px', borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                  color: 'var(--primary-text-muted)', textDecoration: 'none',
                  transition: 'color 0.15s',
                }}>{label}</Link>
            ))}
            <button onClick={handleStartLearning} style={{
              marginLeft: 8,
              padding: '7px 18px', borderRadius: 8,
              background: 'var(--gradient-accent)', color: '#fff',
              fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            }}>Get started →</button>
          </nav>
        </div>
        <div style={{
          maxWidth: 1100, margin: '20px auto 0',
          paddingTop: 20,
          borderTop: '1px solid var(--border-light)',
          fontSize: 12, color: 'var(--primary-text-muted)',
          textAlign: 'center',
        }}>
          © 2026 Byte Wave · Built for high school physics students
        </div>
      </footer>

      <style>{`
        @keyframes scroll-bob {
          0%,100% { transform: translateX(-50%) translateY(0);   opacity: 0.3; }
          50%      { transform: translateX(-50%) translateY(5px); opacity: 0.6; }
        }
        @media (max-width: 640px) {
          .prob-sol-grid { grid-template-columns: 1fr !important; }
          .prob-sol-grid > div { border-right: none !important; padding: 28px 0 !important; border-bottom: 1px solid var(--border-light); }
          .prob-sol-grid > div:last-child { border-bottom: none; }
          .diff-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .preview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
