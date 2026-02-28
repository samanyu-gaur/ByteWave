import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import CaseCard from '../components/CaseCard'

const content = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

export default function ChooseCase() {
  const navigate = useNavigate()
  const location = useLocation()

  // Parse '?skill=ID' from the URL
  const searchParams = new URLSearchParams(location.search)
  const skillId = searchParams.get('skill') || 1 // fallback to 1 if no skill passed

  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/cases/${skillId}`)
      .then(res => res.json())
      .then(data => {
        setCases(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch cases", err)
        setLoading(false)
      })
  }, [skillId])

  return (
    <>
      <NavBar back title="Choose a case" />
      <div style={content}>
        <div>
          <h1 className="text-h2" style={{ margin: 0 }}>Pick a scenario to practice</h1>
          <p className="text-body-small" style={{ margin: '4px 0 0' }}>Answer questions and get personalised feedback.</p>
        </div>

        {loading ? (
          <p>Loading cases...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {cases.length === 0 && <p>No cases available for this skill.</p>}
            {cases.map((c) => (
              <CaseCard
                key={c.id}
                title={c.title}
                subtitle={c.description}
                topicId="kinematics" // using a dummy topic for the icon, could be dynamic
                onClick={() => navigate(`/learn/assess/${c.id}?skill=${skillId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
