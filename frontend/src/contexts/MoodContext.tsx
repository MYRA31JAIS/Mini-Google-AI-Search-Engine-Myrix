import { createContext, useContext, useState, ReactNode } from 'react'

type Mood = 'sad' | 'happy' | 'study' | 'romantic' | 'energetic' | 'calm' | 'dark' | 'default'

interface MoodContextType {
  globalMood: Mood
  setGlobalMood: (mood: Mood) => void
  resetGlobalMood: () => void
}

const MoodContext = createContext<MoodContextType | undefined>(undefined)

export function MoodProvider({ children }: { children: ReactNode }) {
  const [globalMood, setGlobalMood] = useState<Mood>('default')

  const resetGlobalMood = () => {
    setGlobalMood('default')
  }

  return (
    <MoodContext.Provider value={{ globalMood, setGlobalMood, resetGlobalMood }}>
      {children}
    </MoodContext.Provider>
  )
}

export function useMoodContext() {
  const context = useContext(MoodContext)
  if (context === undefined) {
    throw new Error('useMoodContext must be used within a MoodProvider')
  }
  return context
}
