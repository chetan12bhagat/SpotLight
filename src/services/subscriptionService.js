import { supabase } from '../lib/supabase'

export const subscriptionService = {
    // Create subscription
    async createSubscription(subscriptionData) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .insert([subscriptionData])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Create subscription error:', error)
            return { data: null, error }
        }
    },

    // Get subscription
    async getSubscription(subscriptionId) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select(`
          *,
          creator:creators(*),
          subscriber:users(*)
        `)
                .eq('id', subscriptionId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get subscription error:', error)
            return { data: null, error }
        }
    },

    // Update subscription
    async updateSubscription(subscriptionId, updates) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .update(updates)
                .eq('id', subscriptionId)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Update subscription error:', error)
            return { data: null, error }
        }
    },

    // Cancel subscription
    async cancelSubscription(subscriptionId) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
                .eq('id', subscriptionId)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Cancel subscription error:', error)
            return { data: null, error }
        }
    },

    // Get user's active subscriptions
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

    // Get creator's subscribers
    async getCreatorSubscribers(creatorId) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select(`
          *,
          subscriber:users(*)
        `)
                .eq('creator_id', creatorId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get creator subscribers error:', error)
            return { data: null, error }
        }
    },

    // Create Stripe checkout session (placeholder - would call edge function)
    async createCheckoutSession(creatorId, priceId) {
        try {
            // This would call a Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('createCheckoutSession', {
                body: {
                    creatorId,
                    priceId,
                },
            })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Create checkout session error:', error)
            return { data: null, error }
        }
    },

    // Create customer portal session (placeholder - would call edge function)
    async createPortalSession(customerId) {
        try {
            // This would call a Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('createPortalSession', {
                body: {
                    customerId,
                },
            })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Create portal session error:', error)
            return { data: null, error }
        }
    },
}
