import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Order } from '../lib/supabase'
import {
  AnalyticsSummaryCards,
  OrderStatusBreakdown,
  OrdersOverTimeChart,
  PopularTimesChart,
} from '../components/analytics'
import './Admin.css'

function Admin() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [sortAscending, setSortAscending] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
    fetchAllOrdersForAnalytics()
  }, [sortAscending])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'Placed')
        .order('created_at', { ascending: sortAscending })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      setOrders(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllOrdersForAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching analytics data:', error)
        return
      }

      setAllOrders(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending)
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order:', error)
        alert('Failed to update order status')
        return
      }

      // Remove order from the list
      setOrders(orders.filter(order => order.id !== orderId))
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  const handleComplete = (orderId: number) => {
    updateOrderStatus(orderId, 'Complete')
  }

  const handleCancel = (orderId: number) => {
    updateOrderStatus(orderId, 'Cancelled')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleSignOut} className="signout-button">
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="dashboard-layout">
          <div className="orders-section">
            <div className="orders-header">
              <h2>Pending Orders ({orders.length})</h2>
              <button onClick={toggleSortOrder} className="sort-button">
                Sort By: {sortAscending ? 'Oldest' : 'Newest'}
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="no-orders">No pending orders</div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-content">
                      <div className="order-details">
                        <div className="order-header">
                          <div className="order-header-left">
                            <span className="order-id">Order #{order.id}:</span>
                            <span className="order-customer-name"> {order.name}</span>
                          </div>
                          <span className="order-date">
                            {order.created_at && formatDate(order.created_at)}
                          </span>
                        </div>
                        <div className="order-description">{order.description}</div>
                        {order.allergies && (
                          <>
                            <div className="order-allergies-label">
                              <strong>Allergies/Dietary Restrictions:</strong>
                            </div>
                            <div className="order-allergies-content">
                              {order.allergies}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="order-actions">
                        <button
                          className="complete-button"
                          onClick={() => handleComplete(order.id!)}
                        >
                          Complete
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => handleCancel(order.id!)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="analytics-section">
            <h2>Analytics</h2>
            {analyticsLoading ? (
              <div className="loading">Loading analytics...</div>
            ) : (
              <>
                <AnalyticsSummaryCards orders={allOrders} />
                <OrderStatusBreakdown orders={allOrders} />
                <OrdersOverTimeChart orders={allOrders} />
                <PopularTimesChart orders={allOrders} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
