/**
 * useAuth — lightweight auth context
 *
 * Currently backed by localStorage so the app works without a backend.
 * To switch to Supabase, replace every TODO block with the Supabase call shown.
 *
 * Supabase swap (one-time setup):
 *   npm i @supabase/supabase-js
 *   Create a .env file:
 *     VITE_SUPABASE_URL=https://xxx.supabase.co
 *     VITE_SUPABASE_ANON_KEY=eyJ...
 *   Then follow the TODO comments below.
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

// TODO (Supabase): uncomment these two lines and remove the localStorage helpers below
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

const SESSION_KEY = 'bw_session_v2'
const USERS_KEY   = 'bw_users_v2'

function uid() {
  return 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => loadSession())
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // TODO (Supabase): replace this useEffect with:
  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
  //   return () => subscription.unsubscribe()
  // }, [])

  // ── Guest access (no email required) ───────────────────────────────────────
  const continueAsGuest = useCallback(() => {
    const guest = { id: uid(), email: null, name: 'Student', isGuest: true, createdAt: new Date().toISOString() }
    localStorage.setItem(SESSION_KEY, JSON.stringify(guest))
    setUser(guest)
    setError(null)
    return guest
  }, [])

  // ── Sign up ─────────────────────────────────────────────────────────────────
  const signUp = useCallback(async (email, password, name) => {
    if (!email || !password) { setError('Email and password are required.'); return null }
    setLoading(true); setError(null)
    try {
      // TODO (Supabase): const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      // if (error) throw error; return data.user
      const users = loadUsers()
      const emailKey = email.toLowerCase().trim()
      if (users[emailKey]) { setError('An account with that email already exists.'); return null }
      const newUser = { id: uid(), email: emailKey, name: name || emailKey.split('@')[0], isGuest: false, createdAt: new Date().toISOString() }
      users[emailKey] = { ...newUser, _pw: password }
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
      setUser(newUser)
      return newUser
    } catch (e) {
      setError('Sign up failed. Try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Sign in ─────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email, password) => {
    if (!email || !password) { setError('Email and password are required.'); return null }
    setLoading(true); setError(null)
    try {
      // TODO (Supabase): const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      // if (error) throw error; return data.user
      const users  = loadUsers()
      const stored = users[email.toLowerCase().trim()]
      if (!stored || stored._pw !== password) { setError('Incorrect email or password.'); return null }
      const session = { id: stored.id, email: stored.email, name: stored.name, isGuest: false, createdAt: stored.createdAt }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      setUser(session)
      return session
    } catch (e) {
      setError('Sign in failed. Try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Sign out ─────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    // TODO (Supabase): await supabase.auth.signOut()
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  // ── Update display name ──────────────────────────────────────────────────────
  const updateName = useCallback((name) => {
    setUser(prev => {
      if (!prev) return prev
      const next = { ...prev, name }
      localStorage.setItem(SESSION_KEY, JSON.stringify(next))
      try {
        if (prev.email) {
          const users = loadUsers()
          if (users[prev.email]) { users[prev.email] = { ...users[prev.email], name }; localStorage.setItem(USERS_KEY, JSON.stringify(users)) }
        }
      } catch {}
      return next
    })
  }, [])

  const value = { user, loading, error, signUp, signIn, signOut, continueAsGuest, updateName, isAuthed: !!user }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

/** Returns the user's API-safe ID — falls back to '1' for unauthenticated state */
export function useUserId() {
  const { user } = useAuth()
  return user?.id ?? '1'
}
