const styles = {
  block: {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(8px)',
    border: '1px solid var(--border-light)',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  question: { margin: 0, fontSize: 16, color: 'var(--primary-text)' },
  input: {
    height: 52,
    borderRadius: 12,
    border: '1px solid var(--border-medium)',
    padding: '0 16px',
    fontSize: 15,
    color: 'var(--primary-text)',
    background: 'var(--primary-bg-secondary)',
  },
}

export default function QuestionBlock({ question, value, onChange, placeholder = 'Your answer…' }) {
  return (
    <div style={styles.block}>
      <p style={styles.question}>{question}</p>
      <input
        type="text"
        style={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
