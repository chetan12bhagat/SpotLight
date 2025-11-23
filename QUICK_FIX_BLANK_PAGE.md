# 🚨 QUICK FIX: Blank Page on Netlify

## The Problem
Your site shows a blank page because **environment variables are missing**.

## The Solution (5 minutes)

### Step 1: Get Your Environment Variables

1. Open your project in VS Code
2. Open the `.env` file in the root folder
3. You'll see something like this:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

**Keep this file open - you'll copy values from it.**

---

### Step 2: Add Variables to Netlify

**You already have the Netlify page open!**

On the page showing "Environment variables":

1. Click the **"Add a variable"** button

2. **First Variable:**
   - Key: `VITE_SUPABASE_URL`
   - Value: Copy the value from your `.env` file (the part after the `=`)
   - Click "Create variable"

3. **Second Variable:**
   - Click "Add a variable" again
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Copy from your `.env` file
   - Click "Create variable"

4. **Third Variable (if you have Stripe):**
   - Click "Add a variable" again
   - Key: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Value: Copy from your `.env` file
   - Click "Create variable"

---

### Step 3: Redeploy Your Site

1. Go to this URL: https://app.netlify.com/sites/spottlight/deploys

2. Click the **"Trigger deploy"** button (top right)

3. Select **"Clear cache and deploy site"**

4. Wait 1-2 minutes for the build to complete

5. Once it says "Published", click on your site URL

6. **Your site should now work!** 🎉

---

## ⚠️ Important Notes

- **Don't skip any variables** - All `VITE_*` variables are required
- **Copy the FULL value** - Including all characters after the `=`
- **No quotes needed** - Just paste the raw value
- **Must redeploy** - Changes only take effect after redeploying

---

## ✅ Checklist

- [ ] Opened `.env` file in VS Code
- [ ] Added `VITE_SUPABASE_URL` to Netlify
- [ ] Added `VITE_SUPABASE_ANON_KEY` to Netlify
- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY` to Netlify (if applicable)
- [ ] Triggered redeploy
- [ ] Waited for build to complete
- [ ] Tested the site

---

## 🆘 Still Not Working?

If you still see a blank page after redeploying:

1. Press **F12** on your site
2. Go to **Console** tab
3. Take a screenshot of the errors
4. Share with me for further help

---

## 📍 Quick Links

- **Environment Variables:** https://app.netlify.com/sites/spottlight/settings/env
- **Deploys:** https://app.netlify.com/sites/spottlight/deploys
- **Your Site:** https://spottlight.netlify.app/

---

**You're almost there! Just add those 2-3 environment variables and redeploy.** 🚀
