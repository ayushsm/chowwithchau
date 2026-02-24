import { Order } from '../../lib/supabase'
import './AnalyticsSummaryCards.css'

interface SummaryMetrics {
  totalOrders: number
  todayOrders: number
  completedToday: number
  pendingOrders: number
  completionRate: number
}

interface AnalyticsSummaryCardsProps {
  orders: Order[]
}

function AnalyticsSummaryCards({ orders }: AnalyticsSummaryCardsProps) {
  const calculateMetrics = (orders: Order[]): SummaryMetrics => {
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        todayOrders: 0,
        completedToday: 0,
        pendingOrders: 0,
        completionRate: 0,
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = orders.filter(
      (o) => o.created_at && new Date(o.created_at) >= today
    )

    const completedOrders = orders.filter((o) => o.status === 'Complete')

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      completedToday: todayOrders.filter((o) => o.status === 'Complete').length,
      pendingOrders: orders.filter((o) => o.status === 'Placed').length,
      completionRate: Math.round((completedOrders.length / orders.length) * 100),
    }
  }

  const metrics = calculateMetrics(orders)

  return (
    <div className="summary-cards">
      <div className="metric-card">
        <div className="metric-value">{metrics.totalOrders}</div>
        <div className="metric-label">Total Orders</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{metrics.todayOrders}</div>
        <div className="metric-label">Today's Orders</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{metrics.completedToday}</div>
        <div className="metric-label">Completed Today</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{metrics.pendingOrders}</div>
        <div className="metric-label">Pending Orders</div>
      </div>
      <div className="metric-card">
        <div className="metric-value">{metrics.completionRate}%</div>
        <div className="metric-label">Completion Rate</div>
      </div>
    </div>
  )
}

export default AnalyticsSummaryCards
