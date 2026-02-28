import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import PhysicsLoader from '../components/PhysicsLoader'
import FeedbackCard from '../components/FeedbackCard'
import MasteryScore from '../components/MasteryScore'
import { ButtonPrimary, ButtonText } from '../components/ButtonPrimary'

const MOCK_FEEDBACK_POOL = [
  'Good attempt! You identified the key variables correctly.',
  'Make sure to show each step of your working — examiners award marks for method, not just the final answer.',
  'Your answer shows you understand the core concept. Try substituting numbers earlier to check your algebra.',
  'Watch your units — always write them alongside every quantity, especially in multi-step problems.',
  'Nice work applying the formula. As a next step, try a harder variant where one variable is unknown.',
]

function getMockFeedback(answer) {
  if (!answer || answer.trim().length < 20) {
    return 'Your answer was quite brief. Try to show your full working: write down the formula, substitute values, and state units with your final answer.'
  }
  const a = MOCK_FEEDBACK_POOL[1]
  const b = MOCK_FEEDBACK_POOL[Math.floor(Math.random() * (MOCK_FEEDBACK_POOL.length - 2)) + 2]
  return `${a} ${b}`
}

function getMockScore(answer = '') {
  const words = answer.trim().split(/\s+/).filter(Boolean).length
  // Flat tiers — not proportional to word count
  if (words < 5) return 28
  if (words < 15) return 52
  if (words < 30) return 68
  return 74
}

const SESSION_KEY = 'bw_feedback_state'

export default function Feedback() {
  const navigate = useNavigate()
  const location = useLocation()

  // Restore from sessionStorage if we arrived without state (e.g. after refresh)
  const restoredState = (() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
  })()
  const state = (location.state && Object.keys(location.state).length > 0)
    ? location.state
    : (restoredState || {})

  const caseId = state.caseId
  const caseTitle = state.caseTitle || 'Practice case'
  const question = state.question || ''
  const answer = state.answer || ''
  const skillId = state.skillId

  // Persist incoming state so refresh works
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(location.state)) } catch { }
    }
  }, [location.state])

  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    if (!caseId || !answer) {
      setFeedback(getMockFeedback(''))
      setScore(getMockScore(''))
      setLoading(false)
      return
    }

    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1, case_id: caseId, user_answer: answer }),
    })
      .then(res => res.json())
      .then(data => {
        setFeedback(data.llm_feedback)
        setScore(Math.round(data.llm_score * 100))
        setLoading(false)
      })
      .catch(() => {
        setFeedback(getMockFeedback(answer))
        setScore(getMockScore(answer))
        setLoading(false)
      })
  }, [caseId, answer])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640, margin: '0 auto' }}>

      {loading ? (
        <>
          <div style={{
            padding: '20px 24px',
            background: 'var(--bg-card)', border: '1px solid var(--border-light)',
            borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <PhysicsLoader label="AI tutor is reviewing your response…" />
          </div>
          {[80, 120, 60].map((h, i) => (
            <Skeleton key={i} height={h} borderRadius={14} delay={i * 0.18} />
          ))}
        </>
      ) : (
        <>
          {/* ── Case title ── */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderLeft: '3px solid var(--graph-axis-thick)',
            borderRadius: '0 12px 12px 12px',
          }}>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--primary-text-muted)' }}>Case</p>
            <p className="text-h3" style={{ margin: 0 }}>{caseTitle}</p>
          </div>

          {/* ── Question recap ── */}
          {question && (
            <div style={{
              padding: '14px 18px',
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 12,
            }}>
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent-main)' }}>Question</p>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--primary-text)', lineHeight: 1.6 }}>{question}</p>
            </div>
          )}

          {/* ── Your answer (collapsible) ── */}
          {answer && (
            <div style={{
              border: '1px solid var(--border-light)',
              borderRadius: 12,
              overflow: 'hidden',
              background: 'var(--bg-card)',
            }}>
              <button
                type="button"
                onClick={() => setShowAnswer(o => !o)}
                style={{
                  width: '100%', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--primary-text-muted)' }}>Your answer</span>
                <span style={{ fontSize: 12, color: 'var(--primary-text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: showAnswer ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {showAnswer && (
                <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--primary-text)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{answer}</p>
                </div>
              )}
            </div>
          )}

          {/* ── AI Feedback ── */}
          <FeedbackCard
            feedback={feedback || 'No feedback generated.'}
            suggestedCase="Back to Dashboard"
            onTrySuggested={() => navigate('/learn')}
          />

          {/* ── Session score ── */}
          <MasteryScore label="Session score" percent={score} />

          {/* ── Actions ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <ButtonPrimary onClick={() => navigate('/learn/skill-map')}>Back to skill map</ButtonPrimary>
            {skillId && (
              <ButtonText onClick={() => navigate(`/learn/choose-case?skill=${skillId}`)}>
                Try another case →
              </ButtonText>
            )}
            {caseId && skillId && (
              <ButtonText onClick={() => navigate(`/learn/assess/${caseId}?skill=${skillId}`)}>
                Retry same case
              </ButtonText>
            )}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(feedback).catch(() => { })
              }}
              style={{
                padding: '8px 14px', borderRadius: 8,
                background: 'none', border: '1px solid var(--border-light)',
                color: 'var(--primary-text-muted)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <svg width={13} height={13} viewBox="0 0 12 12" fill="none">
                <rect x={4} y={1} width={7} height={8} rx={1.5} stroke="currentColor" strokeWidth={1.2} />
                <rect x={1} y={3.5} width={7} height={8} rx={1.5} stroke="currentColor" strokeWidth={1.2} fill="var(--bg-card)" />
              </svg>
              Copy feedback
            </button>
          </div>
        </>
      )}
    </div>
  )
}
