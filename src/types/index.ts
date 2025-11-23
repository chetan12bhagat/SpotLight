export interface User {
    id: string;
    username: string;
    displayName: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
    bio?: string;
    coverImage?: string;
    subscriberCount?: number;
    postCount?: number;
    isFree?: boolean;
}

export interface Post {
    id: string;
    creator: User;
    caption: string;
    media: Media[];
    likes: number;
    comments: number;
    timestamp: string;
    isLiked?: boolean;
}

export interface Media {
    id: string;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    aspectRatio?: number;
}

export interface Suggestion {
    id: string;
    user: User;
    coverImage: string;
    isFree: boolean;
}

export interface Notification {
    id: string;
    type: 'like' | 'comment' | 'subscription' | 'message';
    user: User;
    message: string;
    timestamp: string;
    isRead: boolean;
}
