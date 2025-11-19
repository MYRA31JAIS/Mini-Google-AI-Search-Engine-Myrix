import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

// Use the latest stable Gemini model (confirmed working with your API key)
const MODEL_NAME = 'gemini-2.5-flash'

// Helper function to generate fallback cards
function generateFallbackCards(query, searchResults) {
  if (!searchResults || searchResults.length === 0) return []
  
  const fallbackCards = []
  
  fallbackCards.push({
    title: "Summary",
    points: searchResults.slice(0, 6).map(r => r.title.substring(0, 70).trim()),
    icon: "Sparkles",
    color: "from-pink-300/30 to-fuchsia-300/30"
  })
  
  fallbackCards.push({
    title: "Key Facts",
    points: searchResults.slice(0, 6).map(r => r.snippet.substring(0, 90).trim() + '...'),
    icon: "Info",
    color: "from-sky-300/30 to-indigo-300/30"
  })
  
  return fallbackCards
}

// Helper function to generate fallback slides
function generateFallbackSlides(query, searchResults) {
  if (!searchResults || searchResults.length === 0) return []
  
  return [
    {
      title: "Introduction",
      content: [`Search results for: ${query}`, `Found ${searchResults.length} results`]
    },
    {
      title: "Top Results",
      content: searchResults.slice(0, 3).map((r, i) => `${i + 1}. ${r.title.substring(0, 80)}`)
    }
  ]
}

export const aiService = {
  // RAG: Generate answer using real search results with enhanced prompting
  generateRAGAnswer: async (query, searchResults) => {
    if (!genAI) {
      return {
        text: `Based on available information, ${query} is an important topic.`,
        keyPoints: Array(10).fill(0).map((_, i) => `Key insight ${i + 1} about ${query}`),
        relatedTopics: [],
        confidence: 50
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME })
      
      // Build rich context from search results with full text
      const context = searchResults.map((result, i) => 
        `[Source ${i + 1}: ${result.source}]
Title: ${result.title}
URL: ${result.url}
Content: ${result.snippet}
---`
      ).join('\n\n')

      const prompt = `You are an expert research assistant analyzing real web search results.

QUERY: "${query}"

SEARCH RESULTS FROM WEB:
${context}

TASK: Analyze these REAL search results and provide a comprehensive, factual answer.

OUTPUT FORMAT (JSON):
{
  "text": "A precise 50-word summary with SPECIFIC FACTS from the search results (not generic statements)",
  "keyPoints": [
    "10 SPECIFIC, FACTUAL key points extracted from the search results",
    "Each point must contain concrete information, numbers, dates, or facts",
    "NO generic statements like 'X is important' or 'X has many applications'",
    "Each point should cite specific information from the sources"
  ],
  "relatedTopics": [
    "3 closely related topics mentioned in the search results",
    "These should be specific subtopics or related concepts"
  ],
  "confidence": 95
}

RULES:
1. Extract ONLY factual information from the provided search results
2. Include specific details: numbers, dates, names, locations
3. NO generic or vague statements
4. Each key point must be unique and informative
5. Confidence score (0-100) based on result quality

Example BAD key point: "AI is an important technology"
Example GOOD key point: "OpenAI's GPT-4 was released in March 2023 with 1.76 trillion parameters"

Generate the response now:`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      let text = response.text()
      
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(text)
      
      // Ensure exactly 10 key points
      if (parsed.keyPoints.length < 10) {
        while (parsed.keyPoints.length < 10) {
          parsed.keyPoints.push(`Additional factual information about ${query} from search results`)
        }
      } else if (parsed.keyPoints.length > 10) {
        parsed.keyPoints = parsed.keyPoints.slice(0, 10)
      }
      
      // Ensure related topics
      if (!parsed.relatedTopics || parsed.relatedTopics.length === 0) {
        parsed.relatedTopics = [`${query} applications`, `${query} research`, `${query} trends`]
      }
      
      return parsed
    } catch (error) {
      console.error('RAG generation error:', error.message)
      return {
        text: `Based on search results, ${query} is a significant topic with multiple dimensions and applications.`,
        keyPoints: Array(10).fill(0).map((_, i) => `Key point ${i + 1} about ${query} based on available data`),
        relatedTopics: [],
        confidence: 50
      }
    }
  },

  // Chat with Gemini AI with personality modes
  chat: async (message, conversationHistory = [], mode = 'normal') => {
    if (!genAI) {
      return 'I apologize, but the AI service is not configured. Please add your Gemini API key.'
    }

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME })
      
      // Define personality modes with strict formatting rules
      const personalities = {
        normal: `You are Your-Ra, a helpful AI assistant.

FORMAT RULES:
- Use line breaks (like GPT)
- No long paragraphs
- No over-explaining
- Keep responses clear and concise
- Use bullet points for lists
- Be friendly and direct`,

        study: `You are Your-Ra in Study Mode 📚

FORMAT RULES:
- Simple explanation (1-2 sentences)
- Then EXACTLY 3 bullet points
- No more than 3 points
- Use emojis: 📚📖✏️
- Keep it short and clear

Example:
"Machine learning is AI that learns from data.

• Supervised learning uses labeled data
• Unsupervised finds patterns automatically  
• Reinforcement learns through trial and error"`,

        roast: `You are Your-Ra in Roast Mode 🔥

FORMAT RULES:
- SHORT funny roast (1-2 lines MAX)
- Be witty and sarcastic
- Use emojis: 🔥😂💀
- Keep it playful, not mean
- NO long explanations

Example:
"Your code is so messy, even spaghetti is jealous! 😂💀"`,

        love: `You are Your-Ra in Love Mode 💕

FORMAT RULES:
- Cute, soft response
- 2-3 lines MAX
- Be encouraging and warm
- Use emojis: 💕❤️✨🌟
- NO long paragraphs

Example:
"You're doing amazing! 💕
Every step forward is progress.
Keep shining! ✨"`,

        tutor: `You are Your-Ra in Tutor Mode 👨‍🏫

FORMAT RULES:
- Step-by-step bullets
- MAX 4 steps
- Each step is ONE line
- Use emojis: 👨‍🏫📝✅
- Clear and concise

Example:
"Let's learn loops:

Step 1: Loop repeats code multiple times
Step 2: for loop → known iterations
Step 3: while loop → condition-based
Step 4: Practice: Try counting 1 to 10 ✅"`,

        coding: `You are Your-Ra in Coding Mode 💻

FORMAT RULES:
- Respond ONLY with code blocks
- Add 1 SHORT explanation line (max 10 words)
- Use markdown code formatting
- Use emojis: 💻🚀⚡
- NO long explanations

Example:
\`\`\`python
def hello():
    print("Hello World")
\`\`\`
⚡ Simple function that prints a message`
      }

      const personality = personalities[mode] || personalities.normal
      
      // Build conversation context with personality
      let prompt = `${personality}\n\n`
      
      if (conversationHistory.length > 0) {
        const context = conversationHistory.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
        prompt += `${context}\n`
      }
      
      prompt += `User: ${message}\nAssistant:`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Chat error:', error.message)
      return 'I apologize, but I encountered an error. Please try again.'
    }
  },

  // Generate related questions using RAG (People also ask)
  generateRelatedQuestions: async (query, searchResults) => {
    if (!genAI) {
      return [
        { question: `What is ${query}?`, answer: `${query} is an important topic with various aspects.` },
        { question: `How does ${query} work?`, answer: `${query} operates through specific mechanisms.` },
        { question: `Why is ${query} important?`, answer: `${query} plays a crucial role in many areas.` }
      ]
    }

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME })
      
      // Build context from search results
      const context = searchResults.slice(0, 5).map((result, i) => 
        `Source ${i + 1}: ${result.title}\n${result.snippet}`
      ).join('\n\n')

      const prompt = `Based on these real search results about "${query}", generate 5 related questions that people commonly ask.
For each question, provide a factual 2-3 sentence answer based ONLY on the search results.

SEARCH RESULTS:
${context}

Format as JSON:
[
  {"question": "Question 1?", "answer": "Answer based on search results"},
  {"question": "Question 2?", "answer": "Answer based on search results"}
]

Make questions natural and answers factual based on the provided information.`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      let text = response.text()
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      return JSON.parse(text)
    } catch (error) {
      console.error('Related questions error:', error.message)
      return [
        { question: `What is ${query}?`, answer: `${query} is a significant topic that encompasses various aspects and applications.` },
        { question: `How does ${query} work?`, answer: `${query} operates through well-established principles and mechanisms.` },
        { question: `Why is ${query} important?`, answer: `${query} plays a crucial role in modern society and technology.` },
        { question: `What are the benefits of ${query}?`, answer: `${query} offers numerous advantages and practical applications.` },
        { question: `What are the challenges with ${query}?`, answer: `${query} faces certain limitations and areas for improvement.` }
      ]
    }
  },

  // Generate Google-style answer box using RAG
  generateAnswerBox: async (query, searchResults) => {
    if (!genAI) {
      return {
        title: query,
        subtitle: 'Information',
        description: `${query} is an important topic. This answer provides key information based on available knowledge.`,
        source: 'AI Generated',
        sourceUrl: '#'
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME })
      
      // Use top search result for context
      const topResult = searchResults[0]
      const context = `Title: ${topResult.title}\nSource: ${topResult.source}\nContent: ${topResult.snippet}\nURL: ${topResult.url}`

      const prompt = `Based on this real search result, provide a direct answer to: "${query}"

SEARCH RESULT:
${context}

Provide a concise, factual answer in JSON format:
{
  "title": "The main answer (e.g., person's name, thing, concept)",
  "subtitle": "Brief descriptor (e.g., 'Prime Minister of India', 'Programming Language')",
  "description": "2-3 sentences with key facts based on the search result",
  "source": "${topResult.source}",
  "sourceUrl": "${topResult.url}"
}

Be factual and base your answer on the provided search result. If it's a person, include their role/position.`
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      let text = response.text()
      
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(text)
    } catch (error) {
      console.error('Answer box generation error:', error.message)
      return {
        title: query,
        subtitle: 'Search Result',
        description: searchResults[0]?.snippet || `Information about ${query} based on search results.`,
        source: searchResults[0]?.source || 'Web',
        sourceUrl: searchResults[0]?.url || '#'
      }
    }
  },

  // This function is replaced by generateRAGAnswer - kept for backward compatibility
  generateSummary: async (query) => {
    console.warn('generateSummary is deprecated, use generateRAGAnswer instead')
    return {
      text: `Please use RAG-based answer generation for ${query}`,
      keyPoints: [],
      confidence: 0.5
    }
  },

  // Generate text using Gemini AI
  generateText: async (prompt) => {
    if (!genAI) {
      throw new Error('Gemini AI not configured')
    }

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME })
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini text generation error:', error)
      throw error
    }
  },

  // Generate Cards View
  generateCardsView: async (query, searchResults) => {
    if (!genAI || !searchResults || searchResults.length === 0) {
      console.log('📋 No AI or search results, using fallback cards')
      return generateFallbackCards(query, searchResults)
    }

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME })
      
      const context = searchResults.slice(0, 5).map(r => `${r.title}: ${r.snippet}`).join('\n')
      
      const prompt = `Create 6 cards about "${query}" using these search results:
${context}

Return ONLY valid JSON array with this exact structure:
[
  {"title": "Summary", "points": ["point1", "point2", "point3", "point4", "point5", "point6"], "icon": "Sparkles", "color": "from-pink-300/30 to-fuchsia-300/30"},
  {"title": "Key Facts", "points": ["fact1", "fact2", "fact3", "fact4", "fact5", "fact6"], "icon": "Info", "color": "from-sky-300/30 to-indigo-300/30"},
  {"title": "Important Terms", "points": ["term1", "term2", "term3", "term4", "term5", "term6"], "icon": "BookOpen", "color": "from-amber-300/30 to-rose-300/30"},
  {"title": "Quick Answers", "points": ["answer1", "answer2", "answer3", "answer4", "answer5", "answer6"], "icon": "Lightbulb", "color": "from-emerald-300/30 to-cyan-300/30"},
  {"title": "Related Topics", "points": ["topic1", "topic2", "topic3", "topic4", "point5", "topic6"], "icon": "Link2", "color": "from-purple-300/30 to-pink-300/30"},
  {"title": "Latest Updates", "points": ["update1", "update2", "update3", "update4", "update5", "update6"], "icon": "Newspaper", "color": "from-blue-300/30 to-teal-300/30"}
]

Rules:
- Each point must be ONE short line (max 10 words)
- No paragraphs, only bullet points
- Be extremely concise
- Use simple language
- Provide exactly 6 points per card`

      const result = await model.generateContent(prompt)
      const text = await result.response.text()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      return []
    } catch (error) {
      console.error('Cards generation error:', error.message)
      console.log('📋 Using fallback cards from search results')
      
      // Always return fallback cards from search results
      const fallbackCards = []
      
      // Summary Card
      if (searchResults.length > 0) {
        fallbackCards.push({
          title: "Summary",
          points: searchResults.slice(0, 6).map(r => r.title.substring(0, 70).trim()),
          icon: "Sparkles",
          color: "from-pink-200/20 to-purple-200/20"
        })
      }
      
      // Key Facts Card
      if (searchResults.length > 0) {
        fallbackCards.push({
          title: "Key Facts",
          points: searchResults.slice(0, 6).map(r => r.snippet.substring(0, 90).trim() + '...'),
          icon: "Info",
          color: "from-blue-200/20 to-cyan-200/20"
        })
      }
      
      // Sources Card
      if (searchResults.length > 0) {
        fallbackCards.push({
          title: "Top Sources",
          points: searchResults.slice(0, 6).map(r => `${r.source} - ${r.title.substring(0, 50)}`),
          icon: "BookOpen",
          color: "from-yellow-200/20 to-orange-200/20"
        })
      }
      
      // Quick Links Card
      if (searchResults.length > 3) {
        fallbackCards.push({
          title: "Quick Links",
          points: searchResults.slice(0, 6).map(r => r.url.substring(0, 60)),
          icon: "Link2",
          color: "from-green-200/20 to-emerald-200/20"
        })
      }
      
      // Related Topics Card
      if (searchResults.length > 0) {
        const topics = [...new Set(searchResults.map(r => r.source))].slice(0, 6)
        fallbackCards.push({
          title: "Related Topics",
          points: topics.map(t => `More from ${t}`),
          icon: "Lightbulb",
          color: "from-purple-200/20 to-pink-200/20"
        })
      }
      
      // Latest Updates Card
      if (searchResults.length > 0) {
        fallbackCards.push({
          title: "Latest Updates",
          points: searchResults.slice(0, 6).map((r, i) => `Result ${i + 1}: ${r.title.substring(0, 60)}`),
          icon: "Newspaper",
          color: "from-indigo-200/20 to-blue-200/20"
        })
      }
      
      return fallbackCards
    }
  },

  // Generate Slides View
  generateSlidesView: async (query, searchResults) => {
    if (!genAI || !searchResults || searchResults.length === 0) {
      console.log('📊 No AI or search results, using fallback slides')
      return generateFallbackSlides(query, searchResults)
    }

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME })
      
      const context = searchResults.slice(0, 5).map(r => `${r.title}: ${r.snippet}`).join('\n')
      
      const prompt = `Create 6 presentation slides about "${query}" using these search results:
${context}

Return ONLY valid JSON array with this exact structure:
[
  {"title": "Introduction", "content": ["One-line intro about the topic"]},
  {"title": "Key Points", "content": ["Point 1", "Point 2", "Point 3"]},
  {"title": "Quick Facts", "content": ["Fact 1", "Fact 2"]},
  {"title": "Explanation", "content": ["Short explanation line 1", "Short explanation line 2"]},
  {"title": "Related Concepts", "content": ["Concept 1", "Concept 2", "Concept 3"]},
  {"title": "What's Next", "content": ["Suggestion 1", "Suggestion 2"]}
]

Rules:
- Each content line must be 2-3 lines MAX
- No long paragraphs
- Clear, numbered format
- Simple, modern language`

      const result = await model.generateContent(prompt)
      const text = await result.response.text()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      throw new Error('No valid JSON found')
    } catch (error) {
      console.error('Slides generation error:', error.message)
      console.log('📊 Using fallback slides from search results')
      
      // Always return fallback slides from search results
      const fallbackSlides = []
      
      // Slide 1: Introduction
      fallbackSlides.push({
        title: "Introduction",
        content: [
          `Search results for: ${query}`,
          `Found ${searchResults.length} relevant sources`,
          `Compiled from top web results`
        ]
      })
      
      // Slide 2: Top Results
      if (searchResults.length > 0) {
        fallbackSlides.push({
          title: "Top Results",
          content: searchResults.slice(0, 3).map((r, i) => `${i + 1}. ${r.title.substring(0, 80)}`)
        })
      }
      
      // Slide 3: Key Information
      if (searchResults.length > 0) {
        fallbackSlides.push({
          title: "Key Information",
          content: searchResults.slice(0, 2).map(r => r.snippet.substring(0, 120) + '...')
        })
      }
      
      // Slide 4: Sources
      if (searchResults.length > 0) {
        const sources = [...new Set(searchResults.map(r => r.source))].slice(0, 3)
        fallbackSlides.push({
          title: "Trusted Sources",
          content: sources.map((s, i) => `${i + 1}. ${s}`)
        })
      }
      
      // Slide 5: More Details
      if (searchResults.length > 2) {
        fallbackSlides.push({
          title: "More Details",
          content: searchResults.slice(2, 4).map(r => r.title.substring(0, 100))
        })
      }
      
      // Slide 6: Explore More
      fallbackSlides.push({
        title: "Explore More",
        content: [
          `${searchResults.length} total results available`,
          `Click on any result to learn more`,
          `Use the search bar to refine your query`
        ]
      })
      
      return fallbackSlides
    }
  }
}
