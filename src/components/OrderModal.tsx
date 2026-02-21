import { useState, useEffect } from 'react'
import './OrderModal.css'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, description: string, allergies: string) => void | Promise<void>
  isSubmitting?: boolean
}

function OrderModal({ isOpen, onClose, onSubmit, isSubmitting = false }: OrderModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [allergies, setAllergies] = useState('')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && description.trim() && !isSubmitting) {
      await onSubmit(name, description, allergies)
      setName('')
      setDescription('')
      setAllergies('')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Place Your Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Order Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Tell us what you'd like to order..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="allergies">Allergies or Dietary Restrictions</label>
            <textarea
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={3}
              placeholder="Let us know about any allergies or dietary restrictions..."
            />
          </div>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderModal
