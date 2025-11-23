import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const EmailVerificationBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-[#FFF5F7] dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-500 dark:text-red-400">
                <AlertTriangle size={24} />
                <span className="font-medium">Please verify your email address</span>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
                <button className="bg-primary hover:bg-primary-600 text-white font-bold px-6 py-2 rounded-full text-sm uppercase tracking-wide transition-colors flex-1 sm:flex-none">
                    Verify Email
                </button>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};
