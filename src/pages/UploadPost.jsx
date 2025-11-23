import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { postService } from '../services/postService'
import { creatorService } from '../services/creatorService'
import { moderationService } from '../services/moderationService'
import { Upload, Image, Video, X, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'

const UploadPost = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [creator, setCreator] = useState(null)
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [caption, setCaption] = useState('')
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        loadCreatorProfile()
    }, [user])

    const loadCreatorProfile = async () => {
        if (!user) return

        try {
            const { data } = await creatorService.getCreatorByUserId(user.id)
            if (!data) {
                setError('You must be a creator to upload posts')
                return
            }
            setCreator(data)
        } catch (error) {
            console.error('Error loading creator profile:', error)
            setError('Failed to load creator profile')
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
        if (!validTypes.includes(selectedFile.type)) {
            setError('Please select a valid image or video file')
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

        if (!file) {
            setError('Please select a file to upload')
            return
        }

        if (!creator) {
            setError('Creator profile not found')
            return
        }

        setUploading(true)
        setError('')

        try {
            // 1. Upload media file
            const { path, error: uploadError } = await postService.uploadPostMedia(file, creator.id)

            if (uploadError) throw uploadError

            // 2. Determine content type
            const contentType = file.type.startsWith('image/') ? 'image' : 'video'

            // 3. Create post record
            const { data: post, error: postError } = await postService.createPost({
                creator_id: creator.id,
                caption: caption.trim(),
                content_url: path,
                content_type: contentType,
                status: 'pending', // Will be moderated
            })

            if (postError) throw postError

            // 4. Trigger auto-moderation
            await moderationService.autoModeratePost(post.id)

            setSuccess(true)

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/creator-dashboard')
            }, 2000)
        } catch (err) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to upload post')
        } finally {
            setUploading(false)
        }
    }

    if (!creator && !error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <Sparkles className="w-8 h-8 text-primary-600" />
                            <span className="text-2xl font-display font-bold gradient-text">Spotlight</span>
                        </Link>
                        <Link to="/creator-dashboard" className="btn btn-secondary">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container-custom py-8 max-w-3xl mx-auto">
                <h1 className="text-3xl font-display font-bold mb-8">Upload New Post</h1>

                {success ? (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Post Uploaded!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Your post has been submitted for moderation and will be published soon.
                        </p>
                        <Link to="/creator-dashboard" className="btn btn-primary">
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="card p-8">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Media File</label>
                                {!preview ? (
                                    <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Images or videos (max 100MB)
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
                                                className="w-full rounded-lg"
                                            />
                                        ) : (
                                            <video
                                                src={preview}
                                                controls
                                                className="w-full rounded-lg"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Caption */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Caption</label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="textarea h-32"
                                    placeholder="Write a caption for your post..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={uploading || !file}
                                className="btn btn-primary w-full"
                            >
                                {uploading ? 'Uploading...' : 'Upload Post'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UploadPost
