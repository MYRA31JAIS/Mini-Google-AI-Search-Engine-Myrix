import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Mic, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useMoodBackground } from '../hooks/useMoodBackground'

interface Props {
  initialQuery: string
  showBackButton?: boolean
}

export default function SearchHeader({ initialQuery, showBackButton = false }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const moodTheme = useMoodBackground(query)

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await axios.get('/api/search/autocomplete', {
          params: { q: query }
        })
        setSuggestions(response.data.suggestions || [])
      } catch (error) {
        setSuggestions([])
      }
    }

    const debounce = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowSuggestions(false)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <a href="/" className="text-2xl font-bold">
          <span className="text-google-blue">M</span>
          <span className="text-google-red">G</span>
          <span className="text-google-yellow">A</span>
          <span className="text-google-green">I</span>
        </a>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          {/* Mini Floating Particles for Header */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, Math.random() * 20 - 10, 0],
                  y: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-green-400/60"
                style={{
                  left: `${20 + i * 20}%`,
                  top: '50%',
                }}
              />
            ))}
          </div>

          <div className="relative flex items-center gap-2">
            {/* Mood Tag - Next to Search Bar */}
            <AnimatePresence>
              {moodTheme.mood !== 'default' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex-shrink-0"
                >
                  <button
                    onClick={moodTheme.resetMood}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white/80 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all group"
                    title="Click to reset mood"
                  >
                    {moodTheme.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">×</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full py-2 pl-12 pr-12 bg-gray-700/90 backdrop-blur-sm border border-gray-600 rounded-full outline-none focus:border-green-500 focus:shadow-lg focus:shadow-green-500/20 text-white placeholder-gray-400 transition-all"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-gray-500" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </header>
  )
}
