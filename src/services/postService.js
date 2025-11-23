import { supabase } from '../lib/supabase'
import { uploadFile, getSignedUrl } from '../lib/supabase'

export const postService = {
    // Create new post
    async createPost(postData) {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Get or create public user record
            let { data: publicUser, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('auth_id', user.id)
                .maybeSingle()

            // If user doesn't exist in public.users, create it
            if (!publicUser) {
                const { data: newUser, error: createUserError } = await supabase
                    .from('users')
                    .insert([{
                        auth_id: user.id,
                        email: user.email,
                        username: user.email?.split('@')[0] || 'user',
                        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
                    }])
                    .select()
                    .single()

                if (createUserError) {
                    console.error('Failed to create user profile:', createUserError)
                    throw new Error('Failed to create user profile')
                }

                publicUser = newUser
            }

            // Get or create creator profile
            let { data: creatorData, error: creatorError } = await supabase
                .from('creators')
                .select('id')
                .eq('user_id', publicUser.id)
                .maybeSingle()

            // Handle missing creator profile
            let creatorId = creatorData?.id
            if (!creatorId) {
                // Auto-create creator profile
                const { data: newCreator, error: createError } = await supabase
                    .from('creators')
                    .insert([{ user_id: publicUser.id }])
                    .select()
                    .single()

                if (createError) throw createError
                creatorId = newCreator.id
            }

            // Map content to caption for DB compatibility
            const dbPostData = {
                ...postData,
                creator_id: creatorId,
                caption: postData.content,
            }
            delete dbPostData.content

            const { data, error } = await supabase
                .from('posts')
                .insert([dbPostData])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Create post error:', error)
            return { data: null, error }
        }
    },

    // Upload post media
    async uploadPostMedia(file, userId) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}/${Date.now()}.${fileExt}`

            const uploadData = await uploadFile('creator-content', fileName, file)

            return { path: uploadData.path, error: null }
        } catch (error) {
            console.error('Upload post media error:', error)
            return { path: null, error }
        }
    },

    // Get signed URL for post media
    async getPostMediaUrl(path) {
        return await getSignedUrl('creator-content', path)
    },

    // Get posts feed (approved posts)
    async getPostsFeed(limit = 20, offset = 0) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                  *,
                  user:profiles(*),
                  media(*),
                  likes(count),
                  comments(count)
                `)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1)

            if (error) throw error

            // Transform data to match UI components
            const formattedPosts = data.map(post => ({
                id: post.id,
                caption: post.caption, // Mapped from DB caption
                timestamp: new Date(post.created_at).toLocaleDateString(),
                creator: {
                    id: post.user?.id,
                    displayName: post.user?.full_name || 'Unknown User',
                    handle: '@' + (post.user?.username || 'user'),
                    avatar: post.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.id}`,
                    isVerified: post.user?.is_verified || false
                },
                media: post.media?.map(m => ({
                    id: m.id,
                    type: m.type,
                    url: m.url,
                    thumbnail: m.thumbnail_url
                })) || [],
                likes: post.likes?.[0]?.count || 0,
                comments: post.comments?.[0]?.count || 0,
                isLiked: false
            }))

            return { data: formattedPosts, error: null }
        } catch (error) {
            console.error('Get posts feed error:', error)
            return { data: null, error }
        }
    },

    // Get user posts (if they are a creator)
    async getUserPosts(userId) {
        try {
            // First find the creator_id for this user
            const { data: creatorData, error: creatorError } = await supabase
                .from('creators')
                .select('id')
                .eq('user_id', userId)
                .single()

            if (creatorError) throw creatorError
            if (!creatorData) return { data: [], error: null }

            const { data, error } = await supabase
                .from('posts')
                .select(`
                  *,
                  creator:creators(
                    *,
                    user:users(*)
                  )
                `)
                .eq('creator_id', creatorData.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get user posts error:', error)
            return { data: null, error }
        }
    },

    // Get single post
    async getPost(postId) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                  *,
                  creator:creators(
                    *,
                    user:users(*)
                  )
                `)
                .eq('id', postId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get post error:', error)
            return { data: null, error }
        }
    },
}
