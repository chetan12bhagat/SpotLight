import { supabase } from '../lib/supabase'

export const authService = {
    // Sign up new user
    // Sign up new user
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData,
                },
            })

            if (error) throw error

            // Profile creation is handled by database trigger
            if (data.user && !data.session) {
                alert('Signup successful! Please check your email to confirm your account.')
            } else if (data.user && data.session) {
                // alert('Signup successful! Logging in...')
            }

            return { data, error: null }
        } catch (error) {
            console.error('Sign up error:', error)
            alert(`Sign up failed: ${error.message}`)
            return { data: null, error }
        }
    },

    // Sign in existing user
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Sign in error:', error)
            alert(`Sign in failed: ${error.message}`)
            return { data: null, error }
        }
    },

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Sign out error:', error)
            return { error }
        }
    },

    // Get current session
    async getSession() {
        try {
            const { data, error } = await supabase.auth.getSession()
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get session error:', error)
            return { data: null, error }
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) throw error
            return { user, error: null }
        } catch (error) {
            console.error('Get current user error:', error)
            return { user: null, error }
        }
    },

    // Get user profile from database
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', userId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get user profile error:', error)
            return { data: null, error }
        }
    },

    // Reset password
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Reset password error:', error)
            return { error }
        }
    },

    // Update password
    async updatePassword(newPassword) {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Update password error:', error)
            return { error }
        }
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    },
}
