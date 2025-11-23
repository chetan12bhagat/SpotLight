import React, { useState, useEffect } from 'react'
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Heart, UserPlus, DollarSign, MessageCircle } from 'lucide-react'

const Notifications = () => {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        if (user) fetchNotifications()
    }, [user])

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) setNotifications(data)
    }

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart className="text-red-500" size={20} />
            case 'follow': return <UserPlus className="text-blue-500" size={20} />
            case 'tip': return <DollarSign className="text-green-500" size={20} />
            case 'message': return <MessageCircle className="text-purple-500" size={20} />
            default: return <div className="w-2 h-2 bg-primary-500 rounded-full" />
        }
    }

    return (
        <ThreeColumnLayout>
            <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold">Notifications</h1>
            </div>
            <div className="divide-y divide-border">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No notifications yet</div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-text-primary dark:text-white">
                                    {/* Payload content would be parsed here */}
                                    <span className="font-bold">User</span> {notif.type}ed your post
                                </p>
                                <span className="text-xs text-text-tertiary">
                                    {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ThreeColumnLayout>
    )
}

export default Notifications
