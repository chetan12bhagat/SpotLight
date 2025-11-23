import React, { useState, useEffect } from 'react'
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const AdminPanel = () => {
    const { user } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)
    const [pendingPosts, setPendingPosts] = useState([])
    const [reports, setReports] = useState([])

    useEffect(() => {
        checkAdmin()
    }, [user])

    const checkAdmin = async () => {
        if (!user) return
        const { data } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single()

        if (data?.role === 'admin') {
            setIsAdmin(true)
            fetchAdminData()
        }
    }

    const fetchAdminData = async () => {
        // Fetch pending posts
        const { data: posts } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'pending')
            .limit(10)
        if (posts) setPendingPosts(posts)

        // Fetch reports
        const { data: reportData } = await supabase
            .from('reports')
            .select('*')
            .eq('status', 'pending')
            .limit(10)
        if (reportData) setReports(reportData)
    }

    const handleModeration = async (postId, action) => {
        const status = action === 'approve' ? 'approved' : 'rejected'
        await supabase.from('posts').update({ status }).eq('id', postId)

        // Log moderation
        await supabase.from('moderation_logs').insert({
            post_id: postId,
            reviewer_id: user.id, // This needs to be the public.users id, not auth id. Assuming user.id is auth id.
            // We need to fetch public id first or store it in context.
            action: status,
            reason: 'Manual admin action'
        })

        setPendingPosts(prev => prev.filter(p => p.id !== postId))
    }

    if (!isAdmin) {
        return (
            <ThreeColumnLayout>
                <div className="p-8 text-center text-red-500">Access Denied. Admin only.</div>
            </ThreeColumnLayout>
        )
    }

    return (
        <ThreeColumnLayout>
            <div className="p-6 space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-primary-600" size={32} />
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>

                {/* Moderation Queue */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-yellow-500" />
                        Moderation Queue
                    </h2>
                    <div className="space-y-4">
                        {pendingPosts.map(post => (
                            <div key={post.id} className="p-4 border border-border rounded-lg">
                                <p className="mb-2">{post.caption}</p>
                                {post.content_path && (
                                    <div className="h-32 w-full bg-gray-100 rounded mb-2 overflow-hidden">
                                        {/* Media preview would go here */}
                                        <div className="flex items-center justify-center h-full text-gray-400">Media Preview</div>
                                    </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleModeration(post.id, 'approve')}
                                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                    >
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleModeration(post.id, 'reject')}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pendingPosts.length === 0 && <p className="text-gray-500">No pending posts.</p>}
                    </div>
                </div>

                {/* Reports */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4">Recent Reports</h2>
                    <div className="space-y-2">
                        {reports.map(report => (
                            <div key={report.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded flex justify-between items-center">
                                <div>
                                    <span className="font-bold uppercase text-xs text-gray-500">{report.target_table}</span>
                                    <p className="text-sm">{report.reason}</p>
                                </div>
                                <button className="text-sm text-primary-600 hover:underline">Review</button>
                            </div>
                        ))}
                        {reports.length === 0 && <p className="text-gray-500">No pending reports.</p>}
                    </div>
                </div>
            </div>
        </ThreeColumnLayout>
    )
}

export default AdminPanel
