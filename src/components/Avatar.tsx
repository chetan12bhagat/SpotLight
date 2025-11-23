import React from 'react';

interface AvatarProps {
    src: string;
    alt: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    verified?: boolean;
}

const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    size = 'md',
    className = '',
    verified = false
}) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <img
                src={src}
                alt={alt}
                className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white`}
            />
            {verified && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
};
