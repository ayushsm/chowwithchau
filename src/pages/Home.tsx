import { useState } from 'react'
import OrderModal from '../components/OrderModal'
import SuccessMessage from '../components/SuccessMessage'
import { supabase } from '../lib/supabase'
import '../App.css'

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitOrder = async (name: string, description: string, allergies: string) => {
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{ name, description, allergies: allergies || null }])
        .select()

      if (error) {
        console.error('Error saving order:', error)
        alert(`Failed to submit order: ${error.message}\n\nDetails: ${JSON.stringify(error, null, 2)}`)
        setIsSubmitting(false)
        return
      }

      console.log('Order saved successfully:', data)
      setIsModalOpen(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (err: any) {
      console.error('Unexpected error:', err)
      alert(`Unexpected error: ${err.message || err}\n\nCheck browser console for details.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <h1>
        <span className="big-word">Chow</span>{' '}
        <span className="small-word">with</span>{' '}
        <span className="big-word">Chau</span>
      </h1>
      <p className="subtitle">Order your custom baked goods</p>

      <button
        className="order-button"
        onClick={() => setIsModalOpen(true)}
      >
        Place an Order
      </button>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitOrder}
        isSubmitting={isSubmitting}
      />

      <SuccessMessage isVisible={showSuccess} />
    </div>
  )
}

export default Home
