import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout'
import { supabase } from '../lib/supabase'
import { Avatar } from '../components/Avatar'
import { PostCard } from '../components/PostCard'
import { Lock, Image as ImageIcon } from 'lucide-react'

const CreatorProfile = () => {
    const { username } = useParams() // Assuming route is /:username
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if (username) fetchProfile()
    }, [username])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            // 1. Get User
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id, full_name, username, avatar_url, is_verified')
                .eq('username', username.replace('@', ''))
                .single()

            if (userError || !userData) throw new Error('User not found')

            // 2. Get Creator Details
            const { data: creatorData, error: creatorError } = await supabase
                .from('creators')
                .select('*')
                .eq('user_id', userData.id)
                .maybeSingle()

            // Log for debugging
            if (creatorError) console.error('Creator fetch error:', creatorError)

            setProfile({ ...userData, creator: creatorData })

            // 3. Get Posts (RLS will handle visibility)
            if (creatorData) {
                const { data: postData } = await supabase
                    .from('posts')
                    .select('*, media(*), likes(count), comments(count)')
                    .eq('creator_id', creatorData.id)
                    .eq('status', 'approved')
                    .order('created_at', { ascending: false })

                setPosts(postData || [])
            }

            // 4. Check Subscription (Mock logic)
            // const { data: sub } = await supabase.from('subscriptions')...
            setIsSubscribed(false)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubscribe = async () => {
        alert('Stripe Checkout would open here.')
        // Call createCheckoutSession Edge Function
    }

    if (loading) return <ThreeColumnLayout><div className="p-8 text-center">Loading...</div></ThreeColumnLayout>
    if (!profile) return <ThreeColumnLayout><div className="p-8 text-center">Profile not found</div></ThreeColumnLayout>

    return (
        <ThreeColumnLayout>
            <div>
                {/* Cover Image */}
                <div className="h-48 bg-gray-200 w-full relative">
                    {profile.creator?.cover_image && (
                        <img src={profile.creator.cover_image} className="w-full h-full object-cover" alt="Cover" />
                    )}
                </div>

                {/* Profile Header */}
                <div className="px-4 pb-4 border-b border-border relative">
                    <div className="-mt-12 mb-3 flex justify-between items-end">
                        <div className="p-1 bg-white dark:bg-black rounded-full">
                            <Avatar src={profile.avatar_url} size="lg" verified={profile.is_verified} />
                        </div>
                        <div className="flex gap-2 mb-1">
                            <button className="p-2 border border-border rounded-full hover:bg-gray-50">
                                <ImageIcon size={20} />
                            </button>
                            <button className="p-2 border border-border rounded-full hover:bg-gray-50">
                                <Lock size={20} />
                            </button>
                        </div>
                    </div>

                    <h1 className="text-xl font-bold flex items-center gap-1">
                        {profile.full_name}
                        {profile.is_verified && <span className="text-blue-500">✓</span>}
                    </h1>
                    <p className="text-gray-500">@{profile.username}</p>

                    {profile.creator?.bio && (
                        <p className="mt-2 text-sm whitespace-pre-wrap">{profile.creator.bio}</p>
                    )}

                    <div className="mt-4 flex gap-4 text-sm text-gray-500">
                        <span><strong>{posts.length}</strong> posts</span>
                        <span><strong>1.2k</strong> likes</span>
                    </div>

                    {!isSubscribed && (
                        <button
                            onClick={handleSubscribe}
                            className="w-full mt-4 btn btn-primary py-3 uppercase font-bold flex justify-between items-center px-6"
                        >
                            <span>Subscribe</span>
                            <span>${(profile.creator?.subscription_price / 100 || 0).toFixed(2)} / month</span>
                        </button>
                    )}
                </div>

                {/* Posts */}
                <div className="pb-20">
                    {posts.map(post => (
                        <PostCard key={post.id} post={{
                            ...post,
                            creator: {
                                displayName: profile.full_name,
                                handle: '@' + profile.username,
                                avatar: profile.avatar_url,
                                isVerified: profile.is_verified
                            },
                            likes: post.likes?.[0]?.count || 0,
                            comments: post.comments?.[0]?.count || 0,
                            isLiked: false
                        }} />
                    ))}
                    {posts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No posts available</div>
                    )}
                </div>
            </div>
        </ThreeColumnLayout>
    )
}

export default CreatorProfile
