import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import QuestionBlock from '../components/QuestionBlock'
import { ButtonPrimary } from '../components/ButtonPrimary'

const content = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  maxWidth: 640,
  margin: '0 auto',
}

export default function Assess() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const skillId = searchParams.get('skill')

  const [caseData, setCaseData] = useState(null)
  const [answers, setAnswers] = useState([''])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app we'd fetch a single case by ID, but since our API returns all cases for a skill,
    // we'll fetch them and find ours.
    fetch(`/api/cases/${skillId}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id.toString() === caseId.toString())
        setCaseData(found)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch case", err)
        setLoading(false)
      })
  }, [caseId, skillId])

  const setAnswer = (i, value) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  const handleSubmit = () => {
    // We combine all answers into one string to send to the backend
    const combinedAnswer = answers.join('\n')
    // Provide actual user_id for API calls down the line
    navigate('/learn/feedback', {
      state: {
        caseId,
        caseTitle: caseData?.title || 'Assess',
        question: caseData?.question || '',
        answer: combinedAnswer,
        skillId
      }
    })
  }

  return (
    <>
      <NavBar back title="Assess" />
      <div style={content}>
        {loading ? (
          <p>Loading question...</p>
        ) : !caseData ? (
          <p>Case not found</p>
        ) : (
          <>
            <h1 className="text-h2" style={{ margin: 0 }}>{caseData.title}</h1>
            <p className="text-body-small">{caseData.description}</p>
            <QuestionBlock
              question={caseData.question}
              value={answers[0]}
              onChange={(v) => setAnswer(0, v)}
            />

            <ButtonPrimary block onClick={handleSubmit}>Get feedback</ButtonPrimary>
          </>
        )}
      </div>
    </>
  )
}
