import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import searchRoutes from './routes/search.js'
import knowledgeGraphRoutes from './routes/knowledgeGraph.js'
import aiRoutes from './routes/ai.js'
import chatRoutes from './routes/chat.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/search', searchRoutes)
app.use('/api/knowledge-graph', knowledgeGraphRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/chat', chatRoutes)

// Serve static files from frontend build (for production)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendPath))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📊 Environment check:`)
  console.log(`   - Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`)
  console.log(`   - SERP API: ${process.env.SERP_API_KEY ? '✅ Configured' : '❌ Missing'}`)
  console.log(`💬 Features enabled:`)
  console.log(`   - AI Chatbot: ✅`)
  console.log(`   - People Also Ask: ✅`)
  console.log(`   - Answer Extraction: ✅`)
})
