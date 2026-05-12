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
        'w-full py-3.5 rounded-xl bg-navy text-white text-sm font-semibold tracking-[0.01em] shadow-cta ' +
        'transition-all duration-150 ease-out hover:bg-navy-600 active:scale-[0.985] active:shadow-card-active ' +
        'disabled:bg-navy/25 disabled:text-white/70 disabled:shadow-none disabled:cursor-not-allowed ' +
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
        'w-full py-3.5 rounded-xl bg-transparent text-navy/80 text-sm font-medium border border-navy/15 ' +
        'transition-all duration-150 ease-out hover:bg-navy/[0.04] hover:text-navy active:scale-[0.985] ' +
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
      className="inline-flex items-center gap-1 text-xs font-medium text-navy/55 hover:text-navy transition-colors duration-150"
    >
      <ChevronLeft size={14} aria-hidden="true" />
      {label}
    </button>
  )
}
