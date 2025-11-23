// Supabase Edge Function: moderatePost
// Deploy with: supabase functions deploy moderatePost

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )

        const { postId } = await req.json()

        if (!postId) {
            throw new Error('Post ID is required')
        }

        // Get post data
        const { data: post, error: postError } = await supabaseClient
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single()

        if (postError) throw postError

        // TODO: Implement actual moderation logic here
        // This could call an AI moderation API (e.g., Google Cloud Vision, AWS Rekognition, etc.)
        // For now, we'll auto-approve all posts

        const moderationApiKey = Deno.env.get('MODERATION_API_KEY')
        let status = 'approved'
        let moderationResult = { safe: true }

        if (moderationApiKey) {
            // Example: Call moderation API
            // const response = await fetch('https://moderation-api.example.com/analyze', {
            //   method: 'POST',
            //   headers: {
            //     'Authorization': `Bearer ${moderationApiKey}`,
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({
            //     imageUrl: post.content_url,
            //   }),
            // })
            // moderationResult = await response.json()
            // status = moderationResult.safe ? 'approved' : 'rejected'
        }

        // Update post status
        const { data: updatedPost, error: updateError } = await supabaseClient
            .from('posts')
            .update({ status })
            .eq('id', postId)
            .select()
            .single()

        if (updateError) throw updateError

        // Create moderation log
        await supabaseClient
            .from('moderation_logs')
            .insert([
                {
                    post_id: postId,
                    action: status,
                    reason: moderationResult.safe ? 'Auto-approved' : 'Flagged by AI moderation',
                },
            ])

        return new Response(
            JSON.stringify({
                success: true,
                post: updatedPost,
                moderation: moderationResult,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        )
    }
})
