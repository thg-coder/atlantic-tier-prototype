import { useRef, useState } from 'react'
import { useBooking } from '../state/BookingContext.jsx'
import { SERVICES } from '../mockData.js'
import { FormField, inputClass, inputErrorClass } from '../components/FormField.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateDOB,
} from '../utils/validation.js'
import { formatPhoneInput, normalizePhone } from '../utils/format.js'

const TIMELINE_OPTIONS = [
  'Exploring options',
  'Planning within the next year',
  'Ready to schedule',
]
const PRIOR_OPTIONS = ['Yes', 'No', 'Prefer not to say']
const BUDGET_OPTIONS = [
  'Under $5,000',
  '$5,000 – $15,000',
  '$15,000 – $30,000',
  '$30,000+',
  'Prefer not to discuss yet',
]
const REFERRAL_OPTIONS = [
  'Referral from a patient',
  'Referral from another provider',
  'Online search',
  'Social media',
  'Other',
]

// budgetRange is optional; everything else is required.
const REQUIRED = [
  'procedureInterest',
  'timeline',
  'priorProcedures',
  'referralSource',
  'fullName',
  'email',
  'phone',
  'dob',
]

function RadioGroup({ name, options, value, onChange, invalid }) {
  return (
    <div role="radiogroup" aria-invalid={!!invalid} className="flex flex-col gap-2">
      {options.map((opt) => {
        const selected = value === opt
        return (
          <label
            key={opt}
            className={
              'flex items-center gap-3 cursor-pointer rounded-md border px-3 py-2.5 text-sm transition-colors ' +
              (selected ? 'border-navy bg-navy/5 text-navy' : 'border-sand-200 text-navy hover:border-navy/40')
            }
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              className="h-4 w-4 text-navy border-sand-300 focus:ring-navy"
            />
            <span>{opt}</span>
          </label>
        )
      })}
    </div>
  )
}

export default function Qualify() {
  const { state, dispatch, goNext } = useBooking()
  const intake = state.intake
  const [errors, setErrors] = useState({})
  const refs = {
    procedureInterest: useRef(null),
    timeline: useRef(null),
    priorProcedures: useRef(null),
    referralSource: useRef(null),
    fullName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    dob: useRef(null),
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
      case 'procedureInterest':
      case 'timeline':
      case 'priorProcedures':
      case 'referralSource':
        return validateRequired(value, 'This selection')
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
    for (const f of REQUIRED) {
      if (validateField(f, intake[f])) return false
    }
    return true
  }

  function handleSubmit(e) {
    if (e) e.preventDefault()
    const next = {}
    for (const f of REQUIRED) {
      const err = validateField(f, intake[f])
      if (err) next[f] = err
    }
    if (Object.keys(next).length > 0) {
      setErrors(next)
      const firstField = REQUIRED.find((f) => next[f])
      const ref = refs[firstField]
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const focusable =
          ref.current.querySelector('input, select, textarea, button') || ref.current
        focusable.focus({ preventScroll: true })
      }
      return
    }
    const norm = normalizePhone(intake.phone) || intake.phone
    if (norm !== intake.phone) update({ phone: norm })
    goNext()
  }

  return (
    <form className="screen-enter flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          About your consultation
        </h2>
        <p className="text-xs text-navy/60">
          A few questions before we schedule. This information helps us prepare for our time
          together.
        </p>
      </div>

      {/* 1 — procedure of interest */}
      <FormField
        ref={refs.procedureInterest}
        id="procedureInterest"
        label="Procedure you’d like to discuss"
        required
        error={errors.procedureInterest}
      >
        <select
          id="procedureInterest"
          name="procedureInterest"
          value={intake.procedureInterest || ''}
          onChange={(e) => {
            update({ procedureInterest: e.target.value || null })
            clearError('procedureInterest')
          }}
          onBlur={() => handleBlur('procedureInterest')}
          className={inputClass + (errors.procedureInterest ? ' ' + inputErrorClass : '')}
          aria-invalid={!!errors.procedureInterest}
        >
          <option value="">Select…</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </FormField>

      {/* 2 — timeline */}
      <FormField
        ref={refs.timeline}
        id="timeline"
        label="How are you approaching this?"
        required
        error={errors.timeline}
      >
        <RadioGroup
          name="timeline"
          options={TIMELINE_OPTIONS}
          value={intake.timeline}
          onChange={(v) => {
            update({ timeline: v })
            clearError('timeline')
          }}
          invalid={errors.timeline}
        />
      </FormField>

      {/* 3 — prior procedures */}
      <FormField
        ref={refs.priorProcedures}
        id="priorProcedures"
        label="Have you had cosmetic surgery or aesthetic procedures before?"
        required
        error={errors.priorProcedures}
      >
        <RadioGroup
          name="priorProcedures"
          options={PRIOR_OPTIONS}
          value={intake.priorProcedures}
          onChange={(v) => {
            update({ priorProcedures: v })
            clearError('priorProcedures')
          }}
          invalid={errors.priorProcedures}
        />
      </FormField>

      {/* 4 — budget (optional) */}
      <FormField
        id="budgetRange"
        label="Approximate budget range (optional)"
        helper="We ask so we can recommend approaches that fit your circumstances — not to filter patients."
      >
        <select
          id="budgetRange"
          name="budgetRange"
          value={intake.budgetRange || ''}
          onChange={(e) => update({ budgetRange: e.target.value || null })}
          className={inputClass}
        >
          <option value="">Select…</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </FormField>

      {/* 5 — referral source */}
      <FormField
        ref={refs.referralSource}
        id="referralSource"
        label="How did you find us?"
        required
        error={errors.referralSource}
      >
        <select
          id="referralSource"
          name="referralSource"
          value={intake.referralSource || ''}
          onChange={(e) => {
            update({ referralSource: e.target.value || null })
            clearError('referralSource')
          }}
          onBlur={() => handleBlur('referralSource')}
          className={inputClass + (errors.referralSource ? ' ' + inputErrorClass : '')}
          aria-invalid={!!errors.referralSource}
        >
          <option value="">Select…</option>
          {REFERRAL_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </FormField>

      <div className="border-t border-sand-200 pt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/50 mb-3">
          Contact information
        </div>

        <div className="flex flex-col gap-4">
          <FormField ref={refs.fullName} id="fullName" label="Full name" required error={errors.fullName}>
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
        </div>
      </div>

      <PrimaryButton type="submit" disabled={!isValid()}>
        Continue to scheduling
      </PrimaryButton>
    </form>
  )
}
