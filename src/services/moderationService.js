import { supabase } from '../lib/supabase'

export const moderationService = {
    // Get pending posts for moderation
    async getPendingPosts(limit = 20, offset = 0) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          creator:creators(*)
        `)
                .eq('status', 'pending')
                .order('created_at', { ascending: true })
                .range(offset, offset + limit - 1)

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get pending posts error:', error)
            return { data: null, error }
        }
    },

    // Approve post
    async approvePost(postId, moderatorId) {
        try {
            // Update post status
            const { data: post, error: postError } = await supabase
                .from('posts')
                .update({ status: 'approved' })
                .eq('id', postId)
                .select()
                .single()

            if (postError) throw postError

            // Create moderation log
            const { error: logError } = await supabase
                .from('moderation_logs')
                .insert([
                    {
                        post_id: postId,
                        moderator_id: moderatorId,
                        action: 'approved',
                        created_at: new Date().toISOString(),
                    },
                ])

            if (logError) throw logError

            return { data: post, error: null }
        } catch (error) {
            console.error('Approve post error:', error)
            return { data: null, error }
        }
    },

    // Reject post
    async rejectPost(postId, moderatorId, reason = '') {
        try {
            // Update post status
            const { data: post, error: postError } = await supabase
                .from('posts')
                .update({ status: 'rejected' })
                .eq('id', postId)
                .select()
                .single()

            if (postError) throw postError

            // Create moderation log
            const { error: logError } = await supabase
                .from('moderation_logs')
                .insert([
                    {
                        post_id: postId,
                        moderator_id: moderatorId,
                        action: 'rejected',
                        reason,
                        created_at: new Date().toISOString(),
                    },
                ])

            if (logError) throw logError

            return { data: post, error: null }
        } catch (error) {
            console.error('Reject post error:', error)
            return { data: null, error }
        }
    },

    // Get moderation logs
    async getModerationLogs(limit = 50, offset = 0) {
        try {
            const { data, error } = await supabase
                .from('moderation_logs')
                .select(`
          *,
          post:posts(*),
          moderator:users(*)
        `)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1)

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get moderation logs error:', error)
            return { data: null, error }
        }
    },

    // Get pending creator verifications
    async getPendingVerifications() {
        try {
            const { data, error } = await supabase
                .from('creators')
                .select('*')
                .eq('verified', false)
                .not('id_document_url', 'is', null)
                .order('created_at', { ascending: true })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get pending verifications error:', error)
            return { data: null, error }
        }
    },

    // Verify creator
    async verifyCreator(creatorId, moderatorId) {
        try {
            const { data, error } = await supabase
                .from('creators')
                .update({ verified: true, verified_at: new Date().toISOString() })
                .eq('id', creatorId)
                .select()
                .single()

            if (error) throw error

            // Create moderation log
            await supabase
                .from('moderation_logs')
                .insert([
                    {
                        creator_id: creatorId,
                        moderator_id: moderatorId,
                        action: 'verified_creator',
                        created_at: new Date().toISOString(),
                    },
                ])

            return { data, error: null }
        } catch (error) {
            console.error('Verify creator error:', error)
            return { data: null, error }
        }
    },

    // Reject creator verification
    async rejectCreatorVerification(creatorId, moderatorId, reason = '') {
        try {
            const { data, error } = await supabase
                .from('creators')
                .update({ id_document_url: null })
                .eq('id', creatorId)
                .select()
                .single()

            if (error) throw error

            // Create moderation log
            await supabase
                .from('moderation_logs')
                .insert([
                    {
                        creator_id: creatorId,
                        moderator_id: moderatorId,
                        action: 'rejected_verification',
                        reason,
                        created_at: new Date().toISOString(),
                    },
                ])

            return { data, error: null }
        } catch (error) {
            console.error('Reject creator verification error:', error)
            return { data: null, error }
        }
    },

    // Auto-moderate post (would call edge function)
    async autoModeratePost(postId) {
        try {
            const { data, error } = await supabase.functions.invoke('moderatePost', {
                body: { postId },
            })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Auto-moderate post error:', error)
            return { data: null, error }
        }
    },
}
