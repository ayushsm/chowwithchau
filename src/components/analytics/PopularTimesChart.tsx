import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Order } from '../../lib/supabase'
import './OrderStatusBreakdown.css'

interface PopularTimesChartProps {
  orders: Order[]
}

interface HourlyData {
  hour: string
  orders: number
}

function PopularTimesChart({ orders }: PopularTimesChartProps) {
  const analyzePopularTimes = (orders: Order[]): HourlyData[] => {
    const hourCounts = new Array(24).fill(0)

    orders.forEach((order) => {
      if (order.created_at) {
        const hour = new Date(order.created_at).getHours()
        hourCounts[hour]++
      }
    })

    const formatHour = (hour: number): string => {
      if (hour === 0) return '12 AM'
      if (hour === 12) return '12 PM'
      if (hour < 12) return `${hour} AM`
      return `${hour - 12} PM`
    }

    return hourCounts
      .map((count, hour) => ({
        hour: formatHour(hour),
        orders: count,
      }))
      .filter((d) => d.orders > 0)
  }

  const hourlyData = analyzePopularTimes(orders)

  if (orders.length === 0) {
    return (
      <div className="analytics-card">
        <h3>Popular Ordering Times</h3>
        <div className="no-data">No orders yet</div>
      </div>
    )
  }

  if (hourlyData.length === 0) {
    return (
      <div className="analytics-card">
        <h3>Popular Ordering Times</h3>
        <div className="no-data">Not enough data to display</div>
      </div>
    )
  }

  return (
    <div className="analytics-card">
      <h3>Popular Ordering Times</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="orders" fill="#D0A5A1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PopularTimesChart
