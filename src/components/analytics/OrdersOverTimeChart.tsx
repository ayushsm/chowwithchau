import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Order } from '../../lib/supabase'
import './OrderStatusBreakdown.css'

interface OrdersOverTimeChartProps {
  orders: Order[]
}

interface DailyOrderData {
  date: string
  orders: number
}

function OrdersOverTimeChart({ orders }: OrdersOverTimeChartProps) {
  const prepareTimeSeriesData = (orders: Order[]): DailyOrderData[] => {
    // Get last 30 days
    const last30Days: Date[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      last30Days.push(date)
    }

    // Count orders by date
    const ordersByDate: { [key: string]: number } = {}
    orders.forEach((order) => {
      if (order.created_at) {
        const orderDate = new Date(order.created_at)
        orderDate.setHours(0, 0, 0, 0)
        const dateKey = orderDate.toISOString().split('T')[0]
        ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1
      }
    })

    // Map to chart data
    return last30Days.map((date) => {
      const dateKey = date.toISOString().split('T')[0]
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: ordersByDate[dateKey] || 0,
      }
    })
  }

  const timeSeriesData = prepareTimeSeriesData(orders)

  if (orders.length === 0) {
    return (
      <div className="analytics-card">
        <h3>Orders Over Time (Last 30 Days)</h3>
        <div className="no-data">No orders yet</div>
      </div>
    )
  }

  return (
    <div className="analytics-card">
      <h3>Orders Over Time (Last 30 Days)</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#97947A" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#97947A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#97947A"
              fillOpacity={1}
              fill="url(#colorOrders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default OrdersOverTimeChart
