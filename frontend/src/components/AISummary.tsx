import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface Props {
  summary?: {
    text: string
    keyPoints: string[]
    confidence: number
    relatedTopics?: string[]
  }
  image?: string
  isLoading: boolean
}

export default function AISummary({ summary, image, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40 rounded-2xl p-8 animate-pulse border-2 border-purple-500/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-2xl animate-pulse"></div>
        <div className="relative">
          <div className="h-8 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg w-1/3 mb-6"></div>
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-purple-500/20 rounded-lg w-full"></div>
              <div className="h-5 bg-blue-500/20 rounded-lg w-5/6"></div>
              <div className="h-5 bg-pink-500/20 rounded-lg w-4/6"></div>
            </div>
            <div className="w-56 h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-pink-900/50 rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 animate-pulse"></div>
      
      {/* Sparkle effects */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative">
        {/* Header with RAG badge */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
            <div className="absolute inset-0 bg-purple-500/30 blur-xl"></div>
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                🤖 RAG-Powered AI Answer
              </h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-xs font-bold text-white shadow-lg"
              >
                ✨ RETRIEVAL AUGMENTED
              </motion.div>
            </div>
            <p className="text-sm text-purple-300 mt-1">
              Generated from real-time search results using advanced AI
            </p>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg"
          >
            <span className="text-green-400 font-bold text-lg">
              {Math.round(summary.confidence * 100)}%
            </span>
            <span className="text-green-300 text-xs ml-1">confident</span>
          </motion.div>
        </div>
      
        {/* Main answer with image */}
        <div className="flex gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-semibold text-purple-300">COMPREHENSIVE ANSWER</span>
            </div>
            <p className="text-gray-100 leading-relaxed text-lg">{summary.text}</p>
          </motion.div>
          
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex-shrink-0 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img
                src={image}
                alt="Related visual"
                className="relative w-56 h-40 object-cover rounded-xl shadow-2xl border-2 border-purple-500/50 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=RAG+Image'
                }}
              />
            </motion.div>
          )}
        </div>
      
        {/* Key Facts - The RAG Magic! */}
        {summary.keyPoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg">
                <span className="text-2xl">⚡</span>
                <h3 className="font-bold text-yellow-300 text-lg">
                  RAG-EXTRACTED KEY FACTS
                </h3>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {summary.keyPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05, type: "spring" }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur group-hover:blur-md transition-all"></div>
                  <div className="relative flex items-start gap-3 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
                      className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                    >
                      {i + 1}
                    </motion.span>
                    <span className="text-gray-200 text-sm leading-relaxed font-medium">{point}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Topics */}
        {summary.relatedTopics && summary.relatedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-6 border-t border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔗</span>
              <h3 className="font-bold text-purple-300 text-lg">
                EXPLORE MORE WITH RAG
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {summary.relatedTopics.map((topic, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = `/search?q=${encodeURIComponent(topic)}`}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/50 hover:to-blue-500/50 text-purple-200 rounded-full text-sm font-semibold border border-purple-500/50 hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-500/50"
                >
                  {topic} →
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* RAG Confidence Score */}
        {summary.confidence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6 pt-6 border-t border-purple-500/30"
          >
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-sm font-bold text-green-300">RAG CONFIDENCE SCORE</span>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, type: "spring" }}
                  className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                >
                  <span className="text-white font-bold text-lg">{summary.confidence}%</span>
                </motion.div>
              </div>
              
              <div className="relative h-4 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.confidence}%` }}
                  transition={{ delay: 1.7, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-center">
                Based on {summary.keyPoints.length} facts retrieved from search results
              </p>
            </div>
          </motion.div>
        )}
        
        {/* RAG Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/50 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Powered by Retrieval-Augmented Generation (RAG)
            </span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
