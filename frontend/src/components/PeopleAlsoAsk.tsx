import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Question {
  question: string
  answer: string
}

interface Props {
  questions?: Question[]
  isLoading: boolean
}

export default function PeopleAlsoAsk({ questions, isLoading }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-white mb-4">People also ask</h3>
      
      <div className="space-y-2">
        {questions.map((item, index) => (
          <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-gray-200 font-medium">{item.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-gray-300 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
