import { supabase } from '../lib/supabase'

export const userService = {
    // Get user profile
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get user profile error:', error)
            return { data: null, error }
        }
    },

    // Update user profile
    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Update user profile error:', error)
            return { data: null, error }
        }
    },

    // Get user subscriptions
    async getUserSubscriptions(userId) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select(`
          *,
          creator:creators(*)
        `)
                .eq('subscriber_id', userId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get user subscriptions error:', error)
            return { data: null, error }
        }
    },

    // Get user notifications
    async getUserNotifications(userId, limit = 20) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get user notifications error:', error)
            return { data: null, error }
        }
    },

    // Mark notification as read
    async markNotificationRead(notificationId) {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId)

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Mark notification read error:', error)
            return { error }
        }
    },

    // Mark all notifications as read
    async markAllNotificationsRead(userId) {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', userId)
                .eq('read', false)

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Mark all notifications read error:', error)
            return { error }
        }
    },

    // Get unread notification count
    async getUnreadNotificationCount(userId) {
        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('read', false)

            if (error) throw error
            return { count, error: null }
        } catch (error) {
            console.error('Get unread notification count error:', error)
            return { count: 0, error }
        }
    },
}
