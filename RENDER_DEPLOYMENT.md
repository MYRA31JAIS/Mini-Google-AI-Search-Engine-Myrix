# 🚀 Deploy to Render (Single Service)

## Quick Deploy - Everything in One Place!

### Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Mini-Google-AI-Search-Engine-Myrix`

### Step 2: Configure Service

**Name:** `mini-google-ai`

**Environment:** `Node`

**Build Command:**
```bash
npm install && cd frontend && npm install && npm run build && cd ../backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

**Instance Type:** `Free`

### Step 3: Add Environment Variables

Click **"Advanced"** → Add these variables:

```
NODE_ENV=production
PORT=10000
GEMINI_API_KEY=your_actual_gemini_key
SERP_API_KEY=your_actual_serp_key
OPENWEATHER_API_KEY=your_actual_openweather_key
```

### Step 4: Deploy!

Click **"Create Web Service"**

Render will:
- ✅ Install all dependencies
- ✅ Build your frontend
- ✅ Start your backend
- ✅ Serve everything from one URL!

### Step 5: Access Your App

Your app will be live at:
```
https://mini-google-ai.onrender.com
```

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Service spins down after 15 minutes of inactivity
- First request after sleep: ~30-50 seconds
- After that: Normal speed

### Upgrade to Paid ($7/month):
- Always-on service
- No spin-down delays
- Better performance

---

## 🔧 Troubleshooting

### Build Fails?
- Check that all `package.json` files are correct
- Verify Node.js version compatibility

### API Keys Not Working?
- Make sure you added them in Render dashboard
- Check they're not in quotes
- Verify they're valid

### Frontend Not Loading?
- Check that build command completed successfully
- Verify `frontend/dist` folder was created
- Check backend is serving static files

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables added
- [ ] Build completed successfully
- [ ] Service is running
- [ ] Can access the URL
- [ ] Search works on mobile
- [ ] All features working

---

## 🎉 You're Done!

Your entire app (frontend + backend) is now deployed on Render!

Share your link: `https://mini-google-ai.onrender.com`
