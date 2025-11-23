// Type definitions for AuthContext.jsx
import { User } from '@supabase/supabase-js'

export interface AuthContextValue {
    user: User | null
    loading: boolean
    signUp: (email: string, password: string, userData?: any) => Promise<any>
    signIn: (email: string, password: string) => Promise<any>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
}

export function useAuth(): AuthContextValue
export const AuthProvider: React.FC<{ children: React.ReactNode }>
