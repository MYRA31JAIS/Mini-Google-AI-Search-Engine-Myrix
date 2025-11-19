import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Info, BookOpen, Lightbulb, Link2, Newspaper } from 'lucide-react'

interface Card {
  title: string
  points: string[]
  icon: any
  color: string
}

interface Props {
  cards?: Card[]
  isLoading: boolean
}

export default function CardsView({ cards, isLoading }: Props) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-pink-100/10 to-purple-100/10 rounded-3xl p-6 animate-pulse border border-white/10 h-80">
            <div className="h-6 bg-white/10 rounded-full w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded-full"></div>
              <div className="h-4 bg-white/10 rounded-full"></div>
              <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
              <div className="h-4 bg-white/10 rounded-full"></div>
              <div className="h-4 bg-white/10 rounded-full w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No cards available
      </div>
    )
  }

  const iconMap: Record<string, any> = {
    Sparkles, Info, BookOpen, Lightbulb, Link2, Newspaper
  }

  const vibrantColors = [
    'from-pink-300/30 via-rose-300/30 to-fuchsia-300/30',
    'from-sky-300/30 via-blue-300/30 to-indigo-300/30',
    'from-amber-300/30 via-orange-300/30 to-rose-300/30',
    'from-emerald-300/30 via-teal-300/30 to-cyan-300/30',
    'from-purple-300/30 via-violet-300/30 to-pink-300/30',
    'from-blue-300/30 via-cyan-300/30 to-teal-300/30'
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const IconComponent = iconMap[card.icon] || Info
        const isFlipped = flippedCards.has(idx)
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="h-80 perspective-1000"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className="relative w-full h-full cursor-pointer min-h-[320px]"
              onClick={() => toggleFlip(idx)}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of Card */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${vibrantColors[idx % vibrantColors.length]} backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-2xl overflow-hidden flex flex-col`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                  <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-white font-bold text-lg truncate drop-shadow-md">{card.title}</h3>
                </div>
                
                <ul className="space-y-2.5 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                  {card.points.slice(0, 6).map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                      <span className="text-white/60 mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-white/40 mt-3 text-center flex-shrink-0">
                  Click to flip
                </div>
              </div>

              {/* Back of Card */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${vibrantColors[idx % vibrantColors.length]} backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-2xl flex items-center justify-center`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center">
                  <IconComponent className="w-16 h-16 text-white/80 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/70 text-sm">
                    {card.points.length} key points
                  </p>
                  <div className="mt-6 text-xs text-white/40">
                    Click to flip back
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
