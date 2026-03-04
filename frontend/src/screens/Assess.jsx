import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { ButtonPrimary } from '../components/ButtonPrimary'
import Skeleton from '../components/Skeleton'
import { getTopicById } from '../physicsTopics'

function AssessSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[200, 80, 140].map((h, i) => (
        <Skeleton key={i} height={h} borderRadius={12} style={{ width: '100%' }} />
      ))}
    </div>
  )
}

/* Single question block */
function QuestionBlock({ index, total, question, hint, value, onChange, result }) {
  const [showHint, setShowHint] = useState(false)
  const borderColor = result
    ? result.correct ? 'var(--accent-success)' : 'var(--accent-error, #ef4444)'
    : value.trim().length > 0 ? 'var(--accent-main)' : 'var(--border-light)'

  return (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid ${borderColor}`,
      borderRadius: 14, padding: '20px 22px', marginBottom: 16,
      transition: 'border-color 0.2s',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-main)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
        Question {index + 1} of {total}
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, lineHeight: 1.5 }}>
        {question}
      </div>

      {/* Hint toggle */}
      <button
        onClick={() => setShowHint(h => !h)}
        style={{
          background: 'none', border: '1px solid var(--border-light)', borderRadius: 8,
          padding: '5px 12px', color: 'var(--accent-main)', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', marginBottom: showHint ? 10 : 14,
        }}
      >
        💡 {showHint ? 'Hide hint' : 'Show hint'}
      </button>
      {showHint && (
        <div style={{
          background: 'rgba(99,102,241,0.07)', borderRadius: 8, padding: '10px 14px',
          fontSize: 13, color: 'var(--primary-text-muted)', marginBottom: 14,
          borderLeft: '3px solid var(--accent-main)',
        }}>
          {hint}
        </div>
      )}

      {/* Answer textarea */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your answer here…"
        rows={3}
        disabled={!!result}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10,
          border: `1.5px solid ${borderColor}`,
          background: result
            ? result.correct ? 'rgba(52,211,153,0.06)' : 'rgba(239,68,68,0.06)'
            : 'var(--bg-input, var(--bg-card))',
          color: 'var(--primary-text)', fontFamily: 'var(--font-body)',
          fontSize: 14, resize: 'vertical', minHeight: 72,
          outline: 'none', transition: 'border-color 0.2s',
        }}
      />

      {/* Per-question feedback after submit */}
      {result && (
        <div style={{ marginTop: 10, fontSize: 13 }}>
          <span style={{
            fontWeight: 700,
            color: result.correct ? 'var(--accent-success)' : 'var(--accent-error, #ef4444)',
            marginRight: 8,
          }}>
            {result.correct ? '✓ Correct' : '✗ Incorrect'}
          </span>
          {result.feedback && (
            <span style={{ color: 'var(--primary-text-muted)' }}>{result.feedback}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default function Assess() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const skillId = searchParams.get('skill')

  // Guard: redirect to skill map if skill param is missing to avoid /api/cases/null
  useEffect(() => {
    if (!skillId) navigate('/learn/skill-map', { replace: true })
  }, [skillId, navigate])

  const topic = getTopicById(skillId)

  const [caseData, setCaseData] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState(null)   // null = not submitted yet

  const studentId = localStorage.getItem('physimate_student_id') || '1'

  /* Load case info + generate questions */
  useEffect(() => {
    setLoading(true)
    setResults(null)

    fetch(`/api/cases/${skillId}`)
      .then(r => r.json())
      .then(data => {
        const found = data.find(c => c.id.toString() === caseId.toString())
        setCaseData(found || null)

        if (!found) { setLoading(false); return }

        // Generate 3 adaptive questions from PhysiMate
        return fetch('/api/learn/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, skill: skillId, case_id: caseId }),
        })
          .then(r => r.json())
          .then(d => {
            setSessionId(d.session_id)
            const qs = d.questions || []
            setQuestions(qs)
            setAnswers(qs.map(() => ''))
            setLoading(false)
          })
      })
      .catch(() => {
        // Fallback: show a single case question
        setQuestions([{
          question: 'Describe the key concept and apply the relevant formula to solve the problem.',
          hint: 'Think about which formula connects the quantities given.',
          answer: '',
          misconception: '',
        }])
        setAnswers([''])
        setLoading(false)
      })
  }, [caseId, skillId])

  const allAnswered = answers.every(a => a.trim().length >= 5)

  const handleSubmit = async () => {
    setSubmitting(true)
    const qaPairs = questions.map((q, i) => ({
      question:       q.question,
      answer:         q.answer,
      misconception:  q.misconception,
      student_answer: answers[i] || '',
    }))

    try {
      const r = await fetch('/api/learn/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          session_id: sessionId || 'bw_session',
          skill: skillId,
          case_id: caseId,
          qa_pairs: qaPairs,
        }),
      })
      const evaluation = await r.json()
      setResults(evaluation)

      // Navigate to Feedback screen with full data
      navigate('/learn/feedback', {
        state: {
          caseId,
          caseTitle: caseData?.title || 'Practice case',
          skillId,
          evaluation,
          qaPairs,
        },
      })
    } catch (err) {
      console.error('Submit failed', err)
      setSubmitting(false)
    }
  }

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
            {topic ? topic.name : skillId}
          </Link>
        </>}
        {caseData && <>
          <span>›</span>
          <span style={{ color: 'var(--primary-text)', fontWeight: 600 }}>{caseData.title}</span>
        </>}
      </div>

      {loading ? (
        <AssessSkeleton />
      ) : !caseData ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--primary-text-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          Case not found
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--accent-main)', fontWeight: 600, cursor: 'pointer', fontSize: 14, display: 'block', margin: '12px auto 0' }}>
            ← Go back
          </button>
        </div>
      ) : (
        <>
          {/* Case header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-main)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>
              {topic?.name} · Case
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{caseData.title}</h1>
            {caseData.description && (
              <p style={{ color: 'var(--primary-text-muted)', fontSize: 14 }}>{caseData.description}</p>
            )}
          </div>

          {/* Questions */}
          {questions.map((q, i) => (
            <QuestionBlock
              key={i}
              index={i}
              total={questions.length}
              question={q.question}
              hint={q.hint}
              value={answers[i] || ''}
              onChange={val => setAnswers(prev => prev.map((a, j) => j === i ? val : a))}
              result={results?.results?.[i] || null}
            />
          ))}

          {/* Submit */}
          {!results && (
            <div style={{ marginTop: 8 }}>
              <ButtonPrimary
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? 'Grading…' : 'Get AI feedback →'}
              </ButtonPrimary>
              {!allAnswered && (
                <p style={{ marginTop: 8, fontSize: 12, color: 'var(--primary-text-muted)' }}>
                  Write at least 5 characters in each answer to submit
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
