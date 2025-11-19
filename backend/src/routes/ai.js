import express from 'express'
import { aiService } from '../services/aiService.js'

const router = express.Router()

router.post('/summarize', async (req, res) => {
  try {
    const { query } = req.body
    const summary = await aiService.generateSummary(query)
    res.json(summary)
  } catch (error) {
    res.status(500).json({ error: 'AI summarization failed' })
  }
})

export default router
