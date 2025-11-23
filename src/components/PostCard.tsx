import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play } from 'lucide-react';
import { Post } from '../types';
import { Avatar } from './Avatar';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
    post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likes);

    const handleLike = () => {
        if (isLiked) {
            setLikesCount(prev => prev - 1);
        } else {
            setLikesCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <div className="border-b border-border pb-4 mb-4 last:border-0">
            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-start">
                <div className="flex gap-3">
                    <Avatar
                        src={post.creator.avatar}
                        alt={post.creator.displayName}
                        size="md"
                        verified={post.creator.isVerified}
                    />
                    <div>
                        <div className="flex items-center gap-1">
                            <h3 className="font-bold text-text-primary dark:text-white hover:underline cursor-pointer">
                                {post.creator.displayName}
                            </h3>
                            <span className="text-text-secondary text-sm ml-1">
                                {post.creator.handle}
                            </span>
                        </div>
                        <p className="text-xs text-text-tertiary hover:underline cursor-pointer">
                            {/* Simple time ago fallback if date parsing fails */}
                            {post.timestamp}
                        </p>
                    </div>
                </div>
                <button className="text-text-secondary hover:bg-bg-hover p-2 rounded-full transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Caption */}
            <div className="px-4 mb-3">
                <p className="text-text-primary dark:text-gray-100 whitespace-pre-wrap text-[15px] leading-relaxed">
                    {post.caption}
                </p>
            </div>

            {/* Media */}
            {post.media && post.media.length > 0 && (
                <div className="mb-3">
                    {post.media.map((item) => (
                        <div key={item.id} className="relative cursor-pointer group">
                            {item.type === 'video' ? (
                                <div className="relative aspect-video bg-black">
                                    <img
                                        src={item.thumbnail || item.url}
                                        alt="Video thumbnail"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                            <Play fill="currentColor" className="ml-1" size={32} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                                        0:45
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    alt="Post content"
                                    className="w-full h-auto object-cover max-h-[600px]"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Engagement */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
                        >
                            <Heart
                                size={24}
                                className={`transition-transform group-hover:scale-110 ${isLiked ? 'fill-current' : ''}`}
                            />
                            <span className="font-medium text-sm">{likesCount}</span>
                        </button>

                        <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group">
                            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">{post.comments}</span>
                        </button>

                        <button className="text-text-secondary hover:text-primary transition-colors group">
                            <Share2 size={24} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    <button className="text-text-secondary hover:text-primary transition-colors">
                        <Bookmark size={24} />
                    </button>
                </div>

                <div className="text-sm text-text-secondary font-medium cursor-pointer hover:underline">
                    {likesCount} likes
                </div>
            </div>
        </div>
    );
};
