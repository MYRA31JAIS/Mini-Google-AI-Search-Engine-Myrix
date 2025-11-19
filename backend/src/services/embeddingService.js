import { pipeline } from '@xenova/transformers'

// Lazy load the model
let embedder = null

async function getEmbedder() {
  if (!embedder) {
    console.log('🔄 Loading MiniLM embedding model...')
    // Use MiniLM - lightweight and fast sentence transformer
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    console.log('✅ MiniLM model loaded')
  }
  return embedder
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export const embeddingService = {
  // Generate embedding for a text
  generateEmbedding: async (text) => {
    try {
      const model = await getEmbedder()
      const output = await model(text, { pooling: 'mean', normalize: true })
      return Array.from(output.data)
    } catch (error) {
      console.error('Embedding generation error:', error.message)
      return null
    }
  },

  // Find semantically similar queries
  findSimilar: async (query, candidates, threshold = 0.7) => {
    try {
      const queryEmbedding = await embeddingService.generateEmbedding(query)
      if (!queryEmbedding) return []

      const similarities = await Promise.all(
        candidates.map(async (candidate) => {
          const candidateEmbedding = await embeddingService.generateEmbedding(candidate)
          if (!candidateEmbedding) return { text: candidate, score: 0 }
          
          const score = cosineSimilarity(queryEmbedding, candidateEmbedding)
          return { text: candidate, score }
        })
      )

      return similarities
        .filter(s => s.score >= threshold)
        .sort((a, b) => b.score - a.score)
    } catch (error) {
      console.error('Similarity search error:', error.message)
      return []
    }
  },

  // Semantic search in search results
  semanticRank: async (query, searchResults) => {
    try {
      const queryEmbedding = await embeddingService.generateEmbedding(query)
      if (!queryEmbedding) return searchResults

      const rankedResults = await Promise.all(
        searchResults.map(async (result) => {
          const resultText = `${result.title} ${result.snippet}`
          const resultEmbedding = await embeddingService.generateEmbedding(resultText)
          
          if (!resultEmbedding) return { ...result, semanticScore: 0 }
          
          const score = cosineSimilarity(queryEmbedding, resultEmbedding)
          return { ...result, semanticScore: score }
        })
      )

      // Sort by semantic relevance
      return rankedResults.sort((a, b) => b.semanticScore - a.semanticScore)
    } catch (error) {
      console.error('Semantic ranking error:', error.message)
      return searchResults
    }
  }
}
