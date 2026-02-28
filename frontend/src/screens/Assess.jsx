import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import QuestionBlock from '../components/QuestionBlock'
import { ButtonPrimary } from '../components/ButtonPrimary'
import Skeleton from '../components/Skeleton'
import { MOCK_CASES_BY_SKILL } from '../mockData'
import { getTopicById } from '../physicsTopics'

function AssessSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[200, 80, 140].map((h, i) => (
        <Skeleton key={i} height={h} borderRadius={14} delay={i * 0.15} />
      ))}
    </div>
  )
}

export default function Assess() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const skillId = searchParams.get('skill')
  const topic = getTopicById(skillId)

  const [caseData, setCaseData] = useState(null)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setLoading(true)
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/cases/${skillId}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id.toString() === caseId.toString())
        setCaseData(found || null)
        setLoading(false)
      })
      .catch(() => {
        const skillCases = MOCK_CASES_BY_SKILL[skillId] || []
        const found = skillCases.find(c => c.id.toString() === caseId.toString())
        setCaseData(found || null)
        setLoading(false)
      })
  }, [caseId, skillId])

  const handleSubmit = () => {
    navigate('/learn/feedback', {
      state: {
        caseId,
        caseTitle: caseData?.title || 'Practice case',
        question: caseData?.question || '',
        answer,
        skillId,
      }
    })
  }

  const canSubmit = answer.trim().length >= 5

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640, margin: '0 auto' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary-text-muted)' }}>
        <Link to="/learn" style={{ color: 'var(--primary-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
        <span>›</span>
        <Link to="/learn/skill-map" style={{ color: 'var(--primary-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Skill map</Link>
        {skillId && (
          <>
            <span>›</span>
            <Link to={`/learn/choose-case?skill=${skillId}`} style={{ color: 'var(--primary-text-muted)', textDecoration: 'none', fontWeight: 500 }}>
              {topic ? topic.name : skillId}
            </Link>
          </>
        )}
        {caseData && (
          <>
            <span>›</span>
            <span style={{ color: 'var(--primary-text)', fontWeight: 600 }}>{caseData.title}</span>
          </>
        )}
      </div>

      {loading ? (
        <AssessSkeleton />
      ) : !caseData ? (
        <div style={{
          padding: '40px 24px', textAlign: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border-light)',
          borderRadius: 16, color: 'var(--primary-text-muted)',
        }}>
          <p style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Case not found</p>
          <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--accent-main)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            ← Go back
          </button>
        </div>
      ) : (
        <>
          {/* ── Case header ── */}
          <div style={{
            padding: '16px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderLeft: '3px solid var(--graph-axis-thick)',
            borderRadius: '0 14px 14px 14px',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--primary-text-muted)' }}>
              Case
            </p>
            <h1 className="text-h2" style={{ margin: '0 0 4px' }}>{caseData.title}</h1>
            {caseData.description && (
              <p className="text-body-small" style={{ margin: 0 }}>{caseData.description}</p>
            )}
          </div>

          {/* ── Standalone Video ── */}
          {caseData.animationUrl && (
            <div style={{
              width: '100%',
              borderRadius: 14,
              overflow: 'hidden',
              background: '#000',
              border: '1px solid var(--border-light)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              <video
                src={caseData.animationUrl}
                controls
                style={{ width: '100%', display: 'block', objectFit: 'contain' }}
              />
            </div>
          )}

          {/* ── Question + answer ── */}
          <QuestionBlock
            question={caseData.question}
            value={answer}
            onChange={setAnswer}
          />

          {/* ── Character counter + hint ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <button
              type="button"
              onClick={() => setShowHint(h => !h)}
              style={{
                background: 'none', border: '1px solid var(--border-light)',
                borderRadius: 8, padding: '6px 12px',
                color: 'var(--accent-main)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12.01} y2={16} />
              </svg>
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
            <span style={{
              fontSize: 12, color: answer.trim().length >= 30
                ? 'var(--accent-success)'
                : answer.trim().length >= 5
                  ? 'var(--accent-warning)'
                  : 'var(--primary-text-muted)',
              fontFamily: 'var(--font-readout)',
            }}>
              {answer.length} chars {answer.trim().length < 30 ? '— aim for at least 30' : '✓'}
            </span>
          </div>

          {/* ── Hint panel ── */}
          {showHint && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: 13, lineHeight: 1.65, color: 'var(--primary-text)',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-main)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hint · </span>
              {caseData.hint || 'Think about which formula connects the quantities given in the problem, then substitute and solve step by step.'}
            </div>
          )}

          <ButtonPrimary block onClick={handleSubmit} disabled={!canSubmit}>
            Get AI feedback →
          </ButtonPrimary>
          {!canSubmit && (
            <p style={{ margin: '-12px 0 0', fontSize: 12, color: 'var(--primary-text-muted)', textAlign: 'center' }}>
              Write at least 5 characters to submit
            </p>
          )}
        </>
      )}
    </div>
  )
}
