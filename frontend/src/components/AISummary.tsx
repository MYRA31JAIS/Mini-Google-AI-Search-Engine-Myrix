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
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse border border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="flex gap-6">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
          <div className="w-48 h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">AI-Powered Answer</h2>
        <span className="ml-auto text-sm text-gray-400">
          {Math.round(summary.confidence * 100)}% confidence
        </span>
      </div>
      
      <div className="flex gap-6 mb-4">
        <div className="flex-1">
          <p className="text-gray-300 leading-relaxed">{summary.text}</p>
        </div>
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <img
              src={image}
              alt="Related visual"
              className="w-48 h-32 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/4285f4/ffffff?text=Image'
              }}
            />
          </motion.div>
        )}
      </div>
      
      {summary.keyPoints.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span className="text-blue-400">📌</span>
            10 Key Facts:
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {summary.keyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <span className="text-gray-300 text-sm leading-relaxed">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Related Topics */}
      {summary.relatedTopics && summary.relatedTopics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-purple-400">🔗</span>
            Related Topics:
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.relatedTopics.map((topic, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => window.location.href = `/search?q=${encodeURIComponent(topic)}`}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-full text-sm transition-colors"
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Score */}
      {summary.confidence && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Answer Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                  style={{ width: `${summary.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-white">{summary.confidence}%</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
