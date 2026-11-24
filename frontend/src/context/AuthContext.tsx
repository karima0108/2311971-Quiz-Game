
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import {
  signup as apiSignup,
  login as apiLogin,
  demoLogin as apiDemoLogin,
  logout as apiLogout,
  refreshAccessToken,
  getCurrentUser,
  updateMyProfile,
  setAccessToken,
  type ApiUser,
} from "../services/api"

interface AuthContextValue {
  user: ApiUser | null
  loading: boolean
  isAuthenticated: boolean
  signup: (email: string, password: string) => Promise<ApiUser>
  login: (email: string, password: string) => Promise<void>
  demoLogin: (role: "admin" | "user") => Promise<void>
  updateUser: (name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      try {
        await refreshAccessToken()
        const currentUser = await getCurrentUser()

        if (isMounted) {
          setUser(currentUser)
        }
      } catch {
        setAccessToken(null)

        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  async function signup(
    email: string,
    password: string,
  ): Promise<ApiUser> {
    return apiSignup(email, password)
  }

  async function login(
    email: string,
    password: string,
  ): Promise<void> {
    await apiLogin(email, password)
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  async function demoLogin(role: "admin" | "user"): Promise<void> {
    await apiDemoLogin(role)
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  async function updateUser(name: string): Promise<void> {
    const updatedUser = await updateMyProfile(name)
    setUser(updatedUser)
  }

  async function logout(): Promise<void> {
    try {
      await apiLogout()
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: user !== null,
    signup,
    login,
    demoLogin,
    updateUser,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider")
  }

  return context
}
