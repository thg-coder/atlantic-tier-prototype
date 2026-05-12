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
    <div ref={ref} className={'flex flex-col gap-1.5 ' + className}>
      <label htmlFor={id} className="text-[13px] font-medium text-navy/85">
        {label} {required && <span className="text-rose-700">*</span>}
      </label>
      {children}
      {helper && !error && <p className="text-[11px] leading-relaxed text-navy/50">{helper}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[11px] font-medium text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
})

export const inputClass =
  'w-full rounded-lg border border-navy/12 bg-white px-3.5 py-3 text-sm text-ink ' +
  'placeholder:text-navy/30 transition-[border-color,box-shadow] duration-150 ease-out ' +
  'focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/15'

export const inputErrorClass = 'border-rose-500 focus:border-rose-600 focus:ring-rose-200'
