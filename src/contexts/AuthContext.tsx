import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User, AuthError } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; profile: Profile | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null; profile: Profile | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const getAuthRedirectUrl = () => {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined
  if (configuredSiteUrl) return configuredSiteUrl

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return 'http://localhost:5173'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      setProfile(null)
      return null
    }

    const nextProfile = data as Profile
    setProfile(nextProfile)
    return nextProfile
  }

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!isMounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }

      if (isMounted) setLoading(false)
    }

    bootstrap()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return

      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (!nextSession?.user) {
        setProfile(null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return

    let isCurrent = true

    loadProfile(user.id).then((nextProfile) => {
      if (!isCurrent || !nextProfile) return
      setProfile(nextProfile)
    })

    return () => {
      isCurrent = false
    }
  }, [user?.id])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error, profile: null }

    const nextProfile = data.user ? await loadProfile(data.user.id) : null
    return { error: null, profile: nextProfile }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: getAuthRedirectUrl(),
      },
    })
    const nextProfile = data.user ? await loadProfile(data.user.id) : null
    return { error, profile: nextProfile }
  }

  const signOut = async () => {
    setSession(null)
    setUser(null)
    setProfile(null)
    setLoading(false)

    await supabase.auth.signOut()
  }

  const refreshProfile = async () => {
    if (!user?.id) {
      setProfile(null)
      return null
    }

    return loadProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
