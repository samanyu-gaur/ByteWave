import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SYSTEM_PROMPT = `You are a friendly physics tutor for Byte Wave, a high school physics learning app. You help students with motion, forces, energy, waves, electricity, magnetism, kinematics, and related topics. Keep answers clear and concise. Use simple language and examples when helpful.`

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--primary-bg)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(12px)',
    borderBottom: '2px solid var(--graph-axis-thick)',
  },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--primary-text)' },
  backLink: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--rec-high)',
    textDecoration: 'none',
  },
  messages: {
    flex: 1,
    overflow: 'auto',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 720,
    margin: '0 auto',
    width: '100%',
  },
  message: {
    padding: '14px 18px',
    borderRadius: 12,
    maxWidth: '85%',
    lineHeight: 1.5,
    fontSize: 15,
  },
  user: {
    alignSelf: 'flex-end',
    background: 'var(--gradient-accent)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  assistant: {
    alignSelf: 'flex-start',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderLeft: '3px solid var(--graph-axis-thick)',
    color: 'var(--primary-text)',
  },
  inputRow: {
    padding: 20,
    background: 'var(--bg-glass)',
    borderTop: '1px solid var(--border-light)',
  },
  form: {
    maxWidth: 720,
    margin: '0 auto',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: 12,
    border: '2px solid var(--border-light)',
    background: 'var(--bg-card)',
    color: 'var(--primary-text)',
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    resize: 'none',
    minHeight: 48,
    maxHeight: 120,
  },
  sendBtn: {
    padding: '14px 24px',
    borderRadius: 8,
    border: '2px solid var(--accent-main)',
    background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.12) 100%)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
  },
  error: {
    padding: 12,
    borderRadius: 8,
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#fca5a5',
    fontSize: 14,
    marginTop: 8,
  }
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    const userMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        userMessage,
      ]

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })

      if (!res.ok) throw new Error("Failed to get reply from server")

      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message || 'Failed to get reply')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Physics Chat</h1>
        <Link to="/" style={styles.backLink}>← Back to home</Link>
      </header>

      <div ref={listRef} style={styles.messages}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--primary-text-muted)', margin: 0 }}>Ask anything about physics. Try: &quot;Explain Newton’s first law&quot; or &quot;What is kinetic energy?&quot;</p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.message, ...(m.role === 'user' ? styles.user : styles.assistant) }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, ...styles.assistant }}>Thinking…</div>
        )}
      </div>

      <div style={styles.inputRow}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <textarea
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about physics..."
            rows={1}
            disabled={loading}
          />
          <button type="submit" style={styles.sendBtn} disabled={loading}>
            Send
          </button>
        </form>
        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  )
}
