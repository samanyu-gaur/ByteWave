import React, { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.min.css'
import AppNav from '../components/AppNav'

export default function AnimationChat() {
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(0) // 0=none, 1=plan, 2=code, 3=video
    const [error, setError] = useState(null)

    const [planHtml, setPlanHtml] = useState('')
    const [manimCode, setManimCode] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [showRetryMsg, setShowRetryMsg] = useState(false)

    const codeRef = useRef(null)

    useEffect(() => {
        if (codeRef.current) {
            // remove highlight applied classes so hljs can re-apply
            codeRef.current.removeAttribute('data-highlighted')
            codeRef.current.className = "language-python"
            hljs.highlightElement(codeRef.current)
        }
    }, [manimCode])

    const generateAnimation = async () => {
        if (!question.trim()) {
            setError("Please enter a physics question first.")
            return
        }

        // Reset UI state
        setError(null)
        setPlanHtml('')
        setManimCode('')
        setVideoUrl('')
        setShowRetryMsg(false)
        setStep(0)
        setLoading(true)

        try {
            // STEP 1: Plan
            setStep(1)
            setPlanHtml('<p style="color:var(--primary-text-muted); text-align:center; padding: 20px 0;">Analyzing physics concept and mapping to animations...</p>')

            const API_URL = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${API_URL}/api/get_animation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.detail || res.statusText || 'Failed to fetch animation data')
            }

            const data = await res.json()

            // Give a little natural feeling delay
            await new Promise(r => setTimeout(r, 600));
            setPlanHtml(marked.parse(data.plan))

            // STEP 2: Code
            setStep(2)
            setManimCode('# Retrieving matched Manim python code based on the plan...\n')

            await new Promise(r => setTimeout(r, 800));
            setManimCode(data.code)

            // STEP 3: Render (Fake build step)
            setStep(3)
            setVideoUrl('')

            // Fake rendering delay
            await new Promise(r => setTimeout(r, 1200));

            // Set the pre-rendered static video url
            setVideoUrl(data.video_url)
            setStep(4) // fully completed

        } catch (err) {
            setError(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--primary-bg)' }}>
            <AppNav />
            {/* Inline styles for AnimationChat mostly adapted from style.css */}
            <style>{`
        .glass-panel {
            background: rgba(25, 28, 35, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .step-circle {
            width: 36px; height: 36px;
            border-radius: 50%;
            border: 2px solid var(--primary-text-muted);
            background: var(--bg-card);
            display: flex; align-items: center; justify-content: center;
            font-weight: 600; font-size: 14px;
            color: var(--primary-text-muted);
            transition: all 0.3s ease;
        }
        .step.active .step-circle {
            background: var(--accent-main);
            border-color: var(--accent-main);
            color: #fff;
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }
        .step.completed .step-circle {
            background: #10b981;
            border-color: #10b981;
            color: #fff;
        }
        .step-connector {
            flex-grow: 1; height: 2px;
            background: rgba(255, 255, 255, 0.08);
            margin: 0 -10px;
        }
        .step-connector.active {
            background: linear-gradient(90deg, #10b981, var(--accent-main));
        }
      `}</style>

            <main style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>

                <header style={{ textAlign: 'center', animation: 'fadeInDown 0.8s ease-out forwards' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, margin: 0 }}>
                        Physics <span style={{ background: 'linear-gradient(135deg, var(--accent-main), #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Animator</span>
                    </h1>
                    <p style={{ color: 'var(--primary-text-muted)' }}>Turn physics questions into beautiful Manim animations</p>
                </header>

                <section className="glass-panel" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s forwards' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>What do you want to animate?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <textarea
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            placeholder="e.g. Can you show me how a pendulum swings and explain the forces?"
                            style={{
                                width: '100%', minHeight: 120,
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: 12, padding: 16,
                                color: 'var(--primary-text)', fontSize: 15,
                                fontFamily: 'var(--font-body)',
                                resize: 'vertical'
                            }}
                        />
                        <button
                            onClick={generateAnimation}
                            disabled={loading}
                            style={{
                                alignSelf: 'flex-end',
                                background: 'linear-gradient(135deg, var(--accent-main), #8b5cf6)',
                                color: 'white', border: 'none', borderRadius: 8,
                                padding: '12px 24px', fontSize: 15, fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                display: 'flex', alignItems: 'center', gap: 8,
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            {loading && <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />}
                            {loading ? 'Processing...' : 'Generate Animation'}
                        </button>
                    </div>
                </section>

                {(step > 0 || error) && (
                    <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', position: 'relative' }}>

                            <div className={`step ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2, position: 'relative' }}>
                                <div className="step-circle">1</div>
                                <div style={{ fontSize: 12, color: step >= 1 ? 'var(--primary-text)' : 'var(--primary-text-muted)' }}>Physics Plan</div>
                            </div>

                            <div className={`step-connector ${step > 1 ? 'active' : ''}`} style={{ zIndex: 1, position: 'absolute', left: 45, right: '66%', top: 18 }} />

                            <div className={`step ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2, position: 'relative' }}>
                                <div className="step-circle">2</div>
                                <div style={{ fontSize: 12, color: step >= 2 ? 'var(--primary-text)' : 'var(--primary-text-muted)' }}>Manim Code</div>
                            </div>

                            <div className={`step-connector ${step > 2 ? 'active' : ''}`} style={{ zIndex: 1, position: 'absolute', left: '33%', right: 45, top: 18 }} />

                            <div className={`step ${step >= 3 ? (step > 3 ? 'completed' : 'active') : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2, position: 'relative' }}>
                                <div className="step-circle">3</div>
                                <div style={{ fontSize: 12, color: step >= 3 ? 'var(--primary-text)' : 'var(--primary-text-muted)' }}>Render Video</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {step >= 1 && (
                                <div className="glass-panel">
                                    <h3 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ color: 'var(--accent-main)' }}>•</span> Physics Explanation & Plan
                                    </h3>
                                    <div
                                        style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, maxHeight: 300, overflowY: 'auto', fontSize: 14, color: 'var(--primary-text-muted)', lineHeight: 1.6 }}
                                        dangerouslySetInnerHTML={{ __html: planHtml }}
                                    />
                                </div>
                            )}

                            {step >= 2 && (
                                <div className="glass-panel">
                                    <h3 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ color: 'var(--accent-main)' }}>•</span> Generated Manim Code
                                    </h3>
                                    <pre style={{ margin: 0, padding: 16, borderRadius: 8, background: '#282c34', maxHeight: 400, overflowY: 'auto' }}>
                                        <code ref={codeRef} className="language-python" style={{ fontSize: 13, fontFamily: 'monospace' }}>
                                            {manimCode}
                                        </code>
                                    </pre>
                                </div>
                            )}

                            {step >= 3 && (
                                <div className="glass-panel" style={{ position: 'relative' }}>
                                    <h3 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ color: 'var(--accent-main)' }}>•</span> Final Animation
                                    </h3>
                                    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: 12, overflow: 'hidden' }}>
                                        {videoUrl ? (
                                            <video src={videoUrl} controls autoPlay loop style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', gap: 16 }}>
                                                <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--accent-main)', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />
                                                <p style={{ color: '#fff', fontSize: 14, textAlign: 'center', opacity: 0.8 }}>Rendering video...<br />(If it fails, the AI will try to fix the code automatically)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div style={{ padding: 16, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    )
}
