import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { postService } from '../services/postService'
import { supabase } from '../lib/supabase'
import {
    Upload, Image, Video, X, AlertCircle, CheckCircle,
    DollarSign, Clock, Eye, EyeOff, Tag, Calendar
} from 'lucide-react'

const CreatePost = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    // State
    const [creator, setCreator] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Form data
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [caption, setCaption] = useState('')
    const [isPaid, setIsPaid] = useState(false)
    const [price, setPrice] = useState('')
    const [isScheduled, setIsScheduled] = useState(false)
    const [scheduledDate, setScheduledDate] = useState('')
    const [tags, setTags] = useState('')
    const [visibility, setVisibility] = useState('public')

    useEffect(() => {
        loadCreatorProfile()
    }, [user])

    const loadCreatorProfile = async () => {
        if (!user) {
            setError('You must be logged in')
            setLoading(false)
            return
        }

        try {
            // Just mark as loaded - postService will handle user/creator creation
            setLoading(false)
            // We'll let the post creation handle everything
            setCreator({ id: 'temp' }) // Temp placeholder
        } catch (err) {
            console.error('Error loading creator profile:', err)
            setError('Failed to load creator profile')
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
        if (!validTypes.includes(selectedFile.type)) {
            setError('Please select a valid image or video file (JPG, PNG, GIF, WebP, MP4, WebM)')
            return
        }

        // Validate file size (max 100MB)
        if (selectedFile.size > 100 * 1024 * 1024) {
            setError('File size must be less than 100MB')
            return
        }

        setFile(selectedFile)
        setError('')

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
    }

    const handleRemoveFile = () => {
        setFile(null)
        setPreview(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!caption.trim() && !file) {
            setError('Please add a caption or upload media')
            return
        }

        if (!creator) {
            setError('Creator profile not found')
            return
        }

        setUploading(true)
        setError('')

        try {
            let mediaUrl = null
            let contentType = 'text'

            // Upload media if file is selected
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${user.id}/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('creator-content')
                    .upload(fileName, file)

                if (uploadError) throw new Error('Failed to upload media: ' + uploadError.message)

                mediaUrl = fileName
                contentType = file.type.startsWith('image/') ? 'image' : 'video'
            }

            // Prepare post data
            const postData = {
                content: caption.trim(),
                visibility,
                is_paid: isPaid,
                price: isPaid ? Math.floor(parseFloat(price) * 100) : null, // Convert to cents
                scheduled_at: isScheduled && scheduledDate ? new Date(scheduledDate).toISOString() : null,
                tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                content_type: contentType,
                content_url: mediaUrl,
                status: 'approved' // Auto-approve for now
            }

            const { data: post, error: postError } = await postService.createPost(postData)

            if (postError) throw postError

            setSuccess(true)

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        } catch (err) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to create post')
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
                        <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            Cancel
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {success ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Post Created!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Your post has been published successfully.
                        </p>
                        <Link to="/dashboard" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors">
                            View Dashboard
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Left Column - Main Content */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Media Upload */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <label className="block text-sm font-medium mb-4 text-gray-900 dark:text-white">
                                        Media (Optional)
                                    </label>
                                    {!preview ? (
                                        <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                                            <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Images (JPG, PNG, GIF) or Videos (MP4) up to 100MB
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full rounded-lg max-h-96 object-cover"
                                                />
                                            ) : (
                                                <video
                                                    src={preview}
                                                    controls
                                                    className="w-full rounded-lg max-h-96"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Caption */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <label className="block text-sm font-medium mb-4 text-gray-900 dark:text-white">
                                        Caption
                                    </label>
                                    <textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 min-h-[150px] resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                                        placeholder="Write a caption for your post..."
                                    />
                                    <p className="mt-2 text-sm text-gray-500">{caption.length} characters</p>
                                </div>
                            </div>

                            {/* Right Column - Settings */}
                            <div className="space-y-6">
                                {/* Visibility */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <label className="block text-sm font-medium mb-4 text-gray-900 dark:text-white">
                                        Visibility
                                    </label>
                                    <select
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="public">Public</option>
                                        <option value="subscribers">Subscribers Only</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                {/* Paid Post */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm font-medium text-gray-900 dark:text-white">
                                            Paid Post
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsPaid(!isPaid)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPaid ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPaid ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    {isPaid && (
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 pl-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Schedule Post */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm font-medium text-gray-900 dark:text-white">
                                            Schedule Post
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsScheduled(!isScheduled)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isScheduled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isScheduled ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    {isScheduled && (
                                        <input
                                            type="datetime-local"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                        />
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                    <label className="block text-sm font-medium mb-4 text-gray-900 dark:text-white">
                                        Tags (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="fitness, lifestyle, motivation"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Separate tags with commas</p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={uploading || (!caption.trim() && !file)}
                                    className="w-full bg-primary-600 text-white px-6 py-4 rounded-full font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {uploading ? 'Creating Post...' : isScheduled ? 'Schedule Post' : 'Publish Post'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default CreatePost
