import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, Mail, Bookmark, Users, CreditCard, User, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar } from './Avatar';
import { useAuth } from '../contexts/AuthContext';

export const LeftSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { icon: <Home size={26} />, label: 'Home', path: '/dashboard' },
        { icon: <Bell size={26} />, label: 'Notifications', path: '/notifications' },
        { icon: <Mail size={26} />, label: 'Messages', path: '/messages' },
        { icon: <Bookmark size={26} />, label: 'Creator Studio', path: '/creator-studio' },
        { icon: <Users size={26} />, label: 'Subscriptions', path: '/subscriptions' },
        { icon: <CreditCard size={26} />, label: 'Add card', path: '/payments' },
        { icon: <User size={26} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="hidden md:flex flex-col h-screen sticky top-0 border-r border-border w-[88px] xl:w-[240px] flex-shrink-0 bg-white dark:bg-gray-950 z-50">
            {/* Logo */}
            <div className="p-4 xl:p-6 mb-2">
                <Link to="/dashboard" className="block">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white xl:hidden">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.4z" />
                        </svg>
                    </div>
                    <span className="hidden xl:block text-2xl font-bold text-primary">Spotlight</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 xl:px-4 space-y-1 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center justify-center xl:justify-start gap-4 p-3 xl:px-5 xl:py-3.5 rounded-full transition-colors duration-200 group
                ${isActive
                                    ? 'text-primary bg-primary-50 dark:bg-gray-900 font-medium'
                                    : 'text-text-primary hover:bg-bg-hover hover:text-primary dark:text-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="hidden xl:block text-lg tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}

                <button className="flex items-center justify-center xl:justify-start gap-4 p-3 xl:px-5 xl:py-3.5 rounded-full text-text-primary hover:bg-bg-hover hover:text-primary transition-colors duration-200 w-full dark:text-gray-100 dark:hover:bg-gray-800">
                    <span className="group-hover:scale-110 transition-transform duration-200">
                        <MoreHorizontal size={26} />
                    </span>
                    <span className="hidden xl:block text-lg tracking-wide">More</span>
                </button>
            </nav>

            {/* New Post Button */}
            <div className="p-4 mt-2">
                <Link
                    to="/create-post"
                    className="w-full bg-primary hover:bg-primary-600 text-white rounded-full p-3 xl:py-3.5 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <Plus size={24} strokeWidth={3} />
                    <span className="hidden xl:inline font-bold text-lg uppercase tracking-wide">New Post</span>
                </Link>
            </div>

            {/* User Profile */}
            <div className="p-4 mb-4">
                <button className="flex items-center justify-center xl:justify-between w-full p-2 rounded-full hover:bg-bg-hover transition-colors dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                            alt={user?.full_name || "User"}
                            size="md"
                        />
                        <div className="hidden xl:block text-left">
                            <p className="font-bold text-sm text-text-primary dark:text-white truncate max-w-[120px]">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User Name'}
                            </p>
                            <p className="text-xs text-text-secondary dark:text-gray-400">
                                @{user?.user_metadata?.username || user?.email?.split('@')[0] || 'username'}
                            </p>
                        </div>
                    </div>
                    <MoreHorizontal size={20} className="hidden xl:block text-text-secondary" />
                </button>
            </div>
        </div>
    );
};
