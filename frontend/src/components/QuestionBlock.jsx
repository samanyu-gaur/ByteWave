const styles = {
  block: {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(8px)',
    border: '1px solid var(--border-light)',
    borderLeft: '3px solid var(--graph-axis-thick)',
    borderRadius: '0 16px 0 0',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--primary-text-muted)',
  },
  question: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.65,
    color: 'var(--primary-text)',
    whiteSpace: 'pre-wrap',
  },
  divider: {
    height: 1,
    background: 'var(--border-light)',
    margin: '0 -24px',
  },
  answerLabel: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--primary-text-muted)',
  },
  textarea: {
    width: '100%',
    minHeight: 120,
    maxHeight: 280,
    borderRadius: 10,
    border: '1px solid var(--border-medium)',
    padding: '14px 16px',
    fontSize: 15,
    lineHeight: 1.6,
    color: 'var(--primary-text)',
    background: 'rgba(0,0,0,0.2)',
    fontFamily: 'var(--font-body)',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  hint: {
    margin: 0,
    fontSize: 12,
    color: 'var(--primary-text-muted)',
    fontStyle: 'italic',
  },
}

export default function QuestionBlock({ question, value, onChange, placeholder = 'Show your working — write each step, include units, and state your final answer clearly.' }) {
  return (
    <div style={styles.block}>
      <p style={styles.label}>Question</p>
      <p style={styles.question}>{question}</p>
      <div style={styles.divider} />
      <p style={styles.answerLabel}>Your answer</p>
      <textarea
        style={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
      <p style={styles.hint}>Tip: show each step of your working — examiners award marks for method, not just the final answer.</p>
    </div>
  )
}
