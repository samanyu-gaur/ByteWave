import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import MasteryScore from '../components/MasteryScore'
import TopicIcon from '../components/TopicIcon'
import { FormulaBadge } from '../components/PhysicsGraphic'
import { MOCK_RECOMMENDATIONS } from '../mockData'

/* ── small arrow icon ── */
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const matchColor = (pct) =>
  pct >= 85 ? 'var(--accent-success)' : pct >= 65 ? 'var(--accent-warning)' : 'var(--rec-low)'

/* ── Next for you — horizontal pill card ── */
function NextCard({ title, matchPercent, topicId, reason, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        borderRadius: 14,
        background: hover ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderLeft: `3px solid ${matchColor(matchPercent)}`,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s ease, transform 0.2s ease, box-shadow 0.2s ease',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
        width: '100%',
      }}
    >
      <TopicIcon topicId={topicId} size="small" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: 'var(--primary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
        {reason && <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--primary-text-muted)' }}>{reason}</p>}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-readout)', fontWeight: 700, fontSize: 16, color: matchColor(matchPercent) }}>{matchPercent}%</p>
        <p style={{ margin: 0, fontSize: 10, color: 'var(--primary-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>match</p>
      </div>
    </button>
  )
}

/* ── Review / Ready to master — compact row card ── */
function RowCard({ title, reason, topicId, tag, tagColor, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 12,
        background: hover ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s ease',
        width: '100%',
      }}
    >
      <TopicIcon topicId={topicId} size="small" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--primary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
        {reason && <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--primary-text-muted)' }}>{reason}</p>}
      </div>
      {tag && (
        <span style={{ fontSize: 11, fontWeight: 700, color: tagColor, background: `${tagColor}18`, padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>
          {tag}
        </span>
      )}
      <span style={{ color: 'var(--primary-text-muted)', flexShrink: 0 }}><ArrowRight /></span>
    </button>
  )
}

/* ── Section label ── */
function SectionLabel({ title, sub }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--primary-text)' }}>{title}</h2>
        {sub && <span style={{ fontSize: 12, fontFamily: 'var(--font-formula)', fontStyle: 'italic', color: 'var(--primary-text-muted)' }}>{sub}</span>}
      </div>
      <div style={{ height: 1, background: 'var(--border-light)', marginTop: 8 }} />
    </div>
  )
}

const NAME_KEY = 'bw_name'

export default function Home() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  // First-name personalization
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || '')
  const [nameInput, setNameInput] = useState('')
  const [showNamePrompt, setShowNamePrompt] = useState(() => !localStorage.getItem(NAME_KEY))

  const saveName = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    localStorage.setItem(NAME_KEY, trimmed)
    setName(trimmed)
    setShowNamePrompt(false)
  }

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/recommendations/1`)
      .then(res => res.json())
      .then(data => { setRecommendations(data); setLoading(false) })
      .catch(() => { setRecommendations(MOCK_RECOMMENDATIONS); setLoading(false) })
  }, [])

  const nextForYou = recommendations.filter(r => r.recommendation_type === 'Next for you')
  const review = recommendations.filter(r => r.recommendation_type === 'Review')
  const readyToMaster = recommendations.filter(r => r.recommendation_type === 'Ready to master')

  const masteryPercent = useMemo(() => {
    if (!recommendations.length) return 0
    const scores = recommendations.map(r => r.mastery_score ?? r.match_score ?? 0)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }, [recommendations])

  const displayName = name || 'Student'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Name prompt banner ── */}
      {showNamePrompt && (
        <div style={{
          padding: '14px 18px',
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 14, color: 'var(--primary-text)', fontWeight: 600, flex: '1 1 auto' }}>
            What should we call you?
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              placeholder="Your first name…"
              style={{
                padding: '7px 12px', borderRadius: 8,
                border: '1.5px solid var(--border-light)',
                background: 'var(--bg-card)', color: 'var(--primary-text)',
                fontSize: 14, width: 160,
              }}
            />
            <button
              type="button"
              onClick={saveName}
              style={{
                padding: '7px 16px', borderRadius: 8,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
              }}
            >Save</button>
            <button
              type="button"
              onClick={() => setShowNamePrompt(false)}
              style={{
                padding: '7px 10px', borderRadius: 8,
                background: 'none', border: '1px solid var(--border-light)',
                color: 'var(--primary-text-muted)', fontSize: 13, cursor: 'pointer',
              }}
            >Skip</button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="text-h1" style={{ margin: 0 }}>Hi, {displayName}</h1>
            <FormulaBadge formula="ΣF = ma" />
          </div>
          <p className="text-body-small" style={{ margin: 0 }}>Here's your personalised study plan.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/learn/skill-map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 18px',
            borderRadius: 10,
            border: '1px solid var(--border-medium)',
            background: 'var(--bg-card)',
            color: 'var(--primary-text)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Full skill map <ArrowRight />
        </button>
      </div>

      {/* ── Overall mastery ── */}
      <MasteryScore label="Overall Physics" percent={loading ? 0 : masteryPercent} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} height={60} borderRadius={14} delay={i * 0.12} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── Next for you ── */}
          {nextForYou.length > 0 && (
            <div>
              <SectionLabel title="Next for you" sub="high match → start here" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {nextForYou.map(t => (
                  <NextCard
                    key={t.item_id}
                    title={t.item_name}
                    matchPercent={Math.round(t.match_score)}
                    topicId={t.item_id}
                    reason={t.reason}
                    onClick={() => navigate('/learn/choose-case?skill=' + t.item_id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Review + Ready to master side by side on wide screens ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>

            {review.length > 0 && (
              <div>
                <SectionLabel title="Review" sub="keep it sharp" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {review.map(t => (
                    <RowCard
                      key={t.item_id}
                      title={t.item_name}
                      reason={t.reason}
                      topicId={t.item_id}
                      tag="Review"
                      tagColor="var(--accent-warning)"
                      onClick={() => navigate('/learn/choose-case?skill=' + t.item_id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {readyToMaster.length > 0 && (
              <div>
                <SectionLabel title="Ready to master" sub="Δ mastery ≈ 0" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {readyToMaster.map(t => (
                    <RowCard
                      key={t.item_id}
                      title={t.item_name}
                      reason={t.reason}
                      topicId={t.item_id}
                      tag="Close!"
                      tagColor="var(--accent-success)"
                      onClick={() => navigate('/learn/choose-case?skill=' + t.item_id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {nextForYou.length === 0 && review.length === 0 && readyToMaster.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--primary-text-muted)' }}>
              <p style={{ fontSize: 16, margin: '0 0 12px' }}>No recommendations yet.</p>
              <button type="button" onClick={() => navigate('/learn/skill-map')} style={{ color: 'var(--accent-main)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
                Browse the skill map →
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
