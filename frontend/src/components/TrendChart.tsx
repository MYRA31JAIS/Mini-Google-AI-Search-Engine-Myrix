import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data?: Array<{ date: string; value: number }>
  isLoading: boolean
}

export default function TrendChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse border border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-48 bg-gray-700 rounded"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700"
    >
      <h3 className="text-lg font-semibold mb-4 text-white">Trend Analysis</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4285f4" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
