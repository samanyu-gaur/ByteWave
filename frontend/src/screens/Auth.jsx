import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import WaveMark from '../components/WaveMark'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login, signup } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect to where they came from or default to dashboard
    const from = location.state?.from?.pathname || '/learn'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await signup(email, password, name)
            }
            navigate(from, { replace: true })
        } catch (error) {
            console.error("Auth error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--primary-bg)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background aesthetics matching landing page */}
            <div style={{
                position: 'absolute',
                width: '70vw', height: '70vw', maxWidth: 800, maxHeight: 800,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
            }} />

            <header style={{
                padding: '24px 32px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', zIndex: 10
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <WaveMark />
                    <span style={{
                        fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
                        color: 'var(--primary-text)', letterSpacing: '-0.02em',
                    }}>Byte Wave</span>
                </Link>
            </header>

            <main style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24, position: 'relative', zIndex: 10
            }}>
                <div style={{
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 24,
                    padding: '48px 40px',
                    width: '100%', maxWidth: 420,
                    boxShadow: '0 24px 80px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 28, fontWeight: 700,
                        color: 'var(--primary-text)',
                        margin: '0 0 8px', letterSpacing: '-0.02em',
                        textAlign: 'center'
                    }}>
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p style={{
                        fontSize: 14, color: 'var(--primary-text-muted)',
                        textAlign: 'center', margin: '0 0 32px'
                    }}>
                        {isLogin
                            ? 'Enter your details to access your dashboard.'
                            : 'Sign up to start mastering physics.'}
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {!isLogin && (
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--primary-text)', marginBottom: 6 }}>Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required={!isLogin}
                                    style={{
                                        width: '100%', padding: '12px 14px', borderRadius: 10,
                                        background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)',
                                        color: 'var(--primary-text)', fontSize: 14,
                                        outline: 'none', transition: 'border-color 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--accent-main)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--primary-text)', marginBottom: 6 }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: 10,
                                    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)',
                                    color: 'var(--primary-text)', fontSize: 14,
                                    outline: 'none', transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--accent-main)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-text)' }}>Password</label>
                                {isLogin && <a href="#" style={{ fontSize: 11, color: 'var(--accent-main)', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: 10,
                                    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)',
                                    color: 'var(--primary-text)', fontSize: 14,
                                    outline: 'none', transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--accent-main)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '14px', borderRadius: 10,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff', fontSize: 14, fontWeight: 700,
                                border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                                marginTop: 8, transition: 'opacity 0.2s',
                                opacity: isLoading ? 0.7 : 1,
                            }}
                            className="hover-lift"
                        >
                            {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
                        </button>
                    </form>

                    <div style={{
                        marginTop: 24, textAlign: 'center',
                        fontSize: 13, color: 'var(--primary-text-muted)'
                    }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                background: 'none', border: 'none', padding: 0,
                                color: 'var(--accent-main)', fontWeight: 600,
                                cursor: 'pointer', fontSize: 'inherit',
                                fontFamily: 'inherit'
                            }}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
