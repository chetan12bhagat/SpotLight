import { supabase } from '../lib/supabase'
import { uploadFile, getSignedUrl } from '../lib/supabase'

export const messageService = {
    // Send message
    async sendMessage(messageData) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([messageData])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Send message error:', error)
            return { data: null, error }
        }
    },

    // Get conversation messages
    async getConversationMessages(userId, otherUserId, limit = 50) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
                .order('created_at', { ascending: true })
                .limit(limit)

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get conversation messages error:', error)
            return { data: null, error }
        }
    },

    // Get user conversations
    async getUserConversations(userId) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
          *,
          sender:users!sender_id(*),
          receiver:users!receiver_id(*)
        `)
                .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Group by conversation partner
            const conversations = {}
            data.forEach(message => {
                const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id
                if (!conversations[partnerId] || new Date(message.created_at) > new Date(conversations[partnerId].created_at)) {
                    conversations[partnerId] = message
                }
            })

            return { data: Object.values(conversations), error: null }
        } catch (error) {
            console.error('Get user conversations error:', error)
            return { data: null, error }
        }
    },

    // Mark message as read
    async markMessageRead(messageId) {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ read: true })
                .eq('id', messageId)

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Mark message read error:', error)
            return { error }
        }
    },

    // Mark conversation as read
    async markConversationRead(userId, otherUserId) {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ read: true })
                .eq('sender_id', otherUserId)
                .eq('receiver_id', userId)
                .eq('read', false)

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Mark conversation read error:', error)
            return { error }
        }
    },

    // Upload message media
    async uploadMessageMedia(file, userId) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}/${Date.now()}.${fileExt}`

            const uploadData = await uploadFile('messages-media', fileName, file)

            return { path: uploadData.path, error: null }
        } catch (error) {
            console.error('Upload message media error:', error)
            return { path: null, error }
        }
    },

    // Get signed URL for message media
    async getMessageMediaUrl(path) {
        return await getSignedUrl('messages-media', path)
    },

    // Subscribe to new messages (realtime)
    subscribeToMessages(userId, callback) {
        return supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${userId}`,
                },
                callback
            )
            .subscribe()
    },

    // Get unread message count
    async getUnreadMessageCount(userId) {
        try {
            const { count, error } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('receiver_id', userId)
                .eq('read', false)

            if (error) throw error
            return { count, error: null }
        } catch (error) {
            console.error('Get unread message count error:', error)
            return { count: 0, error }
        }
    },
}
