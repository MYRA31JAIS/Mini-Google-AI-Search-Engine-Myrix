import axios from 'axios'
import dotenv from 'dotenv'
import { cacheService } from './cacheService.js'

dotenv.config()

const BING_API_KEY = process.env.BING_SEARCH_API_KEY

console.log('🔑 Bing API Key:', BING_API_KEY ? `${BING_API_KEY.substring(0, 10)}...` : 'NOT CONFIGURED')

// Bing Web Search API - Better quality than SERP
export const bingSearchService = {
  search: async (query) => {
    // Check cache first
    const cacheKey = `bing:${query.toLowerCase()}`
    const cached = cacheService.get(cacheKey)
    if (cached) return cached

    if (!BING_API_KEY) {
      console.log('⚠️ Bing API not configured, skipping')
      return null
    }

    try {
      console.log('🌐 Fetching from Bing Web Search API...')
      
      const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
        params: {
          q: query,
          count: 10,
          mkt: 'en-US',
          safeSearch: 'Moderate'
        },
        headers: {
          'Ocp-Apim-Subscription-Key': BING_API_KEY
        }
      })

      const webPages = response.data.webPages?.value || []
      
      const results = webPages.map((page, index) => ({
        id: String(index + 1),
        title: page.name,
        url: page.url,
        snippet: page.snippet || page.description || 'No description available',
        source: new URL(page.url).hostname.replace('www.', ''),
        datePublished: page.datePublished,
        language: page.language
      }))

      // Cache results
      cacheService.set(cacheKey, results)
      console.log(`✅ Bing returned ${results.length} results`)
      
      return results
    } catch (error) {
      console.error('Bing API error:', error.response?.data || error.message)
      return null
    }
  },

  // Get news results
  searchNews: async (query) => {
    if (!BING_API_KEY) return null

    try {
      const response = await axios.get('https://api.bing.microsoft.com/v7.0/news/search', {
        params: {
          q: query,
          count: 5,
          mkt: 'en-US'
        },
        headers: {
          'Ocp-Apim-Subscription-Key': BING_API_KEY
        }
      })

      return response.data.value || []
    } catch (error) {
      console.error('Bing News error:', error.message)
      return null
    }
  }
}
