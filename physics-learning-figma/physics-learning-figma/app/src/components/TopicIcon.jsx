import { getTopicById } from '../physicsTopics'

const styles = {
  wrap: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--bg-glass)',
    border: '2px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    lineHeight: 1,
    flexShrink: 0,
  },
  small: {
    width: 44,
    height: 44,
    fontSize: 22,
  },
}

export default function TopicIcon({ topicId, size = 'default' }) {
  const topic = topicId ? getTopicById(topicId) : null
  if (!topic || !topic.icon) return null
  return (
    <div style={{ ...styles.wrap, ...(size === 'small' ? styles.small : {}) }} aria-hidden>
      {topic.icon}
    </div>
  )
}
