import { motion } from 'framer-motion'
import { Calendar, Clock, Cloud, MapPin, Thermometer, Droplets, Wind } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface WeatherData {
  temp: number
  feels_like: number
  humidity: number
  description: string
  icon: string
  wind_speed: number
  city: string
}

export default function TodayInfoCard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData | null>(null)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch weather on mount
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              const response = await axios.get('/api/search/weather', {
                params: { lat: latitude, lon: longitude }
              })
              setWeather(response.data)
            },
            () => {
              // Fallback to default city
              fetchDefaultWeather()
            }
          )
        } else {
          fetchDefaultWeather()
        }
      } catch (error) {
        console.error('Weather fetch error:', error)
      }
    }

    const fetchDefaultWeather = async () => {
      try {
        const response = await axios.get('/api/search/weather', {
          params: { city: 'Delhi' }
        })
        setWeather(response.data)
      } catch (error) {
        console.error('Default weather fetch error:', error)
      }
    }

    fetchWeather()
  }, [])

  const date = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const time = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50/10 via-purple-50/10 to-pink-50/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Today's Info ✨
        </h3>
      </div>

      {/* Date Card */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-2xl p-4 border border-indigo-300/20">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-indigo-200/60 mb-1">Date</p>
            <p className="text-white font-semibold text-sm">{date}</p>
          </div>
        </div>
      </motion.div>

      {/* Time Card */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl p-4 border border-purple-300/20">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-purple-200/60 mb-1">Current Time</p>
            <p className="text-white font-bold text-lg">{time}</p>
          </div>
        </div>
      </motion.div>

      {/* Weather Card */}
      {weather && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-2xl p-4 border border-cyan-300/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-cyan-200/60">Weather</p>
                <p className="text-white font-semibold capitalize">{weather.description}</p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Temperature</p>
                  <p className="text-white text-sm font-semibold">{Math.round(weather.temp)}°C</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Humidity</p>
                  <p className="text-white text-sm font-semibold">{weather.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <Wind className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Wind</p>
                  <p className="text-white text-sm font-semibold">{weather.wind_speed} m/s</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <MapPin className="w-4 h-4 text-pink-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Location</p>
                  <p className="text-white text-sm font-semibold">{weather.city}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading weather */}
      {!weather && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-2xl p-4 border border-cyan-300/20 animate-pulse"
        >
          <div className="h-16 bg-cyan-400/10 rounded-xl"></div>
        </motion.div>
      )}
    </motion.div>
  )
}
