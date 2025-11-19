import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  title: string
  content: string[]
}

interface Props {
  slides?: Slide[]
  isLoading: boolean
}

export default function SlidesView({ slides, isLoading }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-12 animate-pulse border border-gray-700">
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-700 rounded w-5/6"></div>
          <div className="h-6 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No slides available
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]

  return (
    <div className="relative">
      {/* Slide Container */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 min-h-[400px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Slide Number */}
            <div className="text-sm text-gray-400 mb-4">
              Slide {currentSlide + 1} of {slides.length}
            </div>

            {/* Slide Title */}
            <h2 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {slide.title}
            </h2>

            {/* Slide Content */}
            <div className="space-y-4">
              {slide.content.map((line, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-xl text-gray-300 leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-700 text-white transition-all w-full sm:w-auto justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? 'bg-blue-500 w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-700 text-white transition-all w-full sm:w-auto justify-center"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
