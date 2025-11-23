# Spotlight Platform - Complete Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup

#### A. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note down your project URL and anon key

#### B. Run Database Schema
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `supabase/schema.sql`
3. Execute the SQL
4. Verify all tables are created:
   - users
   - creators
   - posts
   - subscriptions
   - messages
   - stories
   - notifications
   - moderation_logs

#### C. Create Storage Buckets
The SQL script should create these automatically, but verify:
1. Go to Storage in Supabase Dashboard
2. Confirm these buckets exist:
   - creator-content (private)
   - stories-content (private)
   - messages-media (private)

#### D. Configure Storage Policies
Storage policies are included in the schema.sql file. Verify they're active.

#### E. Enable Realtime (Optional)
1. Go to Database → Replication
2. Enable realtime for:
   - messages
   - notifications

### 2. Stripe Setup

#### A. Create Stripe Account
1. Go to https://stripe.com
2. Create account and verify
3. Get API keys from Dashboard → Developers → API keys

#### B. Create Products and Prices
1. Go to Products
2. Create a product for each subscription tier
3. Note down the Price IDs

#### C. Set Up Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/stripeWebhook`
3. Select events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed
4. Copy webhook signing secret

### 3. Environment Variables

Update `.env` with all credentials:

\`\`\`env
# Supabase
VITE_SUPABASE_URL="https://qpyqjqdmkatxvwackkau.supabase.co"
VITE_SUPABASE_ANON_KEY="your-actual-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Moderation (Optional)
MODERATION_API_KEY="your-moderation-api-key"

# App
APP_BASE_URL="https://your-domain.com"
\`\`\`

### 4. Deploy Edge Functions

#### Install Supabase CLI
\`\`\`bash
npm install -g supabase
\`\`\`

#### Login and Link Project
\`\`\`bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
\`\`\`

#### Deploy Functions
\`\`\`bash
cd supabase/functions
supabase functions deploy moderatePost
supabase functions deploy createCheckoutSession
supabase functions deploy stripeWebhook
\`\`\`

#### Set Function Secrets
\`\`\`bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set MODERATION_API_KEY=your_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### 5. Frontend Deployment

#### Option A: Vercel

1. **Connect Repository**
   - Go to https://vercel.com
   - Import your Git repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   Add all VITE_* variables from your .env file

4. **Deploy**
   - Click Deploy
   - Vercel will build and deploy automatically

#### Option B: Netlify

1. **Connect Repository**
   - Go to https://netlify.com
   - Import your Git repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all VITE_* variables

4. **Deploy**
   - Click Deploy
   - Netlify will build and deploy automatically

#### Option C: Custom Server

1. **Build the App**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Serve Static Files**
   Use any static file server (nginx, Apache, etc.)
   Point to the `dist` directory

3. **Configure Environment**
   Set environment variables on your server

### 6. Post-Deployment Configuration

#### A. Update Stripe Webhook URL
Update your Stripe webhook endpoint to point to your production URL:
\`\`\`
https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/stripeWebhook
\`\`\`

#### B. Update APP_BASE_URL
Update the edge function secrets:
\`\`\`bash
supabase secrets set APP_BASE_URL=https://your-domain.com
\`\`\`

#### C. Configure Supabase Auth
1. Go to Authentication → URL Configuration
2. Add your production URL to:
   - Site URL
   - Redirect URLs

#### D. Create Admin User
1. Sign up through your app
2. Go to Supabase Dashboard → Table Editor → users
3. Find your user and set `is_admin = true`

### 7. Testing Checklist

- [ ] User can sign up
- [ ] User can sign in
- [ ] User can reset password
- [ ] Creator can onboard
- [ ] Creator can upload posts
- [ ] Posts go through moderation
- [ ] Subscriptions work with Stripe
- [ ] Messages send successfully
- [ ] Notifications appear
- [ ] Admin can moderate content
- [ ] Admin can verify creators
- [ ] Dark mode works
- [ ] Mobile responsive

### 8. Monitoring & Maintenance

#### A. Set Up Monitoring
- Enable Supabase logging
- Set up Stripe webhook monitoring
- Configure error tracking (Sentry, etc.)

#### B. Regular Tasks
- Monitor moderation queue
- Review creator applications
- Check payment processing
- Update content policies
- Backup database regularly

### 9. Security Best Practices

- [ ] All RLS policies are enabled
- [ ] Storage buckets are private
- [ ] Service role key is never exposed to frontend
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF tokens where needed

### 10. Scaling Considerations

#### When to Scale
- Database: > 10,000 active users
- Storage: > 100GB content
- Edge Functions: > 1M invocations/month

#### How to Scale
- Upgrade Supabase plan
- Enable database connection pooling
- Implement CDN for static assets
- Add caching layer (Redis)
- Optimize database queries
- Implement pagination everywhere

## 🚨 Troubleshooting

### Common Issues

**Issue**: Edge functions not working
- **Solution**: Check function logs in Supabase Dashboard
- Verify all secrets are set correctly
- Ensure CORS headers are included

**Issue**: Storage uploads failing
- **Solution**: Check RLS policies on storage.objects
- Verify bucket exists and is private
- Check file size limits

**Issue**: Stripe webhooks not received
- **Solution**: Verify webhook URL is correct
- Check webhook signing secret
- Test with Stripe CLI

**Issue**: Authentication errors
- **Solution**: Check Supabase Auth settings
- Verify redirect URLs are configured
- Clear browser cache and cookies

## 📞 Support

For deployment issues:
- Check Supabase docs: https://supabase.com/docs
- Check Stripe docs: https://stripe.com/docs
- Review application logs
- Contact support team

---

**Last Updated**: 2025-11-23
**Version**: 1.0.0
