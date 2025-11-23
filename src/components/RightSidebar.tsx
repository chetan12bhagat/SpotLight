import React from 'react';
import { Search } from 'lucide-react';
import { mockSuggestions } from '../data/mockData';
import { Avatar } from './Avatar';

export const RightSidebar = () => {
    return (
        <div className="hidden lg:block w-[350px] flex-shrink-0 p-4 sticky top-0 h-screen overflow-y-auto scrollbar-hide border-l border-border bg-white dark:bg-gray-950">
            {/* Search */}
            <div className="relative mb-6 group">
                <input
                    type="text"
                    placeholder="Search posts"
                    className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-3 pl-12 pr-4 text-text-primary placeholder-gray-500 focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-gray-900 transition-all duration-200"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            </div>

            {/* Suggestions Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-text-secondary text-sm uppercase tracking-wider">Suggestions</h3>
                <div className="flex gap-2">
                    <button className="text-primary hover:bg-primary-50 p-1.5 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Suggestions List */}
            <div className="space-y-4">
                {mockSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white dark:bg-gray-900 rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
                        {/* Cover Image */}
                        <div className="h-24 bg-gray-200 relative">
                            <img
                                src={suggestion.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            {suggestion.isFree && (
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded uppercase">
                                    Free
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="px-4 pb-4 relative">
                            <div className="flex justify-between items-end -mt-8 mb-2">
                                <Avatar
                                    src={suggestion.user.avatar}
                                    alt={suggestion.user.displayName}
                                    size="lg"
                                    className="border-4 border-white dark:border-gray-900"
                                    verified={suggestion.user.isVerified}
                                />
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-text-primary hover:text-primary cursor-pointer transition-colors">
                                        {suggestion.user.displayName}
                                    </h4>
                                    <p className="text-text-secondary text-sm">
                                        {suggestion.user.handle}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-text-secondary mt-3 line-clamp-2">
                                {suggestion.user.bio || "Follow for exclusive content and daily updates! ✨"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Links */}
            <div className="mt-8 px-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-tertiary">
                <a href="#" className="hover:underline">Privacy</a>
                <a href="#" className="hover:underline">Cookie Notice</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Help</a>
                <a href="#" className="hover:underline">2257</a>
                <span>© 2024 Spotlight</span>
            </div>
        </div>
    );
};
