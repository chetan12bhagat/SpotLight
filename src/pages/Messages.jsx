import React, { useState, useEffect } from 'react'
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Avatar } from '../components/Avatar'
import { Send, Image, Mic } from 'lucide-react'

const Messages = () => {
    const { user } = useAuth()
    const [conversations, setConversations] = useState([])
    const [activeChat, setActiveChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        fetchConversations()
    }, [user])

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.id)
            const subscription = subscribeToMessages(activeChat.id)
            return () => subscription.unsubscribe()
        }
    }, [activeChat])

    const fetchConversations = async () => {
        // Mock fetching conversations for now or implement complex query
        // In a real app, you'd query the 'messages' table with distinct sender/receiver
    }

    const fetchMessages = async (otherUserId) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
            .order('created_at', { ascending: true })

        if (data) setMessages(data)
    }

    const subscribeToMessages = (otherUserId) => {
        return supabase
            .channel('messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                setMessages(prev => [...prev, payload.new])
            })
            .subscribe()
    }

    const handleSend = async () => {
        if (!newMessage.trim() || !activeChat) return

        const { error } = await supabase.from('messages').insert({
            sender_id: user.id,
            receiver_id: activeChat.id,
            content: newMessage
        })

        if (!error) setNewMessage('')
    }

    return (
        <ThreeColumnLayout>
            <div className="h-[calc(100vh-64px)] flex flex-col">
                <div className="p-4 border-b border-border">
                    <h1 className="text-xl font-bold">Messages</h1>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Chat List (Mobile: Full width if no active chat, Desktop: 1/3 width) */}
                    <div className={`w-full md:w-1/3 border-r border-border overflow-y-auto ${activeChat ? 'hidden md:block' : 'block'}`}>
                        {/* Placeholder for conversation list */}
                        <div className="p-4 text-center text-gray-500">No conversations yet</div>
                    </div>

                    {/* Chat View */}
                    <div className={`w-full md:w-2/3 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                        {activeChat ? (
                            <>
                                <div className="p-4 border-b border-border flex items-center gap-3">
                                    <Avatar src={activeChat.avatar} size="sm" />
                                    <span className="font-bold">{activeChat.name}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender_id === user.id ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-border flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-full"><Image size={20} /></button>
                                    <input
                                        className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 focus:outline-none"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    />
                                    <button onClick={handleSend} className="p-2 text-primary-500 hover:bg-primary-50 rounded-full"><Send size={20} /></button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a conversation to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ThreeColumnLayout>
    )
}

export default Messages
