import express from 'express'
import { searchService } from '../services/searchService.js'
import { aiService } from '../services/aiService.js'
import { knowledgeGraphService } from '../services/knowledgeGraphService.js'
import { cacheService } from '../services/cacheService.js'
import { embeddingService } from '../services/embeddingService.js'
import { trieService } from '../services/trieService.js'
import { utilityService } from '../services/utilityService.js'

const router = express.Router()

// Autocomplete endpoint - O(k + n)
router.get('/autocomplete', async (req, res) => {
  try {
    const { q: query } = req.query
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] })
    }

    const suggestions = trieService.getSuggestions(query, 10)
    res.json({ suggestions })
  } catch (error) {
    console.error('Autocomplete error:', error)
    res.json({ suggestions: [] })
  }
})

router.get('/', async (req, res) => {
  const startTime = Date.now()
  
  try {
    const { q: query } = req.query

    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' })
    }

    console.log(`🔍 Searching for: ${query}`)

    // INSTANT UTILITY RESPONSES - Check BEFORE API calls
    const utilityResult = await utilityService.handleUtilityQuery(query)
    
    if (utilityResult && !utilityResult.needsSearch) {
      console.log(`⚡ Instant answer: ${utilityResult.type}`)
      const duration = Date.now() - startTime
      
      return res.json({
        query,
        answerBox: {
          title: utilityResult.answer,
          subtitle: utilityResult.type,
          description: utilityResult.answer,
          source: utilityResult.source,
          sourceUrl: '#',
          image: null
        },
        results: [],
        aiSummary: {
          text: utilityResult.answer,
          keyPoints: [],
          relatedTopics: [],
          confidence: 100
        },
        relatedQuestions: [],
        knowledgeGraph: { nodes: [], links: [] },
        trends: [],
        image: null,
        timestamp: new Date().toISOString(),
        processingTime: duration,
        isUtility: true
      })
    }

    // Check cache - O(1) lookup
    const cacheKey = `search:${query.toLowerCase()}`
    const cached = cacheService.get(cacheKey)
    
    if (cached) {
      const duration = Date.now() - startTime
      console.log(`⚡ Served from cache in ${duration}ms`)
      return res.json(cached)
    }

    // OLD CODE BELOW - Remove the manual date/time checks
    const userQuery = query.toLowerCase()
    
    // DATE REQUEST (OLD - REMOVE THIS)
    if (
      false && // Disabled - using utilityService instead
      (userQuery.includes("today") && userQuery.includes("date")) ||
      userQuery.includes("current date") ||
      userQuery.includes("date kya") ||
      userQuery === "date" ||
      userQuery === "today's date" ||
      userQuery === "what is today's date"
    ) {
      const currentDate = new Date().toLocaleDateString("en-GB", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const shortDate = new Date().toLocaleDateString("en-GB")
      
      console.log(`⚡ Instant date response in ${Date.now() - startTime}ms`)
      
      return res.json({
        query,
        answerBox: {
          title: shortDate,
          subtitle: "Today's Date",
          description: `Today is ${currentDate}.`,
          source: "System",
          sourceUrl: "#",
          image: null
        },
        results: [{
          id: '1',
          title: `Today's Date: ${shortDate}`,
          url: '#',
          snippet: `Current date is ${currentDate}`,
          source: 'system'
        }],
        aiSummary: {
          text: `Today's date is ${currentDate}.`,
          keyPoints: [
            `Date: ${shortDate}`,
            `Day: ${new Date().toLocaleDateString("en-US", { weekday: 'long' })}`,
            `Month: ${new Date().toLocaleDateString("en-US", { month: 'long' })}`,
            `Year: ${new Date().getFullYear()}`,
            `Week: Week ${Math.ceil((new Date().getDate()) / 7)} of the month`,
            `Quarter: Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
            `Day of year: Day ${Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)}`,
            `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            `UTC offset: ${new Date().getTimezoneOffset() / -60} hours`,
            `Timestamp: ${Date.now()}`
          ],
          relatedTopics: ['Current Time', 'Calendar', 'World Clock'],
          confidence: 100
        },
        relatedQuestions: [
          { question: "What time is it?", answer: "The current time can be checked using the time query." },
          { question: "What day is it?", answer: `Today is ${new Date().toLocaleDateString("en-US", { weekday: 'long' })}.` },
          { question: "What month is it?", answer: `Current month is ${new Date().toLocaleDateString("en-US", { month: 'long' })}.` }
        ],
        knowledgeGraph: {
          nodes: [
            { id: 'date', label: 'Today', type: 'main' },
            { id: 'day', label: new Date().toLocaleDateString("en-US", { weekday: 'long' }), type: 'concept' },
            { id: 'month', label: new Date().toLocaleDateString("en-US", { month: 'long' }), type: 'concept' }
          ],
          links: [
            { source: 'date', target: 'day', relation: 'is' },
            { source: 'date', target: 'month', relation: 'in' }
          ]
        },
        trends: [],
        image: null,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      })
    }

    // TIME REQUEST
    if (
      userQuery.includes("time") ||
      userQuery.includes("current time") ||
      userQuery.includes("time kya") ||
      userQuery === "what time is it" ||
      userQuery.includes("what's the time")
    ) {
      const currentTime = new Date().toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      })
      const time24 = new Date().toLocaleTimeString("en-GB", { 
        hour: "2-digit", 
        minute: "2-digit",
        second: "2-digit"
      })
      
      console.log(`⚡ Instant time response in ${Date.now() - startTime}ms`)
      
      return res.json({
        query,
        answerBox: {
          title: currentTime,
          subtitle: "Current Time",
          description: `The current time is ${currentTime} (${time24} in 24-hour format).`,
          source: "System",
          sourceUrl: "#",
          image: null
        },
        results: [{
          id: '1',
          title: `Current Time: ${currentTime}`,
          url: '#',
          snippet: `The time right now is ${currentTime}`,
          source: 'system'
        }],
        aiSummary: {
          text: `The current time is ${currentTime}.`,
          keyPoints: [
            `12-hour format: ${currentTime}`,
            `24-hour format: ${time24}`,
            `Hour: ${new Date().getHours()}`,
            `Minute: ${new Date().getMinutes()}`,
            `Second: ${new Date().getSeconds()}`,
            `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            `UTC time: ${new Date().toUTCString()}`,
            `Unix timestamp: ${Math.floor(Date.now() / 1000)}`,
            `Milliseconds: ${Date.now()}`,
            `ISO format: ${new Date().toISOString()}`
          ],
          relatedTopics: ['Current Date', 'World Clock', 'Time Zones'],
          confidence: 100
        },
        relatedQuestions: [
          { question: "What date is it?", answer: "The current date can be checked using the date query." },
          { question: "What timezone am I in?", answer: `You are in ${Intl.DateTimeFormat().resolvedOptions().timeZone} timezone.` },
          { question: "What is UTC time?", answer: `UTC time is ${new Date().toUTCString()}.` }
        ],
        knowledgeGraph: {
          nodes: [
            { id: 'time', label: 'Now', type: 'main' },
            { id: 'hour', label: `${new Date().getHours()}h`, type: 'concept' },
            { id: 'minute', label: `${new Date().getMinutes()}m`, type: 'concept' }
          ],
          links: [
            { source: 'time', target: 'hour', relation: 'hour' },
            { source: 'time', target: 'minute', relation: 'minute' }
          ]
        },
        trends: [],
        image: null,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      })
    }

    // Cache already checked above - no need to redeclare
    
    if (cached) {
      const duration = Date.now() - startTime
      console.log(`⚡ Served from cache in ${duration}ms`)
      return res.json(cached)
    }

    // Step 1: Fetch real search results first
    const results = await searchService.search(query)
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No search results found' })
    }

    console.log(`✅ Found ${results.length} search results`)

    // Add query to trie for autocomplete
    trieService.addQuery(query)

    // Step 2: Semantic ranking (optional - can be toggled)
    // Uncomment to enable semantic search with MiniLM
    // const rankedResults = await embeddingService.semanticRank(query, results)
    const rankedResults = results // Use original ranking for speed

    // Step 3: Optimized parallel processing
    // Split into critical (fast) and non-critical (can fail) operations
    
    // Critical operations - must succeed
    const [answerBoxData, aiSummary, trends, image] = await Promise.all([
      aiService.generateAnswerBox(query, results),
      aiService.generateRAGAnswer(query, results),
      searchService.getTrends(query),
      searchService.getImage(query)
    ])
    
    // Non-critical operations - can fail gracefully
    const [relatedQuestions, knowledgeGraph, cardsView, slidesView] = await Promise.allSettled([
      aiService.generateRelatedQuestions(query, results),
      searchService.getKnowledgeGraph(query),
      aiService.generateCardsView(query, results),
      aiService.generateSlidesView(query, results)
    ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : null))

    // Add image to answer box
    const answerBox = {
      ...answerBoxData,
      image
    }

    const duration = Date.now() - startTime
    console.log(`✅ RAG processing completed in ${duration}ms`)
    console.log(`📊 Generated ${aiSummary.keyPoints?.length || 0} key points from search results`)
    console.log(`🎨 Knowledge Graph data:`, JSON.stringify(knowledgeGraph, null, 2))

    const response = {
      query,
      answerBox,
      results: rankedResults,
      aiSummary,
      relatedQuestions,
      knowledgeGraph,
      cardsView,
      slidesView,
      trends,
      image,
      timestamp: new Date().toISOString(),
      processingTime: duration
    }

    // Cache the response - O(1) insertion
    cacheService.set(cacheKey, response)

    res.json(response)
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: 'Search failed', message: error.message })
  }
})

export default router
