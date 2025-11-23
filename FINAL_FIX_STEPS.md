# 🚀 FINAL FIX - Follow These Exact Steps

## ✅ I've opened a Notepad file with your exact values!

Look at the Notepad window that just opened - it has all the values you need.

---

## 📋 Step-by-Step Instructions:

### **Step 1: Open Netlify Environment Variables**

Click this link: https://app.netlify.com/sites/spottlight/settings/env

(Or you already have it open in your browser)

---

### **Step 2: Add First Variable**

1. Click **"Add a variable"** button
2. If it asks "Add a single variable" or "Import from .env", choose **"Add a single variable"**
3. In the **Key** field, copy from Notepad: `VITE_SUPABASE_URL`
4. In the **Value** field, copy from Notepad: `https://qpxjjpzgqnxfwdkxqwcr.supabase.co`
5. Click **"Create variable"** or **"Save"**

---

### **Step 3: Add Second Variable**

1. Click **"Add a variable"** button again
2. Choose **"Add a single variable"**
3. In the **Key** field, copy from Notepad: `VITE_SUPABASE_ANON_KEY`
4. In the **Value** field, copy the FULL long value from Notepad (starts with `eyJhbGciOi...`)
5. Click **"Create variable"** or **"Save"**

---

### **Step 4: Add Third Variable**

1. Click **"Add a variable"** button again
2. Choose **"Add a single variable"**
3. In the **Key** field, copy from Notepad: `VITE_STRIPE_PUBLISHABLE_KEY`
4. In the **Value** field, copy from Notepad: `pk_test_51QMholder`
5. Click **"Create variable"** or **"Save"**

---

### **Step 5: Verify Variables Are Saved**

After adding all 3 variables, the page should show:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_STRIPE_PUBLISHABLE_KEY

(Not "No environment variables set")

---

### **Step 6: Redeploy Your Site** ⚡

1. Click this link: https://app.netlify.com/sites/spottlight/deploys
2. Click the **"Trigger deploy"** button (top right)
3. Select **"Clear cache and deploy site"**
4. Wait 1-2 minutes for the build to complete
5. Once it says "Published", your site will work!

---

### **Step 7: Test Your Site** 🎉

Go to: https://spottlight.netlify.app/

Your site should now load properly - no more blank page!

---

## ⏱️ Total Time: 3-5 minutes

## 🆘 If You Get Stuck:

1. Make sure you're copying the FULL value (especially for VITE_SUPABASE_ANON_KEY - it's very long)
2. Make sure you click "Save" or "Create variable" after each one
3. Make sure to redeploy after adding all variables
4. Wait for the deploy to finish (check the Deploys page)

---

**The Notepad file has all the exact values - just copy and paste them into Netlify!** 📋
