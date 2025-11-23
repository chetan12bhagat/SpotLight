# Spotlight - Premium Creator Subscription Platform

A modern, safe, and compliant creator subscription platform built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Features

- **Authentication**: Secure email/password authentication with Supabase Auth
- **Creator Profiles**: Customizable creator profiles with verification system
- **Content Upload**: Upload images and videos with automatic moderation
- **Subscriptions**: Stripe-powered subscription system
- **Messaging**: Real-time direct messaging between users
- **Stories**: 24-hour ephemeral content
- **Admin Dashboard**: Content moderation and user management
- **Dark Mode**: Beautiful light and dark themes
- **Responsive**: Fully responsive design for all devices

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account
- Stripe account (for subscriptions)

## 🛠️ Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Update the `.env` file with your actual credentials:

\`\`\`env
VITE_SUPABASE_URL="https://qpyqjqdmkatxvwackkau.supabase.co"
VITE_SUPABASE_ANON_KEY="<YOUR_ACTUAL_ANON_KEY>"
SUPABASE_SERVICE_ROLE_KEY="<YOUR_SERVICE_ROLE_KEY>"
VITE_STRIPE_PUBLISHABLE_KEY="<YOUR_STRIPE_PUBLISHABLE_KEY>"
STRIPE_SECRET_KEY="<YOUR_STRIPE_SECRET_KEY>"
STRIPE_WEBHOOK_SECRET="<YOUR_STRIPE_WEBHOOK_SECRET>"
MODERATION_API_KEY="<YOUR_MODERATION_API_KEY>"
APP_BASE_URL="http://localhost:5173"
\`\`\`

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create all tables, RLS policies, and storage buckets

### 4. Deploy Supabase Edge Functions

Install Supabase CLI if you haven't:

\`\`\`bash
npm install -g supabase
\`\`\`

Login to Supabase:

\`\`\`bash
supabase login
\`\`\`

Link your project:

\`\`\`bash
supabase link --project-ref qpyqjqdmkatxvwackkau
\`\`\`

Deploy edge functions:

\`\`\`bash
supabase functions deploy moderatePost
supabase functions deploy createCheckoutSession
supabase functions deploy stripeWebhook
\`\`\`

Set edge function secrets:

\`\`\`bash
supabase secrets set STRIPE_SECRET_KEY=<your_stripe_secret_key>
supabase secrets set STRIPE_WEBHOOK_SECRET=<your_webhook_secret>
supabase secrets set MODERATION_API_KEY=<your_moderation_api_key>
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

## 📁 Project Structure

\`\`\`
spotlight/
├── src/
│   ├── components/          # Reusable React components
│   ├── contexts/            # React contexts (Auth, Theme)
│   ├── lib/                 # Supabase client configuration
│   ├── pages/               # Page components
│   ├── services/            # API service modules
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── functions/           # Edge functions
│   └── schema.sql           # Database schema
├── .env                     # Environment variables
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
└── vite.config.js           # Vite configuration
\`\`\`

## 🎨 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments**: Stripe
- **Icons**: Lucide React
- **Routing**: React Router v6

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- Private storage buckets with signed URLs
- AI-powered content moderation
- KYC verification for creators
- Secure authentication with Supabase Auth

## 📝 Key Services

### Authentication Service
- Sign up, sign in, sign out
- Password reset
- Session management

### Creator Service
- Profile management
- Media uploads (avatar, banner, ID verification)
- Analytics
- Search and discovery

### Post Service
- Create, read, update, delete posts
- Media upload with signed URLs
- Feed generation
- Content filtering

### Subscription Service
- Stripe integration
- Subscription management
- Payment webhooks

### Messaging Service
- Real-time messaging
- Media attachments
- Read receipts

### Moderation Service
- Content approval/rejection
- Creator verification
- Moderation logs
- Auto-moderation with AI

## 🚀 Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

The build output will be in the `dist/` directory.

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Set environment variables
3. Deploy!

## 📄 License

This project is proprietary and confidential.

## 🤝 Support

For support, email support@spotlight.com

---

Built with ❤️ by the Spotlight Team
