import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic } from 'lucide-react'
import { useVoiceSearch } from '../hooks/useVoiceSearch'
import { useMoodBackground } from '../hooks/useMoodBackground'
import ChatBot from '../components/ChatBot'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { isListening, startListening, transcript } = useVoiceSearch()
  const moodTheme = useMoodBackground(query)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleVoiceSearch = () => {
    startListening((text) => {
      setQuery(text)
      navigate(`/search?q=${encodeURIComponent(text)}`)
    })
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated Mood Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={moodTheme.gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${moodTheme.gradient}`}
        />
      </AnimatePresence>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-6xl font-bold mb-2">
          <span className="text-google-blue">M</span>
          <span className="text-google-red">i</span>
          <span className="text-google-yellow">n</span>
          <span className="text-google-blue">i</span>
          <span className="text-google-green"> G</span>
          <span className="text-google-red">o</span>
          <span className="text-google-yellow">o</span>
          <span className="text-google-blue">g</span>
          <span className="text-google-green">l</span>
          <span className="text-google-red">e</span>
          <span className="text-gray-400 ml-2">AI</span>
        </h1>
        <p className="text-gray-400 text-lg">Search with Intelligence</p>
      </motion.div>

      {/* Mood Selector - Above Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="w-full max-w-2xl mb-4 px-4 relative z-10"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {(['sad', 'happy', 'study', 'romantic', 'energetic', 'calm', 'dark'] as const).map((mood) => {
            const labels = {
              sad: '😢 Sad',
              happy: '😊 Happy',
              study: '📚 Study',
              romantic: '💕 Romantic',
              energetic: '⚡ Energetic',
              calm: '🧘 Calm',
              dark: '🌙 Dark'
            }
            const isActive = moodTheme.mood === mood
            
            return (
              <motion.button
                key={mood}
                onClick={() => moodTheme.setMood(mood)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md rounded-full text-xs border transition-all ${
                  isActive
                    ? 'bg-white/20 text-white border-white/40 shadow-lg'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80 hover:border-white/20'
                }`}
                title={`Switch to ${mood} mood`}
              >
                {labels[mood]}
              </motion.button>
            )
          })}
          
          {/* Reset Button */}
          {moodTheme.mood !== 'default' && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={moodTheme.resetMood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-white/80 border border-red-500/30 rounded-full text-xs hover:bg-red-500/30 hover:border-red-500/40 transition-all"
              title="Reset to default"
            >
              ✨ Reset
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch}
        className="w-full max-w-2xl px-4 relative z-10"
      >

        {/* Floating AI Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main Glow Orb */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 blur-2xl"
          />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 40 - 20, 0],
                y: [0, Math.random() * 40 - 20, 0],
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-full shadow-2xl hover:shadow-green-500/20 transition-all border border-gray-700/50 hover:border-green-500/50">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full py-4 pl-14 pr-14 rounded-full bg-transparent outline-none text-lg text-white placeholder-gray-500"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-6 top-1/2 -translate-y-1/2 ${
              isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-green-400'
            } transition-colors`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8">
          <button
            type="submit"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg shadow-sm hover:shadow transition-all text-gray-300 w-full sm:w-auto"
          >
            Google Search
          </button>
          <button
            type="button"
            onClick={() => query && navigate(`/search?q=${encodeURIComponent(query)}&lucky=true`)}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg shadow-sm hover:shadow transition-all text-gray-300 w-full sm:w-auto"
          >
            I'm Feeling Lucky
          </button>
        </div>
      </motion.form>

      {transcript && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-white/80 relative z-10"
        >
          Listening: {transcript}
        </motion.div>
      )}

      {/* Floating AI Chatbot */}
      <ChatBot />
    </div>
  )
}
