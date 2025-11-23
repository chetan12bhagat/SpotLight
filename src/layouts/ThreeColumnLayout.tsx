import React from 'react';
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';

interface ThreeColumnLayoutProps {
    children: React.ReactNode;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-bg-secondary dark:bg-black flex justify-center">
            <div className="flex w-full max-w-[1280px]">
                {/* Left Sidebar - Fixed width */}
                <LeftSidebar />

                {/* Main Content - Flexible width */}
                <main className="flex-1 min-w-0 border-r border-border bg-white dark:bg-gray-950 min-h-screen w-full max-w-[600px] mx-auto lg:mx-0">
                    {children}
                </main>

                {/* Right Sidebar - Fixed width */}
                <RightSidebar />
            </div>
        </div>
    );
};
