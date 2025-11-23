// Supabase Edge Function: createCheckoutSession
// Deploy with: supabase functions deploy createCheckoutSession

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16',
        })

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // Get user from JWT
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Not authenticated')
        }

        const { creatorId, priceId } = await req.json()

        if (!creatorId || !priceId) {
            throw new Error('Creator ID and Price ID are required')
        }

        // Get creator data
        const { data: creator, error: creatorError } = await supabaseClient
            .from('creators')
            .select('*')
            .eq('id', creatorId)
            .single()

        if (creatorError) throw creatorError

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${Deno.env.get('APP_BASE_URL')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${Deno.env.get('APP_BASE_URL')}/creator/${creatorId}`,
            metadata: {
                user_id: user.id,
                creator_id: creatorId,
            },
            subscription_data: {
                metadata: {
                    user_id: user.id,
                    creator_id: creatorId,
                },
            },
        })

        return new Response(
            JSON.stringify({ sessionId: session.id, url: session.url }),
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
