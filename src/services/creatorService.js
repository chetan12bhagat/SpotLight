import { supabase } from '../lib/supabase'
import { uploadFile } from '../lib/supabase'

export const creatorService = {
    // Create creator profile
    async createCreatorProfile(creatorData) {
        try {
            const { data, error } = await supabase
                .from('creators')
                .insert([creatorData])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Create creator profile error:', error)
            return { data: null, error }
        }
    },

    // Get creator profile
    async getCreatorProfile(creatorId) {
        try {
            const { data, error } = await supabase
                .from('creators')
                .select('*')
                .eq('id', creatorId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get creator profile error:', error)
            return { data: null, error }
        }
    },

    // Get creator by user ID
    async getCreatorByUserId(userId) {
        try {
            const { data, error } = await supabase
                .from('creators')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get creator by user ID error:', error)
            return { data: null, error }
        }
    },

    // Update creator profile
    async updateCreatorProfile(creatorId, updates) {
        try {
            const { data, error } = await supabase
                .from('creators')
                .update(updates)
                .eq('id', creatorId)
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Update creator profile error:', error)
            return { data: null, error }
        }
    },

    // Upload creator avatar
    async uploadAvatar(file, creatorId) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `avatars/${creatorId}.${fileExt}`

            const uploadData = await uploadFile('creator-content', fileName, file)

            return { path: uploadData.path, error: null }
        } catch (error) {
            console.error('Upload avatar error:', error)
            return { path: null, error }
        }
    },

    // Upload creator banner
    async uploadBanner(file, creatorId) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `banners/${creatorId}.${fileExt}`

            const uploadData = await uploadFile('creator-content', fileName, file)

            return { path: uploadData.path, error: null }
        } catch (error) {
            console.error('Upload banner error:', error)
            return { path: null, error }
        }
    },

    // Upload ID verification document
    async uploadIdDocument(file, creatorId) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `verification/${creatorId}-${Date.now()}.${fileExt}`

            const uploadData = await uploadFile('creator-content', fileName, file)

            return { path: uploadData.path, error: null }
        } catch (error) {
            console.error('Upload ID document error:', error)
            return { path: null, error }
        }
    },

    // Get all creators (for explore page)
    async getAllCreators(limit = 20, offset = 0) {
        try {
            const { data, error } = await supabase
                .from('creators')
                .select('*')
                .eq('verified', true)
                .order('subscriber_count', { ascending: false })
                .range(offset, offset + limit - 1)

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get all creators error:', error)
            return { data: null, error }
        }
    },

    // Search creators
    async searchCreators(query) {
        try {
            const { data, error } = await supabase
                .from('creators')
                .select('*')
                .eq('verified', true)
                .or(`display_name.ilike.%${query}%,bio.ilike.%${query}%`)
                .limit(20)

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Search creators error:', error)
            return { data: null, error }
        }
    },

    // Get creator analytics
    async getCreatorAnalytics(creatorId) {
        try {
            // Get subscriber count
            const { count: subscriberCount } = await supabase
                .from('subscriptions')
                .select('*', { count: 'exact', head: true })
                .eq('creator_id', creatorId)
                .eq('status', 'active')

            // Get post count
            const { count: postCount } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('creator_id', creatorId)
                .eq('status', 'approved')

            // Get total revenue (placeholder - would come from Stripe)
            const totalRevenue = 0

            return {
                data: {
                    subscriberCount: subscriberCount || 0,
                    postCount: postCount || 0,
                    totalRevenue,
                },
                error: null,
            }
        } catch (error) {
            console.error('Get creator analytics error:', error)
            return { data: null, error }
        }
    },

    // Check if user is subscribed to creator
    async isSubscribed(userId, creatorId) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('subscriber_id', userId)
                .eq('creator_id', creatorId)
                .eq('status', 'active')
                .single()

            if (error && error.code !== 'PGRST116') throw error
            return { isSubscribed: !!data, error: null }
        } catch (error) {
            console.error('Check subscription error:', error)
            return { isSubscribed: false, error }
        }
    },
}
