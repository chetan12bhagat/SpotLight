import React from 'react';
import { Image, Video, BarChart2, Type } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from './Avatar';

import { postService } from '../services/postService';
import { useState } from 'react';

export const Composer = ({ onPostCreated }: { onPostCreated?: () => void }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!content.trim() || loading) return;

        try {
            setLoading(true);
            const { error } = await postService.createPost({
                content,
                media_urls: [], // TODO: Handle media upload
                visibility: 'public'
            });

            if (error) throw error;

            setContent('');
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-b border-border p-4 bg-white dark:bg-gray-950">
            <div className="flex gap-4">
                <div className="hidden sm:block">
                    <Avatar
                        src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        alt="User"
                        size="md"
                    />
                </div>
                <div className="flex-1">
                    <div className="mb-4">
                        <h2 className="font-bold text-lg text-text-primary dark:text-white mb-2">HOME</h2>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Compose new post..."
                            className="w-full bg-transparent border-none resize-none text-lg placeholder-gray-400 focus:ring-0 p-0 min-h-[60px] text-text-primary dark:text-white"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-primary">
                            <button className="hover:bg-primary-50 p-2 rounded-full transition-colors">
                                <Image size={24} />
                            </button>
                            <button className="hover:bg-primary-50 p-2 rounded-full transition-colors">
                                <Video size={24} />
                            </button>
                            <button className="hover:bg-primary-50 p-2 rounded-full transition-colors">
                                <BarChart2 size={24} />
                            </button>
                            <button className="hover:bg-primary-50 p-2 rounded-full transition-colors">
                                <Type size={24} />
                            </button>
                        </div>
                        <button
                            onClick={handlePost}
                            disabled={!content.trim() || loading}
                            className="bg-primary-600 text-white px-4 py-2 rounded-full font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
