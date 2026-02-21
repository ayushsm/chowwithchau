import './SuccessMessage.css'

interface SuccessMessageProps {
  isVisible: boolean
}

function SuccessMessage({ isVisible }: SuccessMessageProps) {
  if (!isVisible) return null

  return (
    <div className="success-message">
      Order submitted successfully! ✓
    </div>
  )
}

export default SuccessMessage
