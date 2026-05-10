import { forwardRef } from 'react'

export const FormField = forwardRef(function FormField(
  {
    id,
    label,
    required,
    error,
    helper,
    children,
    className = ''
  },
  ref
) {
  return (
    <div ref={ref} className={'flex flex-col gap-1 ' + className}>
      <label htmlFor={id} className="text-xs font-medium text-navy/80">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {helper && !error && <p className="text-[11px] text-navy/50">{helper}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

export const inputClass =
  'w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm text-ink ' +
  'placeholder:text-navy/30 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 ' +
  'transition-colors'

export const inputErrorClass = 'border-red-500 focus:border-red-500 focus:ring-red-200'
