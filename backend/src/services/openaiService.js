import axios from 'axios'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * OpenAI Service for ChatGPT integration
 */
export const openaiService = {
  /**
   * Chat with OpenAI GPT-4 or GPT-3.5
   */
  async chat(messages, options = {}) {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: options.model || 'gpt-3.5-turbo',
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        message: response.data.choices[0].message.content,
        usage: response.data.usage
      }
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.error?.message || 'OpenAI API request failed')
    }
  },

  /**
   * Generate search-enhanced response using RAG
   */
  async searchEnhancedChat(query, searchResults) {
    const context = searchResults
      .slice(0, 5)
      .map((result, i) => `[${i + 1}] ${result.title}\n${result.snippet}`)
      .join('\n\n')

    const messages = [
      {
        role: 'system',
        content: `You are MGAI (Mini Google AI), a helpful search assistant. Use the provided search results to answer questions accurately. Always cite sources using [1], [2], etc.`
      },
      {
        role: 'user',
        content: `Search Results:\n${context}\n\nQuestion: ${query}\n\nProvide a comprehensive answer based on the search results above.`
      }
    ]

    return await this.chat(messages, { maxTokens: 500 })
  }
}
