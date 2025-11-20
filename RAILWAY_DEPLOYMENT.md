# 🚂 Deploy to Railway (Super Easy!)

## ✨ Why Railway?
- ✅ **$5 free credit/month** (enough for small projects)
- ✅ **No credit card** required for trial
- ✅ **Easier than Render** - Better build system
- ✅ **Fast deploys** - No cache issues
- ✅ **One-click deploy** from GitHub

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Sign Up
1. Go to: https://railway.app/
2. Click **"Start a New Project"**
3. Sign in with **GitHub** (easiest)

---

### Step 2: Deploy from GitHub
1. Click **"Deploy from GitHub repo"**
2. Select your repository: `Mini-Google-AI-Search-Engine-Myrix`
3. Click **"Deploy Now"**

Railway will auto-detect it's a Node.js app!

---

### Step 3: Add Environment Variables
1. Click on your deployed service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these 5 variables:

```
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=AIzaSyCtWxyNvUtaLb4aj0pRShRCGie87Co5qA0
SERP_API_KEY=a8bc40339d9b8df8f8b2c81ca317e045f890cba33f64b1102d8c3994f9e2e068
OPENWEATHER_API_KEY=50c058912efe4dc78453336b4e15d7f2
```

5. Click **"Deploy"** (it will redeploy with env vars)

---

## 🎉 Done!

Your app will be live at:
```
https://your-app-name.up.railway.app
```

Railway will show you the URL in the dashboard.

---

## 🔧 Useful Commands

### View Logs:
Click **"Deployments"** → Click latest deployment → **"View Logs"**

### Redeploy:
Click **"Deployments"** → **"Redeploy"**

### Custom Domain:
Go to **"Settings"** → **"Domains"** → Add your domain

---

## 💰 Free Tier

**What you get FREE:**
- $5 credit/month
- ~500 hours of usage
- Enough for one small app
- No sleep time!

**If you exceed:**
- You'll get a warning
- Add a credit card or app will pause

---

## ✅ Advantages over Render

1. **No build cache issues** - Fresh builds every time
2. **Faster deploys** - Usually 2-3 minutes
3. **Better logs** - Easier to debug
4. **Simpler setup** - Less configuration needed
5. **No sleep time** - Always on (within free tier)

---

## 🆘 Troubleshooting

### Build Failed?
- Check logs in deployment view
- Make sure all dependencies are in package.json

### App Not Starting?
- Check environment variables are set
- Look at startup logs

### Out of Credit?
- Monitor usage in dashboard
- Upgrade to paid plan ($5/month for more credit)

---

## 🎯 That's It!

Railway is much simpler than Render. Your app should work immediately!

**Your URL:** Check Railway dashboard for the generated URL

**Monitor:** https://railway.app/dashboard
