import React, { useState, useEffect } from 'react'
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { BarChart, DollarSign, Users, Image as ImageIcon } from 'lucide-react'

const CreatorStudio = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        earnings: 0,
        subscribers: 0,
        views: 0
    })
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (user) fetchCreatorData()
    }, [user])

    const fetchCreatorData = async () => {
        // Fetch creator profile first
        const { data: creator } = await supabase
            .from('creators')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!creator) return // Not a creator

        // Fetch stats (mock logic for now, would be real aggregations)
        setStats({
            earnings: 1250.50,
            subscribers: 142,
            views: 5400
        })

        // Fetch posts
        const { data: creatorPosts } = await supabase
            .from('posts')
            .select('*')
            .eq('creator_id', creator.id)
            .order('created_at', { ascending: false })

        if (creatorPosts) setPosts(creatorPosts)
    }

    return (
        <ThreeColumnLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Creator Studio</h1>
                    <button className="btn btn-primary">Upload New Post</button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-4 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                            <p className="text-xl font-bold">${stats.earnings.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="card p-4 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Subscribers</p>
                            <p className="text-xl font-bold">{stats.subscribers}</p>
                        </div>
                    </div>
                    <div className="card p-4 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                            <BarChart size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">30-Day Views</p>
                            <p className="text-xl font-bold">{stats.views}</p>
                        </div>
                    </div>
                </div>

                {/* Content Management */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4">Recent Content</h2>
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                    {post.content_type === 'image' ? (
                                        <img src={post.content_path} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium truncate">{post.caption || 'Untitled Post'}</p>
                                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full ${post.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {post.status}
                                        </span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        <span>{post.is_paid ? `$${(post.price / 100).toFixed(2)}` : 'Free'}</span>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-primary-600">Edit</button>
                            </div>
                        ))}
                        {posts.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No posts yet</div>
                        )}
                    </div>
                </div>
            </div>
        </ThreeColumnLayout>
    )
}

export default CreatorStudio
