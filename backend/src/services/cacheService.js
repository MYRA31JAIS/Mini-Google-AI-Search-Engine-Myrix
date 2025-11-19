// Simple in-memory cache (use Redis in production)
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const cacheService = {
  get: (key) => {
    const item = cache.get(key)
    if (!item) return null
    
    // Check if expired
    if (Date.now() > item.expiry) {
      cache.delete(key)
      return null
    }
    
    console.log(`✅ Cache HIT: ${key}`)
    return item.data
  },

  set: (key, data, ttl = CACHE_TTL) => {
    cache.set(key, {
      data,
      expiry: Date.now() + ttl
    })
    console.log(`💾 Cache SET: ${key}`)
  },

  clear: () => {
    cache.clear()
    console.log('🗑️ Cache cleared')
  },

  // Get cache stats
  stats: () => ({
    size: cache.size,
    keys: Array.from(cache.keys())
  })
}
