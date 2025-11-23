import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = authService.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user)
                } else {
                    setUser(null)
                }
                setLoading(false)
            }
        )

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const checkUser = async () => {
        try {
            const { user } = await authService.getCurrentUser()
            setUser(user)
        } catch (error) {
            console.error('Error checking user:', error)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email, password, userData) => {
        const { data, error } = await authService.signUp(email, password, userData)
        if (error) throw error
        if (data?.user) {
            setUser(data.user)
        }
        return data
    }

    const signIn = async (email, password) => {
        const { data, error } = await authService.signIn(email, password)
        if (error) throw error
        if (data?.user) {
            setUser(data.user)
        }
        return data
    }

    const signOut = async () => {
        const { error } = await authService.signOut()
        if (error) throw error
        setUser(null)
    }

    const resetPassword = async (email) => {
        const { error } = await authService.resetPassword(email)
        if (error) throw error
    }

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
