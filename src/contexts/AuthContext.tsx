import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
    session: Session | null
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            if (session?.user) {
                ensureUserExists(session.user)
            }
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            if (session?.user) {
                ensureUserExists(session.user)
            }
        })

        async function ensureUserExists(user: User) {
            try {
                // Check if user exists in public.users
                const { data, error } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', user.id)
                    .single()

                if (!data && (error?.code === 'PGRST116' || !error)) {
                    // User missing, insert them
                    await supabase.from('users').insert([{
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata?.full_name || user.email?.split('@')[0]
                    }])
                }
            } catch (err) {
                console.error("Failed to ensure user profile exists:", err)
            }
        }

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
