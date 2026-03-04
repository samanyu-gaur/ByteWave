import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import PhysicsLoader from '../components/PhysicsLoader'
import FeedbackCard from '../components/FeedbackCard'
import MasteryScore from '../components/MasteryScore'
import { ButtonPrimary, ButtonText } from '../components/ButtonPrimary'
import { getTopicById } from '../physicsTopics'

const SESSION_KEY = 'bw_feedback_state'

/* Poll /api/job/{id} until done, returns video_url or null */
function useRemediationJob(jobId) {
  const [videoUrl, setVideoUrl] = useState(null)
  const [jobStatus, setJobStatus] = useState(jobId ? 'pending' : null)

  useEffect(() => {
    if (!jobId) return
    setJobStatus('pending')
    setVideoUrl(null)

    const MAX_MS = 130_000
    const INTERVAL = 3000
    let elapsed = 0

    const id = setInterval(async () => {
      elapsed += INTERVAL
      if (elapsed > MAX_MS) {
        clearInterval(id)
        setJobStatus('timeout')
        return
      }
      try {
        const r = await fetch(`/api/job/${jobId}`)
        if (r.status === 404) { clearInterval(id); setJobStatus('lost'); return }
        const data = await r.json()
        if (data.status === 'done' && data.result?.video_url) {
          clearInterval(id)
          setVideoUrl(data.result.video_url)
          setJobStatus('done')
        } else if (data.status === 'error') {
          clearInterval(id)
          setJobStatus('error')
        }
      } catch { clearInterval(id); setJobStatus('error') }
    }, INTERVAL)

    return () => clearInterval(id)
  }, [jobId])

  return { videoUrl, jobStatus }
}

export default function Feedback() {
  const navigate = useNavigate()
  const location = useLocation()

  const restoredState = (() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
  })()
  const state = (location.state && Object.keys(location.state).length > 0)
    ? location.state
    : (restoredState || {})

  const { caseId, caseTitle = 'Practice case', skillId, evaluation, qaPairs = [] } = state

  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(location.state)) } catch {}
    }
  }, [location.state])

  const topic = getTopicById(skillId)

  // If we arrived from old single-answer flow (no evaluation), fallback gracefully
  const score      = evaluation?.overall_score ?? Math.round((state.score || 0.5) * 100)
  const feedback   = evaluation?.summary_feedback ?? state.feedback ?? 'Good effort!'
  const gaps       = evaluation?.gaps ?? []
  const needsRem   = evaluation?.needs_remediation ?? score < 60
  const remJobId   = evaluation?.remediation_job_id ?? null
  const results    = evaluation?.results ?? []

  const { videoUrl, jobStatus } = useRemediationJob(remJobId)

  const scoreColor = score >= 80 ? 'var(--accent-success)' : score >= 50 ? 'var(--accent-warning)' : '#ef4444'
  const verdict    = score >= 80 ? 'Great job!' : score >= 50 ? 'Getting there' : 'Needs work'

  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px 80px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 20, fontSize: 13, color: 'var(--primary-text-muted)', flexWrap: 'wrap' }}>
        <Link to="/learn" style={{ color: 'var(--primary-text-muted)' }}>Dashboard</Link>
        <span>›</span>
        <Link to="/learn/skill-map" style={{ color: 'var(--primary-text-muted)' }}>Skill map</Link>
        {skillId && <>
          <span>›</span>
          <Link to={`/learn/choose-case?skill=${skillId}`} style={{ color: 'var(--primary-text-muted)' }}>
            {topic?.name || skillId}
          </Link>
        </>}
        <span>›</span>
        <span style={{ color: 'var(--primary-text)', fontWeight: 600 }}>Feedback</span>
      </div>

      {/* Case title */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-main)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
          {topic?.name} · {caseTitle}
        </div>
      </div>

      {/* Score summary */}
      <div style={{
        background: 'var(--bg-card)', border: `1px solid ${scoreColor}33`,
        borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: scoreColor, flexShrink: 0 }}>
          {score}%
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{verdict}</div>
          <div style={{ color: 'var(--primary-text-muted)', fontSize: 13 }}>{topic?.name} · {caseTitle}</div>
        </div>
      </div>

      {/* AI Feedback card */}
      <FeedbackCard feedback={feedback} />

      {/* Gaps */}
      {gaps.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-text-muted)', marginBottom: 8 }}>
            Identified gaps:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {gaps.map((g, i) => (
              <span key={i} style={{
                background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
                fontSize: 12, padding: '3px 10px', borderRadius: 99, fontWeight: 600,
              }}>
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Per-question breakdown */}
      {results.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Question breakdown</div>
          {qaPairs.map((qa, i) => {
            const r = results[i] || {}
            return (
              <div key={i} style={{
                borderLeft: `3px solid ${r.correct ? 'var(--accent-success)' : '#ef4444'}`,
                paddingLeft: 14, marginBottom: 16,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: r.correct ? 'var(--accent-success)' : '#ef4444', marginBottom: 4 }}>
                  {r.correct ? '✓ Correct' : '✗ Incorrect'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: 'var(--primary-text)' }}>
                  {qa.question}
                </div>
                <div style={{ fontSize: 12, color: 'var(--primary-text-muted)', marginBottom: r.feedback ? 4 : 0 }}>
                  Your answer: {qa.student_answer || '—'}
                </div>
                {!r.correct && r.feedback && (
                  <div style={{ fontSize: 12, color: 'var(--primary-text)', marginTop: 6 }}>
                    ✦ {r.feedback}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Mastery score */}
      <MasteryScore percent={score} label={topic?.name || 'Mastery'} />

      {/* ── Remediation animation ─────────────────────────────────────────── */}
      {needsRem && remJobId && (
        <div style={{
          marginTop: 28,
          background: 'var(--bg-card)', border: '1px solid var(--border-light)',
          borderRadius: 16, padding: '22px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
            📹 Watch: Fix your gap
          </div>
          <div style={{ fontSize: 13, color: 'var(--primary-text-muted)', marginBottom: 14 }}>
            {evaluation?.remediation_concept
              ? `Focus on: "${evaluation.remediation_concept}"`
              : 'A targeted animation is being generated to address your gap.'}
          </div>

          {/* Video area */}
          <div style={{
            background: '#000', borderRadius: 10, overflow: 'hidden',
            aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {jobStatus === 'done' && videoUrl ? (
              <video controls autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : jobStatus === 'error' || jobStatus === 'timeout' || jobStatus === 'lost' ? (
              <p style={{ color: '#71717a', fontSize: 13, textAlign: 'center', padding: 20 }}>
                Animation unavailable. Try asking in the Chat tab.
              </p>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <PhysicsLoader />
                <p style={{ color: '#71717a', fontSize: 13, marginTop: 12 }}>Generating targeted animation…</p>
              </div>
            )}
          </div>

          {/* Quick link to PhysiMate chat for the same topic */}
          {evaluation?.animation_prompt && (
            <button
              onClick={() => navigate(`/chat?q=${encodeURIComponent(evaluation.animation_prompt)}`)}
              style={{
                marginTop: 12, background: 'none', border: '1px solid var(--border-light)',
                borderRadius: 8, padding: '7px 14px',
                color: 'var(--accent-main)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              ⚡ Open in AI chat →
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
        <ButtonPrimary onClick={() => navigate('/learn/skill-map')}>
          Back to skill map
        </ButtonPrimary>
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
          onClick={() => { navigator.clipboard.writeText(feedback).catch(() => {}) }}
          style={{
            padding: '8px 14px', borderRadius: 8,
            background: 'none', border: '1px solid var(--border-light)',
            color: 'var(--primary-text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Copy feedback
        </button>
      </div>
    </div>
  )
}
