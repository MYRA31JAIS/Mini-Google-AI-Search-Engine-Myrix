// Trie data structure for fast autocomplete - O(k) where k = query length
class TrieNode {
  constructor() {
    this.children = new Map()
    this.isEndOfWord = false
    this.frequency = 0
    this.suggestions = []
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  // Insert a word - O(k)
  insert(word, frequency = 1) {
    let node = this.root
    word = word.toLowerCase()

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode())
      }
      node = node.children.get(char)
    }

    node.isEndOfWord = true
    node.frequency += frequency
  }

  // Search for a word - O(k)
  search(word) {
    let node = this.root
    word = word.toLowerCase()

    for (const char of word) {
      if (!node.children.has(char)) {
        return false
      }
      node = node.children.get(char)
    }

    return node.isEndOfWord
  }

  // Get all words with prefix - O(k + n) where n = number of results
  autocomplete(prefix, limit = 10) {
    let node = this.root
    prefix = prefix.toLowerCase()

    // Navigate to prefix node
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return []
      }
      node = node.children.get(char)
    }

    // Collect all words from this node
    const results = []
    this._collectWords(node, prefix, results)

    // Sort by frequency and return top results
    return results
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map(r => r.word)
  }

  _collectWords(node, prefix, results) {
    if (node.isEndOfWord) {
      results.push({ word: prefix, frequency: node.frequency })
    }

    for (const [char, childNode] of node.children) {
      this._collectWords(childNode, prefix + char, results)
    }
  }
}

// Global trie instance
const searchTrie = new Trie()

// Pre-populate with common search queries
const popularQueries = [
  'artificial intelligence', 'machine learning', 'deep learning',
  'python programming', 'javascript tutorial', 'react framework',
  'node.js backend', 'database design', 'web development',
  'elon musk', 'tesla cars', 'spacex rockets',
  'climate change', 'renewable energy', 'solar power',
  'quantum computing', 'blockchain technology', 'cryptocurrency',
  'covid vaccine', 'health tips', 'fitness workout',
  'stock market', 'investment strategy', 'real estate',
  'travel destinations', 'best restaurants', 'movie reviews'
]

popularQueries.forEach(query => searchTrie.insert(query, 10))

export const trieService = {
  // Add a search query to trie
  addQuery: (query) => {
    searchTrie.insert(query, 1)
  },

  // Get autocomplete suggestions - O(k + n)
  getSuggestions: (prefix, limit = 10) => {
    if (!prefix || prefix.length < 2) return []
    return searchTrie.autocomplete(prefix, limit)
  },

  // Check if query exists
  hasQuery: (query) => {
    return searchTrie.search(query)
  }
}
