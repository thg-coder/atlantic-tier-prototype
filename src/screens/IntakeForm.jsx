import { useRef, useState } from 'react'
import { useBooking } from '../state/BookingContext.jsx'
import { isDirectFlow } from '../state/pathUtils.js'
import { FormField, inputClass, inputErrorClass } from '../components/FormField.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateDOB
} from '../utils/validation.js'
import { formatPhoneInput, normalizePhone } from '../utils/format.js'

const HEAR_OPTIONS = [
  { value: '', label: 'Select…' },
  { value: 'Google', label: 'Google' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Friend/Family', label: 'Friend / Family' },
  { value: 'Yelp', label: 'Yelp' },
  { value: 'Other', label: 'Other' }
]

export default function IntakeForm() {
  const { state, dispatch, goNext } = useBooking()
  const intake = state.intake
  const procedureDay = isDirectFlow(state) // direct + returning-direct paths

  const [errors, setErrors] = useState({})
  const refs = {
    fullName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    dob: useRef(null),
    hearAbout: useRef(null),
    healthAck: useRef(null)
  }

  function update(patch) {
    dispatch({ type: 'UPDATE_INTAKE', patch })
  }

  function clearError(field) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function validateField(field, value) {
    switch (field) {
      case 'fullName':
        return validateRequired(value, 'Full name')
      case 'email':
        return validateEmail(value)
      case 'phone':
        return validatePhone(value)
      case 'dob':
        return validateDOB(value)
      case 'hearAbout':
        return validateRequired(value, 'This selection')
      case 'healthAck':
        return procedureDay && !value ? 'Please confirm to continue.' : null
      default:
        return null
    }
  }

  function handleBlur(field) {
    const err = validateField(field, intake[field])
    setErrors((prev) => {
      const next = { ...prev }
      if (err) next[field] = err
      else delete next[field]
      return next
    })
  }

  function isValid() {
    const required = ['fullName', 'email', 'phone', 'dob', 'hearAbout']
    if (procedureDay) required.push('healthAck')
    for (const f of required) {
      if (validateField(f, intake[f])) return false
    }
    return true
  }

  function handleSubmit(e) {
    if (e) e.preventDefault()
    const required = ['fullName', 'email', 'phone', 'dob', 'hearAbout']
    if (procedureDay) required.push('healthAck')
    const next = {}
    for (const f of required) {
      const err = validateField(f, intake[f])
      if (err) next[f] = err
    }
    if (Object.keys(next).length > 0) {
      setErrors(next)
      const firstField = required.find((f) => next[f])
      const ref = refs[firstField]
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const focusable =
          ref.current.querySelector('input, select, textarea, button') || ref.current
        focusable.focus({ preventScroll: true })
      }
      return
    }
    // Normalize phone to canonical format
    const norm = normalizePhone(intake.phone) || intake.phone
    if (norm !== intake.phone) update({ phone: norm })
    goNext()
  }

  return (
    <form className="screen-enter flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1">Your details</h2>
        <p className="text-xs text-navy/60">
          We'll use these to confirm your appointment and send reminders.
        </p>
      </div>

      <FormField
        ref={refs.fullName}
        id="fullName"
        label="Full name"
        required
        error={errors.fullName}
      >
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          value={intake.fullName}
          onChange={(e) => {
            update({ fullName: e.target.value })
            clearError('fullName')
          }}
          onBlur={() => handleBlur('fullName')}
          className={inputClass + (errors.fullName ? ' ' + inputErrorClass : '')}
          aria-invalid={!!errors.fullName}
        />
      </FormField>

      <FormField ref={refs.email} id="email" label="Email" required error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={intake.email}
          onChange={(e) => {
            update({ email: e.target.value })
            clearError('email')
          }}
          onBlur={() => handleBlur('email')}
          className={inputClass + (errors.email ? ' ' + inputErrorClass : '')}
          aria-invalid={!!errors.email}
        />
      </FormField>

      <FormField ref={refs.phone} id="phone" label="Phone" required error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(555) 555-5555"
          value={intake.phone}
          onChange={(e) => {
            update({ phone: formatPhoneInput(e.target.value) })
            clearError('phone')
          }}
          onBlur={() => {
            const norm = normalizePhone(intake.phone)
            if (norm) update({ phone: norm })
            handleBlur('phone')
          }}
          className={inputClass + (errors.phone ? ' ' + inputErrorClass : '')}
          aria-invalid={!!errors.phone}
        />
      </FormField>

      <FormField
        ref={refs.dob}
        id="dob"
        label="Date of birth"
        required
        error={errors.dob}
        helper="You must be 18 or older to book."
      >
        <input
          id="dob"
          name="dob"
          type="date"
          value={intake.dob}
          onChange={(e) => {
            update({ dob: e.target.value })
            clearError('dob')
          }}
          onBlur={() => handleBlur('dob')}
          className={inputClass + (errors.dob ? ' ' + inputErrorClass : '')}
          aria-invalid={!!errors.dob}
        />
      </FormField>

      <FormField id="reason" label="Reason for visit / goals (optional)">
        <textarea
          id="reason"
          name="reason"
          rows={3}
          value={intake.reason}
          onChange={(e) => update({ reason: e.target.value })}
          className={inputClass + ' resize-none'}
        />
      </FormField>

      <FormField
        ref={refs.hearAbout}
        id="hearAbout"
        label="How did you hear about us?"
        required
        error={errors.hearAbout}
      >
        <select
          id="hearAbout"
          name="hearAbout"
          value={intake.hearAbout}
          onChange={(e) => {
            update({ hearAbout: e.target.value })
            clearError('hearAbout')
          }}
          onBlur={() => handleBlur('hearAbout')}
          className={inputClass + (errors.hearAbout ? ' ' + inputErrorClass : '')}
          aria-invalid={!!errors.hearAbout}
        >
          {HEAR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id="conditions"
        label="Any allergies, medications, or medical conditions we should know about? (optional)"
      >
        <textarea
          id="conditions"
          name="conditions"
          rows={3}
          value={intake.conditions}
          onChange={(e) => update({ conditions: e.target.value })}
          className={inputClass + ' resize-none'}
        />
      </FormField>

      {procedureDay && (
        <div ref={refs.healthAck}>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={intake.healthAck}
              onChange={(e) => {
                update({ healthAck: e.target.checked })
                clearError('healthAck')
              }}
              className="mt-0.5 h-4 w-4 rounded border-sand-300 text-navy focus:ring-navy"
              aria-invalid={!!errors.healthAck}
            />
            <span className="text-xs text-navy/80 leading-relaxed">
              I confirm I'm in good health and have disclosed any relevant conditions above.{' '}
              <span className="text-red-600">*</span>
            </span>
          </label>
          {errors.healthAck && (
            <p className="mt-1 text-[11px] font-medium text-red-600">{errors.healthAck}</p>
          )}
        </div>
      )}

      <PrimaryButton type="submit" disabled={!isValid()}>
        Continue
      </PrimaryButton>
    </form>
  )
}
