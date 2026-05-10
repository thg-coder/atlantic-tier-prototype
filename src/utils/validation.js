import { normalizePhone } from './format.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(value) {
  if (!value || !value.trim()) return 'Email is required.'
  if (!EMAIL_RE.test(value.trim())) return 'Please enter a valid email address.'
  return null
}

export function validatePhone(value) {
  if (!value || !value.trim()) return 'Phone number is required.'
  if (!normalizePhone(value)) return 'Please enter a valid 10-digit phone number.'
  return null
}

export function validateRequired(value, label = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) return `${label} is required.`
  return null
}

// DOB: must be valid past date and patient must be >= 18 years old today (inclusive).
export function validateDOB(value) {
  if (!value) return 'Date of birth is required.'
  // value: YYYY-MM-DD from <input type="date">
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return 'Please enter a valid date of birth.'
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const dob = new Date(year, month - 1, day)
  if (dob.getFullYear() !== year || dob.getMonth() !== month - 1 || dob.getDate() !== day) {
    return 'Please enter a valid date of birth.'
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (dob > today) return 'Date of birth cannot be in the future.'
  // Age 18+ inclusive
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1
  }
  if (age < 18) return 'You must be 18 or older to book.'
  return null
}
