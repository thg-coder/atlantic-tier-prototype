// Phone normalization: accepts (555) 555-5555, 555-555-5555, 5555555555,
// +1 555 555 5555. Returns formatted (555) 555-5555 or null if not 10 digits.
export function normalizePhone(input) {
  if (!input) return null
  const digits = input.replace(/\D/g, '')
  // Strip leading country code 1 if present
  const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (ten.length !== 10) return null
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`
}

export function formatPhoneInput(input) {
  // Soft-format while typing — best effort, accepts partial input
  const digits = input.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function formatCardNumber(input) {
  const digits = input.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export function formatExpiry(input) {
  const digits = input.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function formatCVC(input) {
  return input.replace(/\D/g, '').slice(0, 4)
}

export function formatZIP(input) {
  return input.replace(/[^A-Za-z0-9\- ]/g, '').slice(0, 10)
}

export function formatPriceUSD(amount) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// Time helpers
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function monthLabel(year, monthIdx) {
  return `${MONTHS[monthIdx]} ${year}`
}

export function formatLongDate(d) {
  return `${DAYS_SHORT[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export function formatTime12h(timeStr) {
  // timeStr: "HH:MM"
  const [hh, mm] = timeStr.split(':').map(Number)
  const period = hh >= 12 ? 'PM' : 'AM'
  const display = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh
  return `${display}:${String(mm).padStart(2, '0')} ${period}`
}
