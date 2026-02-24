import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Order } from '../../lib/supabase'
import './OrderStatusBreakdown.css'

interface OrderStatusBreakdownProps {
  orders: Order[]
}

interface StatusData {
  name: string
  value: number
  color: string
}

function OrderStatusBreakdown({ orders }: OrderStatusBreakdownProps) {
  const prepareStatusData = (orders: Order[]): StatusData[] => {
    const statusCounts = {
      Placed: 0,
      Complete: 0,
      Cancelled: 0,
    }

    orders.forEach((order) => {
      if (order.status && order.status in statusCounts) {
        statusCounts[order.status as keyof typeof statusCounts]++
      }
    })

    return [
      { name: 'Placed', value: statusCounts.Placed, color: '#8B9072' },
      { name: 'Complete', value: statusCounts.Complete, color: '#B79D90' },
      { name: 'Cancelled', value: statusCounts.Cancelled, color: '#E3ABAE' },
    ].filter((item) => item.value > 0)
  }

  const statusData = prepareStatusData(orders)

  if (orders.length === 0) {
    return (
      <div className="analytics-card">
        <h3>Order Status Breakdown</h3>
        <div className="no-data">No orders yet</div>
      </div>
    )
  }

  return (
    <div className="analytics-card">
      <h3>Order Status Breakdown</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default OrderStatusBreakdown
