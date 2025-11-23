# 🚀 Add These Environment Variables to Netlify

## CRITICAL: Your site is blank because these are missing!

You need to add these environment variables to Netlify. Here's how:

---

## Step 1: Open Your `.env` File

In VS Code, open: `c:\Web-Projects\SpotLight\.env`

---

## Step 2: Copy These Variables to Netlify

Go to: https://app.netlify.com/projects/spottlight/configuration/env

For EACH variable below, click "Add a variable" and copy the values from your `.env` file:

### ✅ Required Variables (MUST ADD):

1. **VITE_SUPABASE_URL**
   - Key: `VITE_SUPABASE_URL`
   - Value: Copy from your `.env` file (should look like `https://xxxxx.supabase.co`)

2. **VITE_SUPABASE_ANON_KEY**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Copy from your `.env` file (long string starting with `eyJ...`)

### 📝 Optional Variables (Add if you have them):

3. **VITE_STRIPE_PUBLISHABLE_KEY** (if using Stripe payments)
   - Key: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Value: Copy from your `.env` file (starts with `pk_test_` or `pk_live_`)

---

## Step 3: Redeploy

After adding ALL variables:

1. Go to: https://app.netlify.com/sites/spottlight/deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait 1-2 minutes
4. Your site will work! ✅

---

## 🎯 Quick Checklist

- [ ] Opened `.env` file in VS Code
- [ ] Went to Netlify environment variables page
- [ ] Added `VITE_SUPABASE_URL`
- [ ] Added `VITE_SUPABASE_ANON_KEY`
- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY` (if applicable)
- [ ] Clicked "Trigger deploy" → "Clear cache and deploy site"
- [ ] Waited for deploy to complete
- [ ] Tested site at https://spottlight.netlify.app/

---

## ⚠️ Important Notes

- **Don't add** `SUPABASE_SERVICE_ROLE_KEY` - this is a secret key, not for the frontend
- **Don't add** `STRIPE_SECRET_KEY` - this is also a secret key
- **Only add variables starting with `VITE_`** - these are safe for the frontend

---

## 🆘 Need Help?

If you're stuck:
1. Make sure you're copying the FULL value from your `.env` file
2. Don't include the variable name or `=` sign, just the value
3. Make sure to redeploy after adding variables

---

**This should take 2-3 minutes total. Your site will work after this!** 🎉
