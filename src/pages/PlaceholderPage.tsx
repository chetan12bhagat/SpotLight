import React from 'react';
import { ThreeColumnLayout } from '../layouts/ThreeColumnLayout';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
    title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    return (
        <ThreeColumnLayout>
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-full mb-6">
                    <Construction size={48} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-2">
                    {title}
                </h1>
                <p className="text-text-secondary max-w-md">
                    This page is currently under construction. Check back soon for updates!
                </p>
            </div>
        </ThreeColumnLayout>
    );
};
