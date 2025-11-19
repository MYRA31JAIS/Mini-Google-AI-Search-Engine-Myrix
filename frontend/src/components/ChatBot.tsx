import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Heart, GraduationCap, Code, Flame } from 'lucide-react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type AIMode = 'normal' | 'study' | 'roast' | 'love' | 'tutor' | 'coding'

const AI_MODES = [
  { id: 'normal', name: 'Normal', icon: Sparkles, color: 'blue' },
  { id: 'study', name: 'Study', icon: GraduationCap, color: 'green' },
  { id: 'roast', name: 'Roast', icon: Flame, color: 'red' },
  { id: 'love', name: 'Love', icon: Heart, color: 'pink' },
  { id: 'tutor', name: 'Tutor', icon: GraduationCap, color: 'purple' },
  { id: 'coding', name: 'Coding', icon: Code, color: 'yellow' }
] as const

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [aiMode, setAIMode] = useState<AIMode>('normal')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your-Raa, your AI assistant. Ask me anything!' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', { 
        message: userMessage,
        mode: aiMode 
      })
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const getModeGreeting = (mode: AIMode) => {
    const greetings = {
      normal: 'Hi! I\'m your-Raa, your AI assistant. Ask me anything!',
      study: '📚 Study Mode activated! Let\'s learn together. What topic shall we explore?',
      roast: '🔥 Roast Mode ON! Prepare to be roasted... What do you want me to roast?',
      love: '💕 Love Mode activated! Spreading positivity and love. How can I brighten your day?',
      tutor: '👨‍🏫 Tutor Mode ready! I\'ll explain concepts step-by-step. What would you like to learn?',
      coding: '💻 Coding Mode engaged! Ready to help with programming. What are you building?'
    }
    return greetings[mode]
  }

  const handleModeChange = (mode: AIMode) => {
    setAIMode(mode)
    setMessages([{ role: 'assistant', content: getModeGreeting(mode) }])
  }

  return (
    <>
      {/* Cute Animated Assistant Bubble */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Static Container (no floating) */}
        <div>
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
          
          {/* Main Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Sparkle Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            
            {/* Character Icon */}
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <X className="w-7 h-7 text-white" />
                  
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  className="text-3xl"
                >
                  🧜🏻‍♀️
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Greeting Bubble */}
          <AnimatePresence>
            
            {!isOpen && (
              
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: 1 }}
                className="absolute right-20 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 shadow-xl border border-white/20 whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💜
                  </motion.div>
                  <p className="text-white text-sm font-medium">
                    Hi! I'm your-Raa
                  </p>
                </div>
                {/* Speech bubble arrow */}
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white/10"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[500px] bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-700"
          >
            {/* Header with Cute Character */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-4 rounded-t-2xl relative overflow-hidden">
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  {/* Animated Character */}
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="text-2xl"
                  >
                    🧜🏻‍♀️
                  </motion.div>
                  
                  <div>
                    <h3 className="text-white font-bold">your-Raa AI</h3>
                    <p className="text-xs text-white/70">Your friendly assistant</p>
                  </div>
                  
                  {AI_MODES.find(m => m.id === aiMode)?.icon && (
                    <motion.div
                      key={aiMode}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="ml-2"
                    >
                      {(() => {
                        const Icon = AI_MODES.find(m => m.id === aiMode)!.icon
                        return <Icon className="w-4 h-4 text-white" />
                      })()}
                    </motion.div>
                  )}
                </div>
                <span className="text-xs text-white/80 capitalize bg-white/10 px-2 py-1 rounded-full">
                  {aiMode}
                </span>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="px-4 py-3 bg-gray-750 border-b border-gray-700">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {AI_MODES.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleModeChange(mode.id as AIMode)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        aiMode === mode.id
                          ? `bg-${mode.color}-500 text-white`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {mode.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-4 rounded-2xl border border-purple-400/30">
                    <div className="flex items-center gap-3">
                      {/* Cute Avatar */}
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-2xl"
                      >
                        🧜🏻‍♀️
                      </motion.div>
                      {/* Typing Dots */}
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <span className="text-xs text-purple-200">your-Raa is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 p-2 rounded-full transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
