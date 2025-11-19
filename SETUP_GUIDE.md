# Setup Guide - Get Real Features Working

## Step 1: Get Gemini API Key (Required for AI)

### Option A: Google AI Studio (Recommended - Free)
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste it in `backend/.env` → `GEMINI_API_KEY=your_key_here`

### Option B: Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Enable "Generative Language API"
3. Create credentials → API Key
4. Copy and paste in `backend/.env`

## Step 2: Start Databases (Optional but Recommended)

```bash
# Start all databases with Docker
docker-compose up -d

# Check if running
docker-compose ps
```

This starts:
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ Neo4j (port 7474, 7687)
- ✅ Elasticsearch (port 9200)

## Step 3: Install Dependencies

```bash
# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## Step 4: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:4000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Step 5: Test It!

1. Open http://localhost:3000
2. Search for anything (e.g., "Artificial Intelligence")
3. You'll see:
   - ✅ AI-generated summary (powered by Gemini)
   - ✅ Search results
   - ✅ Interactive knowledge graph
   - ✅ Trend charts

## Optional: Add Real Web Search

For real Google search results, get SERP API key:

1. Sign up at: https://serpapi.com/ (100 free searches/month)
2. Copy API key
3. Add to `backend/.env`:
   ```
   SERP_API_KEY=your_serp_key_here
   ```

## Troubleshooting

### "Cannot connect to database"
- Make sure Docker is running: `docker-compose ps`
- Restart: `docker-compose restart`

### "Gemini API error"
- Check your API key is correct
- Verify it's enabled: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

### Port already in use
- Frontend (3000): Change in `frontend/vite.config.ts`
- Backend (4000): Change in `backend/.env` → `PORT=4001`

## What Works Without API Keys

Even without Gemini API key, you get:
- ✅ Full UI and animations
- ✅ Mock search results
- ✅ Knowledge graph visualization
- ✅ Trend charts
- ✅ Voice search
- ⚠️ AI summaries will be generic (not real AI)

## Next Steps

1. Get Gemini API key (5 minutes)
2. Start Docker databases (1 minute)
3. Run the app (30 seconds)
4. Start searching! 🚀

Need help? Check the error logs in the terminal.
