import express from 'express'
import { knowledgeGraphService } from '../services/knowledgeGraphService.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { q: query } = req.query
    const graph = await knowledgeGraphService.getGraph(query)
    res.json(graph)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch knowledge graph' })
  }
})

export default router
