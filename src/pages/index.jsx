// Placeholder pages for Spotlight platform
// These can be expanded with full functionality later

import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const PageLayout = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <nav className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="container-custom py-4">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-primary-600" />
                        <span className="text-2xl font-display font-bold gradient-text">Spotlight</span>
                    </Link>
                </div>
            </nav>
            <div className="container-custom py-8">
                <h1 className="text-3xl font-display font-bold mb-6">{title}</h1>
                {children}
            </div>
        </div>
    )
}

export const Explore = () => (
    <PageLayout title="Explore Creators">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Explore page coming soon!</p>
        </div>
    </PageLayout>
)

export const ForgotPassword = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md card p-8">
            <h1 className="text-3xl font-display font-bold text-center mb-6">Reset Password</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Enter your email to receive a password reset link.
            </p>
            <input type="email" className="input mb-4" placeholder="you@example.com" />
            <button className="btn btn-primary w-full">Send Reset Link</button>
            <div className="mt-4 text-center">
                <Link to="/login" className="text-primary-600 hover:text-primary-700">
                    Back to Login
                </Link>
            </div>
        </div>
    </div>
)

export const CreatorProfile = () => (
    <PageLayout title="Creator Profile">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Creator profile page coming soon!</p>
        </div>
    </PageLayout>
)

export const CreatorDashboard = () => (
    <PageLayout title="Creator Dashboard">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Subscribers</h3>
                <p className="text-3xl font-bold">0</p>
            </div>
            <div className="card p-6">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Posts</h3>
                <p className="text-3xl font-bold">0</p>
            </div>
            <div className="card p-6">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Revenue</h3>
                <p className="text-3xl font-bold">$0</p>
            </div>
        </div>
        <Link to="/upload" className="btn btn-primary">
            Upload New Post
        </Link>
    </PageLayout>
)

export const CreatorStudio = () => (
    <PageLayout title="Creator Studio">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Creator studio coming soon!</p>
        </div>
    </PageLayout>
)

export const Messages = () => (
    <PageLayout title="Messages">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Messaging feature coming soon!</p>
        </div>
    </PageLayout>
)

export const Notifications = () => (
    <PageLayout title="Notifications">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No new notifications</p>
        </div>
    </PageLayout>
)

export const Subscriptions = () => (
    <PageLayout title="My Subscriptions">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">You haven't subscribed to any creators yet.</p>
            <Link to="/explore" className="btn btn-primary mt-4">
                Explore Creators
            </Link>
        </div>
    </PageLayout>
)

export const Settings = () => (
    <PageLayout title="Settings">
        <div className="card p-8">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">Settings page coming soon!</p>
        </div>
    </PageLayout>
)

export const AdminDashboard = () => (
    <PageLayout title="Admin Dashboard">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Admin dashboard coming soon!</p>
        </div>
    </PageLayout>
)

export const ModerationQueue = () => (
    <PageLayout title="Moderation Queue">
        <div className="card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Moderation queue coming soon!</p>
        </div>
    </PageLayout>
)

export const CreatorOnboarding = () => (
    <PageLayout title="Become a Creator">
        <div className="card p-8">
            <h2 className="text-2xl font-bold mb-4">Start Your Creator Journey</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Fill out the form below to become a creator on Spotlight.
            </p>
            <div className="space-y-4">
                <input type="text" className="input" placeholder="Display Name" />
                <textarea className="textarea" placeholder="Bio" rows="4" />
                <input type="number" className="input" placeholder="Monthly Subscription Price ($)" />
                <button className="btn btn-primary">Submit Application</button>
            </div>
        </div>
    </PageLayout>
)
