import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForum } from '../hooks/useForum'
import AppNav from '../components/AppNav'

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Byte Wave AI — a sharp, friendly physics tutor for high school students. You help with kinematics, forces, energy, waves, electricity, magnetism, optics, thermodynamics, gravity, and nuclear physics. Keep answers clear, use real-world examples, and when relevant use simple equations. Never be condescending.`

// ─── Topic-specific quick-prompt chips ────────────────────────────────────────
const TOPIC_PROMPTS = {
  'Kinematics & Motion': [
    'What is the difference between speed and velocity?',
    'How do I find acceleration from a v-t graph?',
    'What equations do I need for projectile motion?',
  ],
  'Forces & Newton\'s Laws': [
    'Explain Newton\'s three laws with examples',
    'How do I draw a free body diagram?',
    'Why does a heavier object not fall faster?',
  ],
  'Energy & Work': [
    'What is the difference between KE and PE?',
    'How does conservation of energy work on a ramp?',
    'What is the work-energy theorem?',
  ],
  'Waves & Sound': [
    'What is the Doppler effect?',
    'What is the difference between transverse and longitudinal waves?',
    'How does frequency relate to pitch?',
  ],
  'Electricity & Circuits': [
    'Explain Ohm\'s law simply',
    'What is the difference between series and parallel circuits?',
    'How do I calculate equivalent resistance?',
  ],
  'Magnetism': [
    'How does a magnetic field form around a wire?',
    'What is electromagnetic induction?',
    'What is the right-hand rule?',
  ],
  'Light & EM Waves': [
    'What is the law of reflection?',
    'How does Snell\'s law work?',
    'Why does light slow down in glass?',
  ],
  'Thermodynamics & Heat': [
    'What are the laws of thermodynamics?',
    'What is the difference between heat and temperature?',
    'How does a heat engine work?',
  ],
  'Gravity & Orbits': [
    'Why does the Moon not fall to Earth?',
    'What is escape velocity?',
    'How does gravity change with distance?',
  ],
  'Atoms & Nuclei': [
    'What is radioactive decay?',
    'How do you calculate half-life?',
    'What is the difference between fission and fusion?',
  ],
}

const GENERAL_PROMPTS = [
  'What is Newton\'s second law?',
  'How do I read a position-time graph?',
  'Explain conservation of momentum',
  'What is the Doppler effect?',
  'How does a circuit work?',
  'What is centripetal force?',
]

// ─── Detect physics formulas in text and wrap them ───────────────────────────
const FORMULA_RE = /(\b[A-Za-zΑ-Ωα-ω][₀-₉]?\s*[=≈]\s*[^.,;!?\n]{1,50}|\b[A-Za-z]\s*=\s*[A-Za-z\/\^²³0-9\s\+\-\*\.]{2,30})/g

function formatMessage(text) {
  const parts = []
  let last = 0
  let m
  FORMULA_RE.lastIndex = 0
  while ((m = FORMULA_RE.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', val: text.slice(last, m.index) })
    parts.push({ type: 'formula', val: m[0] })
    last = FORMULA_RE.lastIndex
  }
  if (last < text.length) parts.push({ type: 'text', val: text.slice(last) })
  if (parts.length === 0) parts.push({ type: 'text', val: text })
  return parts
}

// ─── Typewriter component ─────────────────────────────────────────────────────
function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState('')
  const iRef = useRef(0)

  useEffect(() => {
    iRef.current = 0
    setDisplayed('')
    const id = setInterval(() => {
      iRef.current = Math.min(iRef.current + 4, text.length)
      setDisplayed(text.slice(0, iRef.current))
      if (iRef.current >= text.length) clearInterval(id)
    }, 10)
    return () => clearInterval(id)
  }, [text])

  const done = displayed.length >= text.length
  const parts = formatMessage(displayed)

  return (
    <span>
      {parts.map((p, i) =>
        p.type === 'formula'
          ? <code key={i} style={{
            fontFamily: 'monospace', fontSize: '0.9em',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 4, padding: '1px 5px',
            color: '#a78bfa',
          }}>{p.val}</code>
          : <span key={i}>{p.val}</span>
      )}
      {!done && (
        <span style={{
          display: 'inline-block', width: 2, height: '1em',
          background: '#818cf8', marginLeft: 2, verticalAlign: 'text-bottom',
          animation: 'blink-cur 0.7s step-end infinite',
        }} />
      )}
    </span>
  )
}

// ─── Thinking indicator ───────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '6px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--accent-main)',
          animation: `thinking-bounce 1.1s ${i * 0.18}s ease-in-out infinite`,
          opacity: 0.7,
        }} />
      ))}
    </div>
  )
}

// ─── AI avatar ───────────────────────────────────────────────────────────────
function BWAvatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 12px rgba(99,102,241,0.4)',
    }}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <path d="M2 12 Q6 6 12 12 Q18 18 22 12" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        <circle cx={12} cy={12} r={2} fill="#fff" />
      </svg>
    </div>
  )
}

// ─── User avatar ──────────────────────────────────────────────────────────────
function UserAvatar() {
  const initial = (localStorage.getItem('bw_name') || 'S')[0].toUpperCase()
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
      background: 'rgba(129,140,248,0.15)',
      border: '1.5px solid rgba(129,140,248,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 800, color: '#818cf8',
    }}>
      {initial}
    </div>
  )
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ msg, isLatestAI }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'

  const copy = useCallback(() => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }, [msg.content])

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10, alignItems: 'flex-start',
    }}>
      {isUser ? <UserAvatar /> : <BWAvatar />}

      <div style={{ maxWidth: '80%', position: 'relative' }} className="msg-wrap">
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : 'var(--bg-card)',
          border: isUser
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid var(--border-light)',
          borderLeft: isUser ? undefined : '3px solid #6366f1',
          color: isUser ? '#fff' : 'var(--primary-text)',
          fontSize: 14.5, lineHeight: 1.65,
          boxShadow: isUser
            ? '0 4px 20px rgba(99,102,241,0.25)'
            : '0 2px 12px rgba(0,0,0,0.1)',
        }}>
          {isUser
            ? msg.content
            : (isLatestAI
              ? <TypewriterText text={msg.content} />
              : <span>{formatMessage(msg.content).map((p, i) =>
                p.type === 'formula'
                  ? <code key={i} style={{
                    fontFamily: 'monospace', fontSize: '0.9em',
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 4, padding: '1px 5px', color: '#a78bfa',
                  }}>{p.val}</code>
                  : <span key={i}>{p.val}</span>
              )}</span>
            )
          }
        </div>

        {/* Copy button — only on AI messages */}
        {!isUser && (
          <button
            onClick={copy}
            title="Copy"
            style={{
              position: 'absolute', top: 8, right: -32,
              width: 24, height: 24, borderRadius: 6,
              background: copied ? 'rgba(34,197,94,0.15)' : 'var(--bg-card)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'var(--border-light)'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.15s',
            }}
            className="copy-btn"
          >
            {copied
              ? <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <svg width={11} height={11} viewBox="0 0 12 12" fill="none"><rect x={4} y={1} width={7} height={8} rx={1.5} stroke="var(--primary-text-muted)" strokeWidth={1.2} /><rect x={1} y={3.5} width={7} height={8} rx={1.5} stroke="var(--primary-text-muted)" strokeWidth={1.2} fill="var(--bg-card)" /></svg>
            }
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Related discussions panel ────────────────────────────────────────────────
function extractKeywords(topicName, messages) {
  const TERMS = [
    'kinematics', 'velocity', 'acceleration', 'displacement', 'motion', 'projectile',
    'force', 'newton', 'friction', 'tension', 'normal', 'weight', 'pressure',
    'energy', 'work', 'power', 'kinetic', 'potential', 'conservation',
    'wave', 'frequency', 'wavelength', 'amplitude', 'sound', 'longitudinal',
    'light', 'reflection', 'refraction', 'snell', 'optics', 'lens', 'mirror',
    'current', 'voltage', 'resistance', 'circuit', 'ohm', 'charge',
    'magnet', 'magnetic', 'solenoid', 'induction', 'flux',
    'heat', 'temperature', 'thermal', 'conduction', 'convection', 'radiation',
    'gravity', 'gravitational', 'orbit', 'satellite', 'free-fall',
    'atom', 'nuclear', 'decay', 'half-life', 'proton', 'neutron', 'electron',
  ]
  const text = [topicName || '', ...messages.map(m => m.content)].join(' ').toLowerCase()
  return TERMS.filter(t => text.includes(t))
}

function RelatedPanel({ posts, navigate }) {
  const [open, setOpen] = useState(true)
  if (!posts.length) return null
  return (
    <div style={{ maxWidth: 720, margin: '0 auto 12px', width: '100%', padding: '0 24px' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '9px 14px',
        borderRadius: open ? '10px 10px 0 0' : 10,
        background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)',
        borderBottom: open ? 'none' : undefined, cursor: 'pointer',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-main)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Community discussions ({posts.length})
        </span>
        <span style={{ fontSize: 11, color: 'var(--accent-main)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </button>
      {open && (
        <div style={{ border: '1px solid rgba(99,102,241,0.18)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
          {posts.map((post, i) => (
            <button key={post.id} type="button" onClick={() => navigate(`/forum/${post.id}`)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: i % 2 === 0 ? 'rgba(99,102,241,0.04)' : 'transparent',
              border: 'none', borderTop: i > 0 ? '1px solid rgba(99,102,241,0.08)' : 'none',
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💬</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--primary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.title}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 3 }}>
                  {post.tags?.slice(0, 3).map(t => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-main)', background: 'rgba(99,102,241,0.1)', padding: '1px 6px', borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--accent-main)', flexShrink: 0 }}>View →</span>
            </button>
          ))}
          <div style={{ padding: '7px 14px', borderTop: '1px solid rgba(99,102,241,0.08)', textAlign: 'right' }}>
            <button type="button" onClick={() => navigate('/forum')} style={{ background: 'none', border: 'none', fontSize: 11, fontWeight: 600, color: 'var(--accent-main)', cursor: 'pointer' }}>
              Browse all →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main chat screen ─────────────────────────────────────────────────────────
export default function Chat() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const topicName = searchParams.get('name')

  const { findRelated } = useForum()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const listRef = useRef(null)
  const textareaRef = useRef(null)
  const autoFired = useRef(false)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const relatedPosts = useMemo(() => {
    if (messages.length === 0) return []
    return findRelated(extractKeywords(topicName, messages))
  }, [messages, topicName, findRelated])

  const sendMessage = useCallback(async (textToSend) => {
    const text = (textToSend ?? input).trim()
    if (!text || loading) return
    setInput('')
    setError(null)
    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage,
          ]
        })
      })
      if (!res.ok) throw new Error('Server error — check your connection')
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message || 'Failed to get reply')
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  useEffect(() => {
    if (topicName && !autoFired.current) {
      autoFired.current = true
      sendMessage(`Give me one challenging but fair question about "${topicName}". Just the question, no preamble.`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicName])

  const handleSubmit = (e) => {
    e?.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickPrompts = topicName && TOPIC_PROMPTS[topicName]
    ? TOPIC_PROMPTS[topicName]
    : GENERAL_PROMPTS

  const latestAIIndex = messages.map((m, i) => m.role === 'assistant' ? i : -1).filter(i => i >= 0).pop()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--primary-bg)', position: 'relative' }}>
      <style>{`
        @keyframes thinking-bounce {
          0%,80%,100% { transform: translateY(0); opacity: 0.5; }
          40%           { transform: translateY(-7px); opacity: 1; }
        }
        @keyframes blink-cur {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes chat-bg-float {
          0%,100% { transform: translateY(0); opacity: 0.035; }
          50%      { transform: translateY(-14px); opacity: 0.07; }
        }
        .msg-wrap:hover .copy-btn { opacity: 1 !important; }
        .prompt-chip:hover {
          background: rgba(99,102,241,0.14) !important;
          border-color: rgba(99,102,241,0.45) !important;
          color: var(--primary-text) !important;
        }
        .send-btn:hover:not(:disabled) {
          box-shadow: 0 4px 20px rgba(99,102,241,0.5) !important;
          transform: translateY(-1px);
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        textarea:focus { outline: none; border-color: var(--accent-main) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
      `}</style>

      {/* ── Subtle physics formula background ── */}
      {['F=ma', 'E=mc²', 'v=fλ', 'ΔKE=W', 'p=mv', 'ω=2πf', 'PV=nRT', 'τ=Iα'].map((f, i) => (
        <div key={f} style={{
          position: 'fixed',
          left: `${8 + (i * 12) % 88}%`,
          top: `${10 + (i * 17) % 80}%`,
          fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
          color: 'var(--primary-text)',
          opacity: 0.035,
          pointerEvents: 'none', userSelect: 'none',
          animation: `chat-bg-float ${12 + i * 1.5}s ${i * 1.2}s ease-in-out infinite`,
          zIndex: 0,
        }}>{f}</div>
      ))}

      <AppNav />

      {/* ── Topic banner ── */}
      <div style={{
        maxWidth: 720, margin: '0 auto', width: '100%',
        padding: '18px 24px 0', position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            border: '1.5px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--accent-main)" strokeWidth={1.8} strokeLinecap="round">
              <path d="M9 18V5l12-2v13" /><circle cx={6} cy={18} r={3} /><circle cx={18} cy={16} r={3} />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--primary-text)' }}>
              {topicName || 'Physics AI Tutor'}
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--primary-text-muted)', marginTop: 1 }}>
              {topicName ? `Byte Wave AI · ${topicName}` : 'Byte Wave AI · Ask anything about physics'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => { setMessages([]); setError(null) }}
              style={{
                background: 'none', border: '1px solid var(--border-light)',
                borderRadius: 8, padding: '6px 12px',
                color: 'var(--primary-text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              New chat
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/forum')}
            style={{
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 8, padding: '6px 12px',
              color: 'var(--accent-main)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Community →
          </button>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div
        ref={listRef}
        style={{
          flex: 1, overflow: 'auto', padding: '20px 24px 12px',
          display: 'flex', flexDirection: 'column', gap: 20,
          maxWidth: 720, margin: '0 auto', width: '100%',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Empty state — quick prompts */}
        {messages.length === 0 && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', textAlign: 'center', gap: 20 }}>
            {/* Hero badge */}
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(99,102,241,0.4)',
            }}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <path d="M2 12 Q6 6 12 12 Q18 18 22 12" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" fill="none" />
                <circle cx={12} cy={12} r={2.5} fill="#fff" />
              </svg>
            </div>
            <div>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--primary-text)' }}>
                {topicName ? `Let's tackle ${topicName}` : 'Byte Wave AI Tutor'}
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--primary-text-muted)', maxWidth: 340 }}>
                {topicName
                  ? `Your AI tutor will ask you a question — answer it to get personalised feedback.`
                  : `Ask any physics question. Get clear explanations with real-world examples.`}
              </p>
            </div>

            {/* Quick prompt chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 520 }}>
              {quickPrompts.map(q => (
                <button
                  key={q}
                  type="button"
                  className="prompt-chip"
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '8px 14px', borderRadius: 20,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--primary-text-muted)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Feature tags */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: '⚡', label: 'Instant answers' },
                { icon: '🎯', label: 'Gap analysis' },
                { icon: '📐', label: 'Formula support' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ fontSize: 12, color: 'var(--primary-text-muted)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span>{icon}</span>{label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading initial message from topic */}
        {messages.length === 0 && loading && topicName && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <BWAvatar />
            <div style={{
              padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              borderLeft: '3px solid #6366f1',
            }}>
              <ThinkingDots />
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} isLatestAI={i === latestAIIndex} />
        ))}

        {/* Thinking indicator while awaiting reply */}
        {loading && messages.length > 0 && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <BWAvatar />
            <div style={{
              padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              borderLeft: '3px solid #6366f1',
            }}>
              <ThinkingDots />
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', fontSize: 13,
          }}>{error}</div>
        )}
      </div>

      {/* Related community posts */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <RelatedPanel posts={relatedPosts} navigate={navigate} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-light)',
        padding: '16px 24px',
        position: 'relative', zIndex: 1,
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 720, margin: '0 auto',
            display: 'flex', gap: 10, alignItems: 'flex-end',
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={loading ? 'Byte Wave is thinking…' : 'Ask a physics question… (Enter to send, Shift+Enter for new line)'}
              rows={1}
              disabled={loading}
              style={{
                width: '100%', padding: '13px 16px',
                borderRadius: 12, border: '2px solid var(--border-light)',
                background: 'var(--bg-card)', color: 'var(--primary-text)',
                fontSize: 14, fontFamily: 'var(--font-body)',
                resize: 'none', minHeight: 48, maxHeight: 120,
                lineHeight: 1.5, transition: 'border-color 0.15s, box-shadow 0.15s',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-btn"
            style={{
              padding: '13px 22px', borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'box-shadow 0.15s, transform 0.15s',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            {loading
              ? <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" style={{ animation: 'thinking-bounce 0.8s ease-in-out infinite' }}><circle cx={12} cy={12} r={9} /></svg>
              : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            }
            {loading ? 'Thinking' : 'Send'}
          </button>
        </form>

        <p style={{
          maxWidth: 720, margin: '8px auto 0',
          fontSize: 11, color: 'var(--primary-text-muted)',
          textAlign: 'center',
        }}>
          Powered by MiniMax · Byte Wave AI may make mistakes — verify key formulas.
        </p>
      </div>
    </div>
  )
}
