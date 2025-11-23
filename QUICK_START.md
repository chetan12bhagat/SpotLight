# Spotlight - Quick Start Guide

Get your Spotlight platform up and running in 10 minutes!

## 🚀 Quick Setup (Development)

### Step 1: Install Dependencies (1 minute)

\`\`\`bash
npm install
\`\`\`

### Step 2: Configure Supabase (3 minutes)

1. **Get your Supabase credentials:**
   - Go to your Supabase project: https://qpyqjqdmkatxvwackkau.supabase.co
   - Copy your **Anon Public Key** from Settings → API

2. **Update `.env` file:**
   \`\`\`env
   VITE_SUPABASE_URL="https://qpyqjqdmkatxvwackkau.supabase.co"
   VITE_SUPABASE_ANON_KEY="paste-your-actual-anon-key-here"
   \`\`\`

### Step 3: Set Up Database (3 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and click "Run"
4. Wait for "Success" message

### Step 4: Start Development Server (1 minute)

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:5173 in your browser!

## ✅ Verify Installation

1. **Home Page Loads** ✓
   - You should see the Spotlight landing page

2. **Sign Up Works** ✓
   - Click "Get Started"
   - Create an account
   - Check Supabase Dashboard → Authentication → Users

3. **Dashboard Loads** ✓
   - After signup, you should see your dashboard

## 🎯 Next Steps

### For Testing

1. **Create a Creator Profile:**
   - Click "Become a Creator" in the sidebar
   - Fill out the form
   - Submit

2. **Upload a Post:**
   - Go to Creator Dashboard
   - Click "Upload New Post"
   - Select an image/video
   - Add caption and upload

3. **Test Moderation:**
   - Posts will be in "pending" status
   - Check `posts` table in Supabase

### For Production

See `DEPLOYMENT_GUIDE.md` for:
- Stripe integration
- Edge function deployment
- Production deployment
- Security configuration

## 🔧 Common Issues

### Issue: "Missing Supabase environment variables"
**Solution:** Make sure you've updated the `.env` file with your actual anon key

### Issue: Database tables not found
**Solution:** Run the SQL schema in Supabase SQL Editor

### Issue: Port 5173 already in use
**Solution:** 
\`\`\`bash
# Kill the process using port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
\`\`\`

### Issue: Module not found errors
**Solution:**
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📁 Project Structure

\`\`\`
spotlight/
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── lib/             # Supabase client
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── index.css        # Global styles
├── supabase/
│   ├── functions/       # Edge functions
│   └── schema.sql       # Database schema
└── .env                 # Environment variables
\`\`\`

## 🎨 Key Features Implemented

- ✅ Authentication (Sign up, Sign in, Sign out)
- ✅ User Dashboard with feed
- ✅ Creator Profiles
- ✅ Post Upload with media
- ✅ Content Moderation (auto + manual)
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Protected Routes
- 🔄 Subscriptions (Stripe integration needed)
- 🔄 Real-time Messaging (needs setup)
- 🔄 Stories (24h content)
- 🔄 Admin Dashboard

## 📚 Documentation

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
- **Full README:** See `README.md`

## 🆘 Need Help?

1. Check the documentation files
2. Review Supabase logs in Dashboard
3. Check browser console for errors
4. Verify all environment variables are set

## 🎉 You're Ready!

Your Spotlight platform is now running locally. Start building amazing features!

---

**Happy Coding! 🚀**
