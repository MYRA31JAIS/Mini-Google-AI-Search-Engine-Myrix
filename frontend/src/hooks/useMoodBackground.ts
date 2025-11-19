import { useMemo, useEffect } from 'react'
import { useMoodContext } from '../contexts/MoodContext'

type Mood = 'sad' | 'happy' | 'study' | 'romantic' | 'energetic' | 'calm' | 'dark' | 'default'

interface MoodTheme {
  gradient: string
  particles: string
  mood: Mood
  label: string
}

const moodThemes: Record<Mood, Omit<MoodTheme, 'mood' | 'label'>> = {
  sad: {
    gradient: 'from-blue-900 via-blue-800 to-gray-900',
    particles: 'from-blue-400 to-blue-600'
  },
  happy: {
    gradient: 'from-yellow-400 via-green-400 to-lime-500',
    particles: 'from-yellow-300 to-green-400'
  },
  study: {
    gradient: 'from-violet-400 via-purple-200 to-pink-400',
    particles: 'from-violet-300 to-purple-300'
  },
  romantic: {
    gradient: 'from-pink-500 via-rose-400 to-purple-500',
    particles: 'from-pink-400 to-purple-400'
  },
  energetic: {
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    particles: 'from-orange-400 to-red-400'
  },
  calm: {
    gradient: 'from-cyan-400 via-blue-200 to-cyan-400',
    particles: 'from-pink-300 to-rose-300'
  },
  dark: {
    gradient: 'from-gray-900 via-gray-800 to-black',
    particles: 'from-gray-600 to-gray-700'
  },
  default: {
    gradient: 'from-gray-900 via-gray-800 to-white-900',
    particles: 'from-green-400 to-blue-400'
  }
}

const moodKeywords: Record<Mood, string[]> = {
  sad: ['sad', 'depressed', 'lonely', 'crying', 'heartbreak', 'grief', 'loss', 'miss'],
  happy: ['happy', 'joy', 'celebrate', 'party', 'fun', 'excited', 'awesome', 'amazing'],
  study: ['study', 'learn', 'education', 'school', 'exam', 'homework', 'research', 'book'],
  romantic: ['love', 'romantic', 'date', 'valentine', 'crush', 'relationship', 'heart', 'kiss'],
  energetic: ['energy', 'workout', 'exercise', 'gym', 'sports', 'run', 'fitness', 'power'],
  calm: ['calm', 'relax', 'meditation', 'peace', 'zen', 'mindful', 'tranquil', 'serene'],
  dark: ['dark', 'night', 'horror', 'scary', 'mystery', 'gothic', 'black'],
  default: []
}

const moodLabels: Record<Mood, string> = {
  sad: '😢 Sad',
  happy: '😊 Happy',
  study: '📚 Study',
  romantic: '💕 Romantic',
  energetic: '⚡ Energetic',
  calm: '🧘 Calm',
  dark: '🌙 Dark',
  default: '✨ Default'
}

export function useMoodBackground(query: string): MoodTheme & { resetMood: () => void; setMood: (mood: Mood) => void } {
  const { globalMood, setGlobalMood, resetGlobalMood } = useMoodContext()

  const detectedMood = useMemo(() => {
    if (!query) return 'default'
    
    const lowerQuery = query.toLowerCase()
    
    // Check each mood's keywords
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (mood === 'default') continue
      
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        console.log(`🎨 Mood detected: ${mood} for query: "${query}"`)
        return mood as Mood
      }
    }
    
    return 'default'
  }, [query])

  // Update global mood when a new mood is detected
  useEffect(() => {
    if (detectedMood !== 'default') {
      setGlobalMood(detectedMood)
    }
  }, [detectedMood, setGlobalMood])

  const currentMood = detectedMood !== 'default' ? detectedMood : globalMood

  const resetMood = () => {
    resetGlobalMood()
  }

  const setMood = (mood: Mood) => {
    setGlobalMood(mood)
  }

  return {
    ...moodThemes[currentMood],
    mood: currentMood,
    label: moodLabels[currentMood],
    resetMood,
    setMood
  }
}

// Export mood labels for external use
export { moodLabels, type Mood }
