import { useRef } from 'react'
import { ChevronLeft } from 'lucide-react'

export function PrimaryButton({ children, disabled, onClick, type = 'button', className = '' }) {
  const lockRef = useRef(false)
  const handle = (e) => {
    if (disabled) return
    if (lockRef.current) return
    lockRef.current = true
    setTimeout(() => {
      lockRef.current = false
    }, 400)
    if (onClick) onClick(e)
  }
  return (
    <button
      type={type}
      onClick={handle}
      disabled={disabled}
      className={
        'w-full py-3 rounded-lg bg-navy text-white text-sm font-semibold tracking-wide ' +
        'transition-all active:scale-[0.99] hover:bg-navy-600 ' +
        'disabled:bg-navy/30 disabled:cursor-not-allowed ' +
        className
      }
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        'w-full py-3 rounded-lg bg-white text-navy text-sm font-semibold border border-navy/20 ' +
        'transition-all active:scale-[0.99] hover:bg-sand-100 ' +
        className
      }
    >
      {children}
    </button>
  )
}

export function BackButton({ onClick, label = 'Back' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-medium text-navy/70 hover:text-navy transition-colors"
    >
      <ChevronLeft size={14} aria-hidden="true" />
      {label}
    </button>
  )
}
