import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PlaceholderPage } from './pages/PlaceholderPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import CreatorStudio from './pages/CreatorStudio';
import AdminPanel from './pages/AdminPanel';
import CreatorProfile from './pages/CreatorProfile';
import Settings from './pages/Settings';
import CreatePost from './pages/CreatePost';
import { SplashScreen } from './components/SplashScreen';

function App() {
    const [showSplash, setShowSplash] = useState(true);

    // Persist splash skip for the session
    useEffect(() => {
        if (sessionStorage.getItem('splashSeen')) {
            setShowSplash(false);
        }
    }, []);

    const handleSplashFinish = () => {
        sessionStorage.setItem('splashSeen', 'true');
        setShowSplash(false);
    };

    return (
        <>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            <ThemeProvider>
                <AuthProvider>
                    <Router>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/notifications"
                                element={
                                    <ProtectedRoute>
                                        <Notifications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/messages"
                                element={
                                    <ProtectedRoute>
                                        <Messages />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/creator-studio"
                                element={
                                    <ProtectedRoute>
                                        <CreatorStudio />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/create-post"
                                element={
                                    <ProtectedRoute>
                                        <CreatePost />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminPanel />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute>
                                        <Settings />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/subscriptions"
                                element={
                                    <ProtectedRoute>
                                        <PlaceholderPage title="Subscriptions" />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/payments"
                                element={
                                    <ProtectedRoute>
                                        <PlaceholderPage title="Payments" />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Creator Profile (public) */}
                            <Route path="/:username" element={<CreatorProfile />} />
                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
