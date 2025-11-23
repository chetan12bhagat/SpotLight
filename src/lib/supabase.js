import { supabase } from './supabaseClient'

export { supabase }

// Helper to get signed URL for private content
export const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn)

        if (error) throw error
        return data.signedUrl
    } catch (error) {
        console.error('Error creating signed URL:', error)
        return null
    }
}

// Helper to upload file
export const uploadFile = async (bucket, path, file) => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error uploading file:', error)
        throw error
    }
}

// Helper to delete file
export const deleteFile = async (bucket, path) => {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path])

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting file:', error)
        return false
    }
}
