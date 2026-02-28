import React, { memo } from 'react'
import TopicIcon from './TopicIcon'

const stateStyles = {
  'not-started': {
    background: 'var(--bg-card)',
    border: '1px solid var(--skill-not-started)',
    borderLeft: '3px solid var(--skill-not-started)',
    color: 'var(--primary-text-muted)',
  },
  'in-progress': {
    background: 'rgba(251, 191, 36, 0.12)',
    border: '1px solid var(--skill-in-progress)',
    borderLeft: '3px solid var(--skill-in-progress)',
    color: 'var(--primary-text)',
  },
  mastered: {
    background: 'rgba(52, 211, 153, 0.12)',
    border: '1px solid var(--skill-mastered)',
    borderLeft: '3px solid var(--skill-mastered)',
    color: 'var(--primary-text)',
  },
}

const styles = {
  node: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
    padding: '14px 20px',
    paddingLeft: 18,
    borderRadius: '0 12px 0 0',
    cursor: 'pointer',
    gap: 14,
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
    backdropFilter: 'blur(8px)',
  },
  nodeHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
}

export default memo(function SkillMapNode({ name, state = 'not-started', topicId, onClick }) {
  const [hover, setHover] = React.useState(false)
  const base = { ...styles.node, ...stateStyles[state], ...(hover ? styles.nodeHover : {}) }
  return (
    <button
      type="button"
      style={base}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.left}>
        {topicId && <TopicIcon topicId={topicId} size="small" />}
        <span className="text-h3" style={{ margin: 0 }}>{name}</span>
      </div>
      {state === 'in-progress' && (
        <span style={{ ...styles.label, color: 'var(--skill-in-progress)' }}>In progress</span>
      )}
      {state === 'mastered' && (
        <span style={{ ...styles.label, color: 'var(--skill-mastered)' }}>✓ Mastered</span>
      )}
    </button>
  )
})
