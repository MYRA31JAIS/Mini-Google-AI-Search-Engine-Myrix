import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://mini-google-ai-backend.onrender.com/api'
      : '/api'),
  timeout: 30000,
  withCredentials: true
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
