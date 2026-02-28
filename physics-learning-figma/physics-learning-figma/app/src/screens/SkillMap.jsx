import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SkillMapNode from '../components/SkillMapNode'
import MasteryScore from '../components/MasteryScore'
import { ButtonText } from '../components/ButtonPrimary'
import { FormulaBadge } from '../components/PhysicsGraphic'

const content = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

export default function SkillMap() {
  const navigate = useNavigate()
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // We are hardcoding user_id = 1 for this demo integration
    fetch('/api/progress/1')
      .then(res => res.json())
      .then(data => {
        setNodes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch skills", err)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <NavBar back title="Skill map" />
      <div style={content}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <h1 className="text-h1" style={{ margin: 0 }}>Physics</h1>
            <FormulaBadge formula={`${nodes.length} skills`} />
          </div>
          <p className="text-body-small" style={{ margin: 0 }}>Pick a topic to practice.</p>
        </div>

        {loading ? (
          <p>Loading your skill map...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {nodes.map((n) => {
              // Map API status to React component 'state' prop
              let componentState = "not-started"
              if (n.status === "In progress") componentState = "in-progress"
              if (n.status === "Mastered") componentState = "mastered"

              return (
                <SkillMapNode
                  key={n.skill_id}
                  name={n.skill_name}
                  state={componentState}
                  onClick={() => navigate('/learn/choose-case?skill=' + n.skill_id)}
                />
              )
            })}
          </div>
        )}

        <MasteryScore label="Physics" percent={72} />
        <ButtonText onClick={() => navigate('/')}>Go to dashboard</ButtonText>
      </div>
    </>
  )
}
