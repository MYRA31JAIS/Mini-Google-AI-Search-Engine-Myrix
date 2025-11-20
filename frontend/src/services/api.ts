import axios from 'axios'

// Use relative URL for same-domain deployment
const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export const searchAPI = {
  search: async (query: string) => {
    const { data } = await api.get('/search', { params: { q: query } })
    return data
  },

  getKnowledgeGraph: async (query: string) => {
    const { data } = await api.get('/knowledge-graph', { params: { q: query } })
    return data
  },

  getTrends: async (query: string) => {
    const { data } = await api.get('/trends', { params: { q: query } })
    return data
  }
}
