// Atlantic prototype — all mock data lives here. No backend, no API.

export const SPA_NAME = '[Med Spa Name]'
export const SPA_PHONE = '[Spa Phone Number]'
export const SPA_ADDRESS = '[Med Spa Address]'

export const CONSULTATION_FEE = 75
export const SAME_DAY_DEPOSIT = 150

export const PRACTITIONER = {
  name: 'Dr. Sarah Chen, MD',
  shortName: 'Dr. Sarah Chen',
  title: 'Board-Certified Dermatologist'
}

export const CATEGORIES = [
  { id: 'injectables', name: 'Injectables' },
  { id: 'skin', name: 'Skin Treatments' },
  { id: 'hair-body', name: 'Hair & Body' },
  { id: 'wellness', name: 'Wellness' }
]

// Each service: id, category, name, description, durationMin, priceUSD,
// consultRequired, inPersonConsultOnly
export const SERVICES = [
  {
    id: 'botox',
    category: 'injectables',
    name: 'Botox',
    description: 'Smooths fine lines on the forehead, brow, and around the eyes.',
    durationMin: 30,
    priceUSD: 480,
    consultRequired: true,
    inPersonConsultOnly: false
  },
  {
    id: 'filler',
    category: 'injectables',
    name: 'Dermal Filler',
    description: 'Restores volume and contour to lips, cheeks, and under-eye areas.',
    durationMin: 45,
    priceUSD: 700,
    consultRequired: true,
    inPersonConsultOnly: false
  },
  {
    id: 'microneedling',
    category: 'skin',
    name: 'Microneedling',
    description: 'Stimulates collagen for firmer, brighter skin and refined texture.',
    durationMin: 60,
    priceUSD: 400,
    consultRequired: true,
    inPersonConsultOnly: false
  },
  {
    id: 'hydrafacial',
    category: 'skin',
    name: 'HydraFacial',
    description: 'Cleanses, exfoliates, and hydrates for an instant healthy glow.',
    durationMin: 60,
    priceUSD: 200,
    consultRequired: false,
    inPersonConsultOnly: false
  },
  {
    id: 'chemical-peel',
    category: 'skin',
    name: 'Chemical Peel',
    description: 'Resurfaces skin to improve tone, clarity, and texture.',
    durationMin: 45,
    priceUSD: 250,
    consultRequired: true,
    inPersonConsultOnly: false
  },
  {
    id: 'laser-hair',
    category: 'hair-body',
    name: 'Laser Hair Removal Session',
    description: 'Targeted reduction of unwanted hair with long-lasting results.',
    durationMin: 30,
    priceUSD: 200,
    consultRequired: true,
    inPersonConsultOnly: true
  },
  {
    id: 'prp',
    category: 'hair-body',
    name: 'PRP / Hair Restoration',
    description: 'Platelet-rich plasma therapy to support natural hair regrowth.',
    durationMin: 60,
    priceUSD: 900,
    consultRequired: true,
    inPersonConsultOnly: true
  },
  {
    id: 'iv-therapy',
    category: 'wellness',
    name: 'IV Therapy Drip',
    description: 'Custom hydration and vitamin infusion for energy and recovery.',
    durationMin: 45,
    priceUSD: 175,
    consultRequired: false,
    inPersonConsultOnly: false
  }
]

export function findService(id) {
  return SERVICES.find((s) => s.id === id)
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
