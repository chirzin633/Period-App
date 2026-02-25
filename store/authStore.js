import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            loading: false,
            error: null,

            setUser: (user) => set({ user }),
            setProfile: (profile) => set({ profile }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),

            // Sign up with email/password
            signUp: async ({ email, password, fullName }) => {
                set({ loading: true, error: null })
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { display_name: fullName },
                    },
                })
                if (error) {
                    set({ error: error.message, loading: false })
                    return { error }
                }
                set({ user: data.user, loading: false })
                return { data }
            },

            // Sign in with email/password
            signIn: async ({ email, password }) => {
                set({ loading: true, error: null })
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) {
                    set({ error: error.message, loading: false })
                    return { error }
                }
                set({ user: data.user, loading: false })
                return { data }
            },

            // Sign out
            signOut: async () => {
                set({ loading: true })
                await supabase.auth.signOut()
                set({ user: null, profile: null, loading: false })
            },

            // Fetch user profile
            fetchProfile: async (userId) => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()
                if (!error && data) {
                    set({ profile: data })
                }
                return { data, error }
            },

            // Update profile
            updateProfile: async (updates) => {
                const { user } = get()
                if (!user) return { error: 'Not authenticated' }
                const { data, error } = await supabase
                    .from('profiles')
                    .update({ ...updates, updated_at: new Date().toISOString() })
                    .eq('id', user.id)
                    .select()
                    .single()
                if (!error && data) {
                    set({ profile: data })
                }
                return { data, error }
            },
        }),
        {
            name: 'flora-auth',
            partialize: (state) => ({ user: state.user, profile: state.profile }),
        }
    )
)

export default useAuthStore