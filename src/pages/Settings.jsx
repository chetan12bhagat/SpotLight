import React, { useState, useEffect } from 'react'
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Settings = () => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
        price: 0
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) loadSettings()
    }, [user])

    const loadSettings = async () => {
        // Load user and creator data
        const { data: userData } = await supabase.from('users').select('*').eq('auth_id', user.id).single()
        const { data: creatorData } = await supabase.from('creators').select('*').eq('user_id', userData.id).single()

        // Get full_name from auth metadata
        const { data: { user: authUser } } = await supabase.auth.getUser()

        setFormData({
            full_name: authUser?.user_metadata?.full_name || '',
            username: userData.username || '',
            bio: creatorData?.bio || '',
            price: creatorData?.subscription_price ? creatorData.subscription_price / 100 : 0
        })
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // Update Auth Metadata for full_name
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: formData.full_name }
            })
            if (authError) throw authError

            // Update User (username only)
            await supabase.from('users').update({
                username: formData.username
            }).eq('auth_id', user.id)

            // Update Creator (upsert)
            const { data: userData } = await supabase.from('users').select('id').eq('auth_id', user.id).single()

            await supabase.from('creators').upsert({
                user_id: userData.id,
                bio: formData.bio,
                subscription_price: Math.round(formData.price * 100)
            }, { onConflict: 'user_id' })

            alert('Settings saved!')
        } catch (error) {
            console.error(error)
            alert('Error saving settings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ThreeColumnLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>

                <div className="space-y-6 max-w-md">
                    <div>
                        <label className="block text-sm font-medium mb-2">Display Name</label>
                        <input
                            className="input w-full"
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                            <input
                                className="input w-full pl-8"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <textarea
                            className="input w-full min-h-[100px]"
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Subscription Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input w-full"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </ThreeColumnLayout>
    )
}

export default Settings
