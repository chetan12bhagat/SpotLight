import React from 'react'
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout'
import { Composer } from '../components/Composer'
import { PostCard } from '../components/PostCard'
import { EmailVerificationBanner } from '../components/EmailVerificationBanner'
import { mockPosts } from '../data/mockData'
import { Filter } from 'lucide-react'

const Dashboard = () => {
    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            setLoading(true)
            const { data, error } = await import('../services/postService').then(m => m.postService.getPostsFeed())
            if (error) throw error
            setPosts(data || [])
        } catch (err) {
            console.error('Error fetching posts:', err)
            setError('Failed to load posts')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ThreeColumnLayout>
            {/* Composer Section */}
            <Composer onPostCreated={fetchPosts} />

            {/* Feed Filters */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50/50 dark:bg-gray-900/50">
                <h3 className="font-bold text-text-secondary text-sm uppercase tracking-wider">Recent Posts</h3>
                <button className="text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                    <Filter size={20} />
                </button>
            </div>

            {/* Verification Banner */}
            <EmailVerificationBanner />

            {/* Posts Feed */}
            <div className="pb-20">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading posts...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No posts yet. Be the first to post!</div>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </ThreeColumnLayout>
    )
}

export default Dashboard
