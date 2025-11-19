import express from 'express'
import { aiService } from '../services/aiService.js'

const router = express.Router()

// Store conversation history (in production, use Redis or database)
const conversations = new Map()

router.post('/', async (req, res) => {
  try {
    const { message, sessionId = 'default', mode = 'normal' } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Special response for name question
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('why your-raa') || 
        lowerMessage.includes('why your raa') ||
        lowerMessage.includes('why are you called your-raa') ||
        lowerMessage.includes('why the name your-raa') ||
        (lowerMessage.includes('your-raa') && lowerMessage.includes('name'))) {
      return res.json({ reply: "Because she was Myraa! 💕 It's a special name with a beautiful meaning." })
    }

    // Get conversation history
    const history = conversations.get(sessionId) || []

    // Get AI response with personality mode
    const reply = await aiService.chat(message, history, mode)

    // Update conversation history
    history.push({ role: 'user', content: message })
    history.push({ role: 'assistant', content: reply })
    
    // Keep only last 10 messages
    if (history.length > 10) {
      history.splice(0, history.length - 10)
    }
    
    conversations.set(sessionId, history)

    res.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Chat failed', message: error.message })
  }
})

export default router
