import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import FeedbackCard from '../components/FeedbackCard'
import MasteryScore from '../components/MasteryScore'
import { ButtonPrimary, ButtonText } from '../components/ButtonPrimary'

const content = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  maxWidth: 640,
  margin: '0 auto',
}

export default function Feedback() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}

  const caseId = state.caseId
  const caseTitle = state.caseTitle || 'Position vs time'
  const question = state.question
  const answer = state.answer
  // skillId is used to go back to choosing another case
  const skillId = state.skillId

  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!caseId || !answer) {
      setLoading(false)
      return
    }

    // We are hardcoding user_id = 1
    fetch('/api/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1,
        case_id: parseInt(caseId),
        user_answer: answer
      })
    })
      .then(res => res.json())
      .then(data => {
        setFeedback(data.llm_feedback)
        setScore(Math.round(data.llm_score * 100))
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to assess answer", err)
        setFeedback("There was an issue connecting to the AI tutor. Please try again.")
        setLoading(false)
      })
  }, [caseId, answer])

  return (
    <>
      <NavBar back title="Feedback" />
      <div style={content}>
        {loading ? (
          <div style={{ padding: 24, background: 'var(--bg-card)', borderRadius: 16 }}>
            <h3 className="text-h3" style={{ margin: '0 0 8px' }}>The AI is analyzing your answer...</h3>
          </div>
        ) : (
          <FeedbackCard
            feedback={feedback || "No feedback generated."}
            suggestedCase="Review Dashboard"
            onTrySuggested={() => navigate('/')}
          />
        )}

        <MasteryScore label="Current Mastery" percent={score} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <ButtonPrimary onClick={() => navigate('/learn/skill-map')}>Back to skill map</ButtonPrimary>
          <ButtonText onClick={() => navigate(`/learn/choose-case?skill=${skillId}`)}>Choose another case</ButtonText>
        </div>
      </div>
    </>
  )
}
