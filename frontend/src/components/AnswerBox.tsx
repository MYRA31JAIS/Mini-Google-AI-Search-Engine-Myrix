import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'

interface Props {
  answer?: {
    title: string
    subtitle?: string
    description: string
    image?: string
    source?: string
    sourceUrl?: string
  }
  isLoading: boolean
}

export default function AnswerBox({ answer, isLoading }: Props) {
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-700">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
          <div className="w-48 h-48 bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!answer) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl"
    >
      <div className="flex gap-6">
        {/* Left side - Text content */}
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-4xl font-normal text-white mb-2">
              {answer.title}
            </h1>
            {answer.subtitle && (
              <div className="flex items-center gap-2 text-gray-400">
                <span>{answer.subtitle}</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 mb-4">
            <button
              onClick={() => speak(answer.description)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              title="Listen"
            >
              <Volume2 className="w-5 h-5 text-blue-400" />
            </button>
            <p className="text-gray-300 leading-relaxed text-base">
              {answer.description}
            </p>
          </div>

          {answer.source && (
            <div className="text-sm text-gray-500">
              Source:{' '}
              <a
                href={answer.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {answer.source}
              </a>
            </div>
          )}
        </div>

        {/* Right side - Image */}
        {answer.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            <img
              src={answer.image}
              alt={answer.title}
              className="w-48 h-48 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x400/374151/ffffff?text=' + encodeURIComponent(answer.title)
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
