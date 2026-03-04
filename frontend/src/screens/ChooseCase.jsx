import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import CaseCard from '../components/CaseCard'
import Skeleton from '../components/Skeleton'
import { MOCK_CASES_BY_SKILL } from '../mockData'
import { getTopicById } from '../physicsTopics'

function CaseSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} height={160} borderRadius={16} delay={i * 0.12} />
      ))}
    </div>
  )
}

export default function ChooseCase() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const skillId = searchParams.get('skill') || 'motion'
  const topic   = getTopicById(skillId)

  const [cases, setCases]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/cases/${skillId}`)
      .then(res => res.json())
      .then(data => { setCases(data); setLoading(false) })
      .catch(() => { setCases(MOCK_CASES_BY_SKILL[skillId] || []); setLoading(false) })
  }, [skillId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary-text-muted)' }}>
        <Link to="/learn" style={{ color: 'var(--primary-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
        <span>›</span>
        <Link to="/learn/skill-map" style={{ color: 'var(--primary-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Skill map</Link>
        <span>›</span>
        <span style={{ color: 'var(--primary-text)', fontWeight: 600 }}>{topic ? topic.name : 'Cases'}</span>
      </div>

      {/* ── Page header ── */}
      <div>
        <h1 className="text-h1" style={{ margin: '0 0 4px' }}>
          {topic ? topic.name : 'Practice cases'}
        </h1>
        <p className="text-body-small" style={{ margin: 0 }}>
          Pick a scenario, answer the question, and get AI feedback.
        </p>
      </div>

      {/* ── Cases grid ── */}
      {loading ? (
        <CaseSkeleton />
      ) : cases.length === 0 ? (
        <div style={{
          padding: '40px 24px', textAlign: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border-light)',
          borderRadius: 16, color: 'var(--primary-text-muted)',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>No cases available yet</p>
          <p style={{ margin: 0, fontSize: 14 }}>Check back soon — we're adding more.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {cases.map(c => (
            <CaseCard
              key={c.id}
              title={c.title}
              subtitle={c.description}
              topicId={skillId}
              onClick={() => navigate(`/learn/assess/${c.id}?skill=${skillId}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
