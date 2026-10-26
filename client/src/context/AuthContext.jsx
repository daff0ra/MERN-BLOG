import { createContext, useEffect, useState } from 'react'
import { authApi } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    authApi.me()
      .then(({ data }) => active && setUser(data))
      .catch(() => active && setUser(null))
      .finally(() => active && setReady(true))
    return () => { active = false }
  }, [])

  const authenticate = async (request) => {
    setLoading(true)
    try {
      const { data } = await request()
      setUser(data)
      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }
  const login = (email, password) => authenticate(() => authApi.login({ email, password }))
  const register = (username, email, password) => authenticate(() => authApi.register({ username, email, password }))
  const logout = async () => {
    try { await authApi.logout() } finally { setUser(null) }
  }

  return <AuthContext.Provider value={{ user, ready, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export default AuthContext
