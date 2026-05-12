// Mock data for the prototype. No backend, no API.
// Practice identity (name, address, phone, branding, etc.) lives in
// src/siteConfig.js, not here.
import { siteConfig } from './siteConfig.js'

// Consultation fee fallback. The Confirm/Order/Confirmation screens read
// siteConfig.consultFeeAmount first and fall back to this if it's undefined.
export const CONSULTATION_FEE = 150

// Each service: id, name, description, durationMin, priceUSD,
// consultModeOverride ('in_person' forces in-person consultation; null = either,
// subject to siteConfig.virtualConsultMode). priceUSD is unused while
// siteConfig.pricingVisibility === 'hide'.
export const SERVICES = [
  {
    id: 'botox',
    name: 'Botox',
    description: 'Smooths fine lines on the forehead, brow, and around the eyes.',
    durationMin: 30,
    priceUSD: 480,
    consultModeOverride: null
  },
  {
    id: 'filler',
    name: 'Dermal Filler',
    description: 'Restores volume and contour to lips, cheeks, and under-eye areas.',
    durationMin: 45,
    priceUSD: 700,
    consultModeOverride: null
  },
  {
    id: 'microneedling',
    name: 'Microneedling',
    description: 'Stimulates collagen for firmer, brighter skin and refined texture.',
    durationMin: 60,
    priceUSD: 400,
    consultModeOverride: null
  },
  {
    id: 'hydrafacial',
    name: 'HydraFacial',
    description: 'Cleanses, exfoliates, and hydrates for an instant healthy glow.',
    durationMin: 60,
    priceUSD: 200,
    consultModeOverride: null
  },
  {
    id: 'chemical-peel',
    name: 'Chemical Peel',
    description: 'Resurfaces skin to improve tone, clarity, and texture.',
    durationMin: 45,
    priceUSD: 250,
    consultModeOverride: null
  },
  {
    id: 'laser-hair',
    name: 'Laser Hair Removal Session',
    description: 'Targeted reduction of unwanted hair with long-lasting results.',
    durationMin: 30,
    priceUSD: 200,
    consultModeOverride: 'in_person'
  },
  {
    id: 'prp',
    name: 'PRP / Hair Restoration',
    description: 'Platelet-rich plasma therapy to support natural hair regrowth.',
    durationMin: 60,
    priceUSD: 900,
    consultModeOverride: 'in_person'
  },
  {
    id: 'iv-therapy',
    name: 'IV Therapy Drip',
    description: 'Custom hydration and vitamin infusion for energy and recovery.',
    durationMin: 45,
    priceUSD: 175,
    consultModeOverride: null
  }
]

export function findService(id) {
  return SERVICES.find((s) => s.id === id)
}

// Display label for a procedure-of-interest id. Reads siteConfig.procedureDetails
// first (covers the 'comprehensive' fallback and any per-deployment relabelling),
// then falls back to the SERVICES name, then null.
export function getProcedureLabel(id) {
  if (!id) return null
  const fromConfig = siteConfig.procedureDetails?.[id]?.label
  if (fromConfig) return fromConfig
  const svc = SERVICES.find((s) => s.id === id)
  return svc ? svc.name : null
}

// Deterministic seeded PRNG so availability is stable across navigation.
function mulberry32(seed) {
  let t = seed >>> 0
  return function () {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// Returns availability map: { 'YYYY-MM-DD': ['09:00', '09:30', ...] }
// Tue–Sat 9:00–17:00 in Eastern Time, 30-min slots, ~30% removed (booked).
// Spans 90 days starting from today (in ET-aware day buckets).
export function generateAvailability(seed) {
  const rand = mulberry32(seed)
  const result = {}
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  for (let i = 0; i < 90; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dow = d.getDay() // 0 Sun .. 6 Sat
    if (dow === 0 || dow === 1) continue // closed Sun & Mon
    const key = formatDateKey(d)
    const slots = []
    for (let h = 9; h < 17; h++) {
      for (const m of [0, 30]) {
        if (rand() < 0.3) continue // booked
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      }
    }
    if (slots.length > 0) result[key] = slots
  }
  return result
}

export function formatDateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
