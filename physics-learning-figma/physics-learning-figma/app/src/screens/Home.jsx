import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MasteryScore from '../components/MasteryScore'
import SectionRow from '../components/SectionRow'
import RecommendationCard from '../components/RecommendationCard'
import CaseCard from '../components/CaseCard'
import { ButtonText } from '../components/ButtonPrimary'
import { FormulaBadge } from '../components/PhysicsGraphic'
import { PHYSICS_TOPICS } from '../physicsTopics'

const content = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
}

// Split all 12 topics: 4 Next for you, 4 Review, 4 Ready to master (mock match %)
const NEXT_FOR_YOU = PHYSICS_TOPICS.slice(0, 4).map((t, i) => ({ ...t, matchPercent: [92, 85, 78, 72][i] }))
const REVIEW = PHYSICS_TOPICS.slice(4, 8)
const READY_TO_MASTER = PHYSICS_TOPICS.slice(8, 12)

export default function Home() {
  const navigate = useNavigate()

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // We are hardcoding user_id = 1 for this demo integration
    fetch('/api/recommendations/1')
      .then(res => res.json())
      .then(data => {
        setRecommendations(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch recommendations", err)
        setLoading(false)
      })
  }, [])

  const nextForYou = recommendations.filter(r => r.recommendation_type === "Next for you")
  const review = recommendations.filter(r => r.recommendation_type === "Review")
  const readyToMaster = recommendations.filter(r => r.recommendation_type === "Ready to master")

  return (
    <div style={content}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 className="text-h1" style={{ margin: 0 }}>Hi, Student</h1>
          <FormulaBadge formula="ΣF = ma" />
        </div>
        <p className="text-body-small" style={{ margin: 0 }}>Here’s what’s next.</p>
      </div>
      <MasteryScore label="Physics" percent={loading ? 0 : 72} /> {/* Mock total physics score */}
      <ButtonText onClick={() => navigate('/learn/skill-map')}>Open full skill map</ButtonText>

      {loading ? (
        <p>Loading your personalized plan...</p>
      ) : (
        <>
          {nextForYou.length > 0 && (
            <SectionRow title="Next for you" formulaSubtitle="high match → start here">
              {nextForYou.map((t) => (
                <RecommendationCard
                  key={`next-${t.item_id}`}
                  title={t.item_name}
                  matchPercent={Math.round(t.match_score)}
                  topicId={t.item_id}
                  onClick={() => navigate('/learn/choose-case?skill=' + t.item_id)}
                />
              ))}
            </SectionRow>
          )}

          {review.length > 0 && (
            <SectionRow title="Review" formulaSubtitle="keep sharp">
              {review.map((t) => (
                <CaseCard
                  key={`rev-${t.item_id}`}
                  title={t.item_name}
                  subtitle={t.reason}
                  topicId={t.item_id}
                  matchPercent={Math.round(t.match_score)}
                  onClick={() => navigate('/learn/choose-case?skill=' + t.item_id)}
                />
              ))}
            </SectionRow>
          )}

          {readyToMaster.length > 0 && (
            <SectionRow title="Ready to master" formulaSubtitle="Δ mastery ≈ 0">
              {readyToMaster.map((t) => (
                <CaseCard
                  key={`ready-${t.item_id}`}
                  title={t.item_name}
                  subtitle={t.reason}
                  topicId={t.item_id}
                  matchPercent={Math.round(t.match_score)}
                  onClick={() => navigate('/learn/choose-case?skill=' + t.item_id)}
                />
              ))}
            </SectionRow>
          )}

          {nextForYou.length === 0 && review.length === 0 && readyToMaster.length === 0 && (
            <p>No recommendations available right now. Choose a skill from the skill map!</p>
          )}
        </>
      )}
    </div>
  )
}
