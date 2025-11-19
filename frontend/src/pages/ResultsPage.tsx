import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import SearchHeader from '../components/SearchHeader'
import SearchResults from '../components/SearchResults'
import AnswerBox from '../components/AnswerBox'
import AISummary from '../components/AISummary'
import PeopleAlsoAsk from '../components/PeopleAlsoAsk'
import KnowledgeGraph from '../components/KnowledgeGraph'
import TrendChart from '../components/TrendChart'
import TodayInfoCard from '../components/TodayInfoCard'
import ViewTabs from '../components/ViewTabs'
import CardsView from '../components/CardsView'
import SlidesView from '../components/SlidesView'
import ChatBot from '../components/ChatBot'
import { searchAPI } from '../services/api'
import { useMoodBackground } from '../hooks/useMoodBackground'

type ViewType = 'standard' | 'cards' | 'slides'

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const moodTheme = useMoodBackground(query)
  const [activeView, setActiveView] = useState<ViewType>('standard')
  
  // Check if query is about "today"
  const isTodayQuery = query.toLowerCase().trim() === 'today' || 
                       query.toLowerCase().includes('today') && 
                       (query.toLowerCase().includes('date') || 
                        query.toLowerCase().includes('time') || 
                        query.toLowerCase().includes('weather'))

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAPI.search(query),
    enabled: !!query
  })

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Mood Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={moodTheme.gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`fixed inset-0 bg-gradient-to-br ${moodTheme.gradient} -z-10`}
        />
      </AnimatePresence>

      {/* Overlay for better content contrast */}
      <div className="fixed inset-0 bg-black/40 -z-10" />
      <SearchHeader initialQuery={query} showBackButton={true} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Tabs */}
            <ViewTabs activeView={activeView} onViewChange={setActiveView} />
            
            {/* Standard View */}
            {activeView === 'standard' && (
              <>
                {/* Google-style Answer Box */}
                <AnswerBox answer={data?.answerBox} isLoading={isLoading} />
                
                {/* People Also Ask */}
                <PeopleAlsoAsk questions={data?.relatedQuestions} isLoading={isLoading} />
                
                {/* AI Summary with 10 Key Points */}
                <AISummary 
                  summary={data?.aiSummary} 
                  image={data?.image}
                  isLoading={isLoading} 
                />
                
                {/* Search Results */}
                <SearchResults results={data?.results} isLoading={isLoading} />
              </>
            )}
            
            {/* Cards View */}
            {activeView === 'cards' && (
              <CardsView cards={data?.cardsView} isLoading={isLoading} />
            )}
            
            {/* Slides View */}
            {activeView === 'slides' && (
              <SlidesView slides={data?.slidesView} isLoading={isLoading} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Show Today Info Card for "today" queries */}
            {isTodayQuery && <TodayInfoCard />}
            
            <KnowledgeGraph data={data?.knowledgeGraph} isLoading={isLoading} />
            <TrendChart data={data?.trends} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Floating AI Chatbot */}
      <ChatBot />
    </div>
  )
}
