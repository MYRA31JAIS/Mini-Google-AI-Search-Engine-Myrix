import { motion } from 'framer-motion'
import { User, Calendar, Briefcase, Star, Heart, MapPin } from 'lucide-react'

interface Props {
  data?: {
    name?: string
    image?: string
    age?: string | number
    profession?: string
    location?: string
    facts?: string[]
    bio?: string[]
    category?: string
  }
  isLoading: boolean
}

export default function KnowledgeGraph({ data, isLoading }: Props) {
  // Debug logging
  console.log('🎨 KnowledgeGraph received:', { data, isLoading })
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-50/10 to-purple-50/10 backdrop-blur-sm rounded-3xl p-6 animate-pulse border border-pink-200/20"
      >
        <div className="h-6 bg-pink-200/20 rounded-full w-1/2 mb-4"></div>
        <div className="h-48 bg-purple-200/20 rounded-2xl mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-pink-200/20 rounded-full"></div>
          <div className="h-4 bg-purple-200/20 rounded-full"></div>
        </div>
      </motion.div>
    )
  }

  // Don't render if no meaningful data
  if (!data || (!data.name && !data.age && !data.profession)) {
    console.log('🎨 KnowledgeGraph: No entity data to display')
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-pink-50/10 via-purple-50/10 to-blue-50/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20"
    >
      {/* Header with cute emoji */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Quick Info ✨
        </h3>
      </div>

      {/* Profile Image */}
      {data.image && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg">
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
          </div>
        </motion.div>
      )}

      {/* Name */}
      {data.name && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold text-white mb-1">{data.name}</h2>
          {data.category && (
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full text-xs text-pink-200 border border-pink-300/30">
              {data.category}
            </span>
          )}
        </motion.div>
      )}

      {/* Info Cards */}
      <div className="space-y-3 mb-4">
        {data.age && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-2xl p-3 border border-blue-300/20"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-200/60">Age</p>
              <p className="text-white font-semibold">{data.age}</p>
            </div>
          </motion.div>
        )}

        {data.profession && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl p-3 border border-purple-300/20"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-purple-200/60">Profession</p>
              <p className="text-white font-semibold">{data.profession}</p>
            </div>
          </motion.div>
        )}

        {data.location && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-2xl p-3 border border-green-300/20"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-green-200/60">Location</p>
              <p className="text-white font-semibold">{data.location}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Facts */}
      {data.facts && data.facts.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-pink-400" />
            <h4 className="text-sm font-semibold text-pink-200">Quick Facts</h4>
          </div>
          <div className="space-y-2">
            {data.facts.slice(0, 3).map((fact, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-300"
              >
                <span className="text-pink-400 mt-1">•</span>
                <span>{fact}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bio Points */}
      {data.bio && data.bio.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-2xl p-4 border border-indigo-300/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-indigo-200">About</h4>
          </div>
          <div className="space-y-2">
            {data.bio.slice(0, 3).map((point, idx) => (
              <motion.p
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 + idx * 0.1 }}
                className="text-xs text-gray-300 leading-relaxed"
              >
                {point}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
