import { motion } from 'framer-motion'
import { List, LayoutGrid, Presentation } from 'lucide-react'

type ViewType = 'standard' | 'cards' | 'slides'

interface Props {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

export default function ViewTabs({ activeView, onViewChange }: Props) {
  const tabs = [
    { id: 'standard' as ViewType, label: 'Standard', icon: List },
    { id: 'cards' as ViewType, label: 'Cards', icon: LayoutGrid },
    { id: 'slides' as ViewType, label: 'Slides', icon: Presentation }
  ]

  return (
    <div className="flex gap-2 bg-gray-800/50 backdrop-blur-sm p-2 rounded-xl border border-gray-700/50 mb-6 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeView === tab.id
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all relative whitespace-nowrap ${
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
