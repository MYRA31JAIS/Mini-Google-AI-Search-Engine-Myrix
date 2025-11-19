import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  url: string
  snippet: string
  source: string
}

interface Props {
  results?: SearchResult[]
  isLoading: boolean
}

export default function SearchResults({ results, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse border border-gray-700">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results?.map((result, index) => (
        <motion.a
          key={result.id}
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all group border border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl text-blue-400 group-hover:underline mb-1">
                {result.title}
              </h3>
              <p className="text-sm text-green-400 mb-2">{result.source}</p>
              <p className="text-gray-300">{result.snippet}</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-500 ml-4 flex-shrink-0" />
          </div>
        </motion.a>
      ))}
    </div>
  )
}
