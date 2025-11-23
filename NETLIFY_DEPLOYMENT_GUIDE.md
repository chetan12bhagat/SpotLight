# 🚀 Complete Netlify Deployment Guide for SpotLight

## Prerequisites Checklist
- ✅ GitHub repository: https://github.com/chetan12bhagat/SpotLight
- ✅ Netlify configuration files created
- ✅ Project builds successfully locally
- 📝 Supabase credentials ready (from `.env` file)

---

## 🎯 Deployment Methods

### **Method 1: Deploy via GitHub (Recommended)**

This method automatically redeploys when you push to GitHub.

#### Step 1: Sign Up/Login to Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **Sign up** or **Log in**
3. Choose **Sign up with GitHub** (easiest option)
4. Authorize Netlify to access your GitHub account

#### Step 2: Import Your Project
1. Click **Add new site** → **Import an existing project**
2. Choose **Deploy with GitHub**
3. Authorize Netlify to access your repositories (if prompted)
4. Search for and select **chetan12bhagat/SpotLight**

#### Step 3: Configure Build Settings
Netlify should auto-detect these settings (verify they match):

- **Branch to deploy:** `main`
- **Base directory:** (leave empty)
- **Build command:** `npm run build`
- **Publish directory:** `dist`

Click **Deploy site**

#### Step 4: Add Environment Variables ⚠️ CRITICAL
While the site is deploying:

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable** for each of these:

**Required Variables:**
```
VITE_SUPABASE_URL = your_supabase_url_here
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key_here
```

**Optional (if using Stripe):**
```
VITE_STRIPE_PUBLISHABLE_KEY = your_stripe_key_here
```

**Where to find these values:**
- Open your local `.env` file in the project
- Copy the values (DON'T share them publicly!)

#### Step 5: Trigger Redeploy
After adding environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait 1-2 minutes for build to complete

#### Step 6: Configure Custom Domain (Optional)
1. Go to **Domain settings**
2. Click **Add custom domain**
3. Follow the instructions to connect your domain

---

### **Method 2: Deploy via Netlify CLI**

If you prefer command-line deployment:

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify
```bash
netlify login
```
This will open a browser window to authorize.

#### Step 3: Initialize Netlify
```bash
netlify init
```
Follow the prompts:
- Create & configure a new site
- Choose your team
- Site name: `spotlight-app` (or your preferred name)
- Build command: `npm run build`
- Publish directory: `dist`

#### Step 4: Deploy
```bash
netlify deploy --prod
```

---

## 🔧 Build Configuration (Already Set Up)

Your project includes these files:

### `netlify.toml`
```toml
[build]
  base = "."
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `public/_redirects`
```
/*    /index.html   200
```

These ensure:
- ✅ Correct build process
- ✅ SPA routing works (no 404s on refresh)
- ✅ All routes redirect to index.html

---

## 🐛 Troubleshooting

### Issue: White/Blank Page
**Cause:** Missing environment variables  
**Fix:** 
1. Check browser console (F12) for errors
2. Verify all `VITE_*` variables are added in Netlify
3. Redeploy after adding variables

### Issue: Build Fails
**Cause:** Dependencies or Node version  
**Fix:**
1. Check build logs in Netlify Deploys tab
2. Add `.nvmrc` file with Node version:
   ```
   18
   ```
3. Redeploy

### Issue: 404 on Page Refresh
**Cause:** Missing redirects configuration  
**Fix:** Already fixed with `netlify.toml` and `_redirects`

### Issue: Supabase Connection Error
**Cause:** Wrong environment variables  
**Fix:**
1. Double-check `VITE_SUPABASE_URL` format: `https://xxxxx.supabase.co`
2. Verify `VITE_SUPABASE_ANON_KEY` is the anon/public key (not service role)
3. Check Supabase project is active

### Issue: Images/Assets Not Loading
**Cause:** Incorrect paths  
**Fix:** Use relative paths starting with `/` (e.g., `/logo.png`)

---

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads without white page
- [ ] Can navigate between pages
- [ ] Page refresh doesn't cause 404
- [ ] Supabase authentication works
- [ ] Images and assets load correctly
- [ ] Forms submit properly
- [ ] No console errors (F12 → Console)

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` to GitHub
- ✅ Use Netlify's environment variables UI
- ✅ Only expose `VITE_*` variables to the client
- ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` or `STRIPE_SECRET_KEY`

### Supabase RLS (Row Level Security)
Make sure your Supabase tables have proper RLS policies enabled.

---

## 🎨 Custom Domain Setup

### Using Netlify Domain
Your site will be available at: `https://your-site-name.netlify.app`

### Using Custom Domain
1. Purchase domain from registrar (GoDaddy, Namecheap, etc.)
2. In Netlify: **Domain settings** → **Add custom domain**
3. Add DNS records from your registrar:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```
4. Wait for DNS propagation (up to 48 hours)
5. Enable HTTPS (automatic with Netlify)

---

## 🚀 Continuous Deployment

With GitHub integration:
- ✅ Every push to `main` branch auto-deploys
- ✅ Preview deployments for pull requests
- ✅ Rollback to previous deployments anytime

---

## 📱 Performance Optimization

Netlify automatically provides:
- ✅ Global CDN
- ✅ Asset optimization
- ✅ Automatic HTTPS
- ✅ HTTP/2 support
- ✅ Gzip/Brotli compression

---

## 🆘 Need Help?

If you encounter issues:
1. Check Netlify build logs: **Deploys** → Click on deploy → **Deploy log**
2. Check browser console: Press F12 → **Console** tab
3. Check Netlify status: https://www.netlifystatus.com
4. Share error messages for assistance

---

## 📞 Quick Reference

- **Netlify Dashboard:** https://app.netlify.com
- **Your GitHub Repo:** https://github.com/chetan12bhagat/SpotLight
- **Netlify Docs:** https://docs.netlify.com
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 18+ recommended

---

## ✅ You're All Set!

Your SpotLight app is ready to deploy. Follow Method 1 above for the easiest deployment experience.

**Estimated deployment time:** 5-10 minutes (including environment variable setup)

Good luck! 🎉
