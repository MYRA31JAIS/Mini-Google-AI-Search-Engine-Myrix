# How to Get API Keys - Step by Step

## 🔑 1. Gemini API Key (REQUIRED for AI features)

### Quick Steps:
1. **Go to**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click** "Create API Key" button
4. **Select** "Create API key in new project" (or use existing)
5. **Copy** the key (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
6. **Paste** in `backend/.env`:
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Free Tier:
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ Perfect for development and demos

### Screenshot Guide:
```
Google AI Studio → Get API Key → Create API Key → Copy
```

---

## 🌐 2. SERP API Key (OPTIONAL - for real Google search)

### Quick Steps:
1. **Go to**: https://serpapi.com/users/sign_up
2. **Sign up** (free account)
3. **Go to**: https://serpapi.com/manage-api-key
4. **Copy** your API key
5. **Paste** in `backend/.env`:
   ```
   SERP_API_KEY=your_serp_key_here
   ```

### Free Tier:
- ✅ 100 searches per month
- ✅ No credit card required

---

## 🗺️ 3. Google Maps API Key (OPTIONAL - for geo features)

### Quick Steps:
1. **Go to**: https://console.cloud.google.com/google/maps-apis
2. **Enable** Maps JavaScript API
3. **Go to**: Credentials → Create Credentials → API Key
4. **Copy** the key
5. **Paste** in `backend/.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_maps_key_here
   ```

### Free Tier:
- ✅ $200 free credit per month
- ✅ Covers ~28,000 map loads

---

## ⚡ Quick Start (Just Gemini)

**Minimum to get started:**

1. Get Gemini API key (5 minutes)
2. Add to `backend/.env`
3. Run the app!

```bash
# backend/.env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

That's it! The rest uses mock data or local databases.

---

## 🔒 Security Tips

1. **Never commit** `.env` file to Git (already in `.gitignore`)
2. **Don't share** API keys publicly
3. **Restrict** API keys to your domain in production
4. **Rotate** keys if exposed

---

## ❓ Troubleshooting

### "Invalid API key"
- Make sure you copied the entire key
- Check for extra spaces
- Verify the API is enabled in Google Cloud Console

### "Quota exceeded"
- You've hit the free tier limit
- Wait for reset (daily/monthly)
- Or upgrade to paid tier

### "API not enabled"
- Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- Click "Enable"

---

## 📊 What Each API Gives You

| API | Feature | Required? |
|-----|---------|-----------|
| Gemini | AI summaries, reasoning | ⭐ Recommended |
| SERP | Real Google search results | Optional |
| Google Maps | Geo visualization | Optional |

**Start with just Gemini** - it's the most impressive feature for interviews!
