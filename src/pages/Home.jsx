import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Users, Shield, Zap, ArrowRight, Star } from 'lucide-react'

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2">
                            <Sparkles className="w-8 h-8 text-primary-600" />
                            <span className="text-2xl font-display font-bold gradient-text">Spotlight</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/explore" className="btn btn-secondary">
                                Explore
                            </Link>
                            <Link to="/login" className="btn btn-outline">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container-custom py-20">
                <div className="text-center max-w-4xl mx-auto animate-fade-in">
                    <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-6">
                        <Star className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-800 dark:text-primary-300">
                            Premium Creator Platform
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 text-balance">
                        Monetize Your
                        <span className="gradient-text"> Passion</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of creators building sustainable income through exclusive content and direct fan connections.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                        <Link to="/signup" className="btn btn-primary text-lg">
                            Start Creating
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link to="/explore" className="btn btn-secondary text-lg">
                            Explore Creators
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container-custom py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card card-hover p-8 text-center animate-slide-up">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3">Build Your Community</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Connect directly with your most dedicated fans and build lasting relationships.
                        </p>
                    </div>

                    <div className="card card-hover p-8 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3">Instant Monetization</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start earning from day one with flexible subscription pricing and instant payouts.
                        </p>
                    </div>

                    <div className="card card-hover p-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3">Safe & Compliant</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            100% safe platform with AI-powered moderation and strict content guidelines.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container-custom py-20">
                <div className="card p-12 text-center bg-gradient-to-br from-primary-600 to-accent-600 border-none">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Ready to Shine?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join Spotlight today and start building your creator empire.
                    </p>
                    <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg">
                        Create Your Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
                <div className="container-custom text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2025 Spotlight. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Home
