import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import searchRoutes from './routes/search.js'
import knowledgeGraphRoutes from './routes/knowledgeGraph.js'
import aiRoutes from './routes/ai.js'
import chatRoutes from './routes/chat.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/search', searchRoutes)
app.use('/api/knowledge-graph', knowledgeGraphRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/chat', chatRoutes)

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
