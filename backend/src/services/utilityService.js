import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

console.log('🌤️ OpenWeather API:', OPENWEATHER_API_KEY ? 'Configured' : 'Not configured')

// Utility service for instant answers (date, time, calculator, converter, weather)
export const utilityService = {
  // Check if query can be answered instantly
  handleUtilityQuery: async (query) => {
    const q = query.toLowerCase().trim()

    // 1. DATE - Only match specific date queries, not general "today" queries
    const dateKeywords = ['what is the date', 'what date', 'todays date', "today's date", 'current date', 'date today']
    const isDateQuery = dateKeywords.some(keyword => q.includes(keyword)) || 
                        (q === 'date' || q === 'today' || q === 'today?')
    
    if (isDateQuery) {
      const date = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      return {
        answer: `Today's date is ${date}`,
        source: 'System Clock',
        type: 'utility'
      }
    }

    // 2. TIME
    if (q.includes('time') && !q.includes('timezone')) {
      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
      return {
        answer: `The current time is ${time}`,
        source: 'System Clock',
        type: 'utility'
      }
    }

    // 3. CALCULATOR
    if (q.startsWith('calculate') || q.startsWith('calc') || q.match(/^[\d+\-*/().\s]+$/)) {
      try {
        const expression = q.replace(/calculate|calc/gi, '').trim()
        // Safe eval alternative
        const result = Function(`'use strict'; return (${expression})`)()
        return {
          answer: `${expression} = ${result}`,
          source: 'Calculator',
          type: 'utility'
        }
      } catch {
        return {
          answer: 'Invalid mathematical expression',
          source: 'Calculator',
          type: 'utility'
        }
      }
    }

    // 4. UNIT CONVERTER - Weight
    if (q.includes('kg to g') || q.includes('kg to gram')) {
      const num = parseFloat(q)
      if (!isNaN(num)) {
        return {
          answer: `${num} kg = ${num * 1000} grams`,
          source: 'Unit Converter',
          type: 'utility'
        }
      }
    }

    if (q.includes('g to kg') || q.includes('gram to kg')) {
      const num = parseFloat(q)
      if (!isNaN(num)) {
        return {
          answer: `${num} g = ${num / 1000} kg`,
          source: 'Unit Converter',
          type: 'utility'
        }
      }
    }

    // 5. UNIT CONVERTER - Length
    if (q.includes('cm to m')) {
      const num = parseFloat(q)
      if (!isNaN(num)) {
        return {
          answer: `${num} cm = ${num / 100} meters`,
          source: 'Unit Converter',
          type: 'utility'
        }
      }
    }

    if (q.includes('m to cm') || q.includes('meter to cm')) {
      const num = parseFloat(q)
      if (!isNaN(num)) {
        return {
          answer: `${num} m = ${num * 100} cm`,
          source: 'Unit Converter',
          type: 'utility'
        }
      }
    }

    if (q.includes('km to m')) {
      const num = parseFloat(q)
      if (!isNaN(num)) {
        return {
          answer: `${num} km = ${num * 1000} meters`,
          source: 'Unit Converter',
          type: 'utility'
        }
      }
    }

    // 6. UNIT CONVERTER - Temperature
    if (q.includes('c to f') || q.includes('celsius to fahrenheit')) {
      const num = parseFloat(q)
      if (!isNaN(num)) {
        const fahrenheit = ((num * 9) / 5 + 32).toFixed(2)
        return {
          answer: `${num}°C = ${fahrenheit}°F`,
          source: 'Unit Converter',
          type: 'utility'
        }
      }
    }

    if (q.includes('f to c') || q.includes('fahrenheit to celsius')) {
      const num = parseFloat(q)
      if (!isNaN(num)) {
        const celsius = (((num - 32) * 5) / 9).toFixed(2)
        return {
          answer: `${num}°F = ${celsius}°C`,
          source: 'Unit Converter',
          type: 'utility'
        }
      }
    }

    // 7. SIMPLE DEFINITIONS
    if (q.startsWith('meaning of') || q.startsWith('define')) {
      const word = q.replace(/meaning of|define/gi, '').trim()
      return {
        answer: `Looking up definition of "${word}"...`,
        source: 'Dictionary',
        type: 'definition',
        needsSearch: true // Will trigger web search
      }
    }

    // 8. WEATHER (OpenWeather API)
    if (q.includes('weather')) {
      // Extract city name
      let city = q.replace(/weather|in|at|for/gi, '').trim()
      
      // Default to a major city if no city specified
      if (!city || city.length < 2) {
        city = 'Delhi' // Default city
      }

      if (OPENWEATHER_API_KEY) {
        try {
          const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              q: city,
              appid: OPENWEATHER_API_KEY,
              units: 'metric' // Celsius
            }
          })

          const data = response.data
          const temp = Math.round(data.main.temp)
          const feelsLike = Math.round(data.main.feels_like)
          const description = data.weather[0].description
          const humidity = data.main.humidity
          const windSpeed = data.wind.speed

          return {
            answer: `Weather in ${data.name}:

- ${description}

- Temperature: ${temp}°C

- Feels like: ${feelsLike}°C

- Humidity: ${humidity}%

- Wind Speed: ${windSpeed} m/s`,
            source: 'OpenWeather',
            type: 'weather',
            weatherData: {
              city: data.name,
              country: data.sys.country,
              temp,
              feelsLike,
              description,
              humidity,
              windSpeed,
              icon: data.weather[0].icon
            }
          }
        } catch (error) {
          return {
            answer: `Could not find weather for "${city}". Try another city name.`,
            source: 'OpenWeather',
            type: 'weather'
          }
        }
      } else {
        return {
          answer: 'Weather service not configured. Add OpenWeather API key.',
          source: 'Weather Service',
          type: 'utility'
        }
      }
    }

    // No utility match - return null to trigger web search
    return null
  }
}
