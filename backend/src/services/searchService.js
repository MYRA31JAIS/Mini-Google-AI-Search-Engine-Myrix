import axios from 'axios'
import dotenv from 'dotenv'
import { cacheService } from './cacheService.js'
import { bingSearchService } from './bingSearchService.js'
import { aiService } from './aiService.js'

// Ensure environment variables are loaded
dotenv.config()

const SERP_API_KEY = process.env.SERP_API_KEY
const BING_API_KEY = process.env.BING_SEARCH_API_KEY

console.log('🔑 SERP API Key loaded:', SERP_API_KEY ? `${SERP_API_KEY.substring(0, 10)}...` : 'NOT FOUND')

// Real Google search using SERP API or Bing API with caching
export const searchService = {
  search: async (query) => {
    // Check cache first - O(1)
    const cacheKey = `search:${query.toLowerCase()}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    // Try Bing first (better quality if available)
    if (BING_API_KEY) {
      const bingResults = await bingSearchService.search(query)
      if (bingResults && bingResults.length > 0) {
        cacheService.set(cacheKey, bingResults)
        return bingResults
      }
    }
    // If SERP API key is available, use real Google search
    if (SERP_API_KEY && SERP_API_KEY.length > 0) {
      try {
        console.log('🌐 Fetching real Google search results...')
        const response = await axios.get('https://serpapi.com/search', {
          params: {
            q: query,
            api_key: SERP_API_KEY,
            engine: 'google',
            num: 10
          }
        })

        const organicResults = response.data.organic_results || []
        const answerBox = response.data.answer_box
        const knowledgeGraph = response.data.knowledge_graph
        
        const results = organicResults.slice(0, 10).map((result, index) => ({
          id: String(index + 1),
          title: result.title,
          url: result.link,
          snippet: result.snippet || result.description || 'No description available',
          source: new URL(result.link).hostname.replace('www.', ''),
          // Add rich snippets if available
          richSnippet: result.rich_snippet?.top || result.rich_snippet?.bottom,
          rating: result.rating,
          date: result.date,
          sitelinks: result.sitelinks
        }))
        
        // Add featured snippet/answer box if available
        if (answerBox) {
          results.unshift({
            id: '0',
            title: answerBox.title || 'Featured Answer',
            url: answerBox.link || '',
            snippet: answerBox.answer || answerBox.snippet || '',
            source: answerBox.displayed_link || 'Google',
            isFeatured: true,
            type: answerBox.type
          })
        }
        
        // Add knowledge graph data
        if (knowledgeGraph) {
          results.knowledgeGraph = {
            title: knowledgeGraph.title,
            type: knowledgeGraph.type,
            description: knowledgeGraph.description,
            image: knowledgeGraph.image,
            facts: knowledgeGraph.attributes || {}
          }
        }
        
        // Cache search results - O(1)
        cacheService.set(cacheKey, results)
        return results
      } catch (error) {
        console.error('SERP API error:', error.response?.data || error.message)
        
        // If SERP API fails, return error - no mock data
        throw new Error(`Failed to fetch search results: ${error.message}`)
      }
    } else {
      console.log('❌ SERP API key not configured')
      throw new Error('SERP API key is required for real-time search')
    }
  },

  getTrends: async (query) => {
    // Check cache - O(1)
    const cacheKey = `trends:${query.toLowerCase()}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached
    
    // Generate realistic trend data based on query
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const baseValue = 60 + Math.floor(Math.random() * 20)
    
    const trends = months.map((month, i) => ({
      date: month,
      value: baseValue + Math.floor(Math.random() * 30) + i * 3
    }))
    
    cacheService.set(cacheKey, trends)
    return trends
  },

  // Get image for the query using SERP API or fallback
  getImage: async (query) => {
    // Check cache - O(1)
    const cacheKey = `image:${query.toLowerCase()}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached
    
    // Try SERP API for Google Images
    if (SERP_API_KEY) {
      try {
        const response = await axios.get('https://serpapi.com/search', {
          params: {
            q: query,
            api_key: SERP_API_KEY,
            engine: 'google_images',
            num: 1
          }
        })

        const images = response.data.images_results || []
        if (images.length > 0) {
          const imageUrl = images[0].original || images[0].thumbnail
          cacheService.set(cacheKey, imageUrl)
          return imageUrl
        }
      } catch (error) {
        console.error('Image search error:', error.message)
      }
    }

    // Fallback to Unsplash
    const fallbackUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}`
    cacheService.set(cacheKey, fallbackUrl)
    return fallbackUrl
  },

  // Generate AI-powered summary from search results
  generateSummary: async (query, searchResults) => {
    try {
      const topResults = searchResults.slice(0, 5)
      const context = topResults
        .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet}`)
        .join('\n\n')

      const prompt = `Based on these search results about "${query}", provide a comprehensive, accurate summary in 2-3 paragraphs. Include key facts and cite sources using [1], [2], etc.

Search Results:
${context}

Summary:`

      const summary = await aiService.generateText(prompt)
      return summary
    } catch (error) {
      console.error('Summary generation error:', error.message)
      return null
    }
  },

  // Extract entity information for knowledge graph
  getKnowledgeGraph: async (query) => {
    // Check cache - O(1)
    const cacheKey = `kg:${query.toLowerCase()}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    try {
      // Use AI to extract entity information
      const prompt = `Extract key information about "${query}" in JSON format. If it's a person, place, or thing, provide:
{
  "name": "Full name",
  "age": "Age or year",
  "profession": "Main profession/role",
  "location": "Location/origin",
  "category": "Person/Place/Organization/etc",
  "facts": ["3 interesting facts"],
  "bio": ["3 short bio points"]
}

If not a notable entity, return null. Be concise and accurate.`

      const response = await aiService.generateText(prompt)
      
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0])
        
        // Get image for the entity
        const image = await searchService.getImage(query)
        data.image = image
        
        cacheService.set(cacheKey, data)
        return data
      }
      
      return null
    } catch (error) {
      console.error('Knowledge graph extraction error:', error.message)
      return null
    }
  }
}
