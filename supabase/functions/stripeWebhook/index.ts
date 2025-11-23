// Supabase Edge Function: stripeWebhook
// Deploy with: supabase functions deploy stripeWebhook

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
})

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
        return new Response('Missing signature or webhook secret', { status: 400 })
    }

    try {
        const body = await req.text()
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object
                const { user_id, creator_id } = session.metadata

                // Create subscription record
                await supabaseClient.from('subscriptions').insert([
                    {
                        subscriber_id: user_id,
                        creator_id: creator_id,
                        stripe_subscription_id: session.subscription,
                        stripe_customer_id: session.customer,
                        status: 'active',
                        current_period_start: new Date(session.created * 1000).toISOString(),
                    },
                ])

                // Create notification
                await supabaseClient.from('notifications').insert([
                    {
                        user_id: creator_id,
                        type: 'subscription',
                        title: 'New Subscriber!',
                        message: 'You have a new subscriber',
                    },
                ])

                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object
                const { user_id, creator_id } = subscription.metadata

                // Update subscription record
                await supabaseClient
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id)

                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object

                // Update subscription status to cancelled
                await supabaseClient
                    .from('subscriptions')
                    .update({
                        status: 'cancelled',
                        cancelled_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id)

                break
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object
                const subscription = invoice.subscription

                // Update subscription status to past_due
                await supabaseClient
                    .from('subscriptions')
                    .update({
                        status: 'past_due',
                    })
                    .eq('stripe_subscription_id', subscription)

                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        console.error('Webhook error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            },
        )
    }
})
