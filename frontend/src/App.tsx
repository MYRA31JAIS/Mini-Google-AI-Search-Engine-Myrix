import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MoodProvider } from './contexts/MoodContext'
import SearchPage from './pages/SearchPage'
import ResultsPage from './pages/ResultsPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MoodProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/search" element={<ResultsPage />} />
          </Routes>
        </BrowserRouter>
      </MoodProvider>
    </QueryClientProvider>
  )
}

export default App
