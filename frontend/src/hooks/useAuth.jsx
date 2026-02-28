import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem('byteWaveUser')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    const login = (email, password) => {
        // Mock login
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = { id: 1, email, name: email.split('@')[0] }
                setUser(mockUser)
                setIsAuthenticated(true)
                localStorage.setItem('byteWaveUser', JSON.stringify(mockUser))
                resolve(mockUser)
            }, 800)
        })
    }

    const signup = (email, password, name) => {
        // Mock signup
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = { id: Date.now(), email, name }
                setUser(mockUser)
                setIsAuthenticated(true)
                localStorage.setItem('byteWaveUser', JSON.stringify(mockUser))
                resolve(mockUser)
            }, 800)
        })
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('byteWaveUser')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
