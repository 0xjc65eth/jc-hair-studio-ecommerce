'use client'

interface WhatsAppButtonProps {
  message: string
  className?: string
  children: React.ReactNode
}

export default function WhatsAppButton({ message, className = '', children }: WhatsAppButtonProps) {
  const handleClick = () => {
    window.open(`https://wa.me/32470032758?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  )
}