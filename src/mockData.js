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
// siteConfig.pricingVisibility === 'hide' (kept as a rough placeholder).
//
// Atlantic positioning: consult-led plastic surgery + premium dermatology.
// Surgical procedures require a physical exam, so consultModeOverride is
// 'in_person'; the injectable consultation is a planning conversation that can
// happen virtually first, so its override is null (governed by virtualConsultMode).
export const SERVICES = [
  {
    id: 'rhinoplasty',
    name: 'Rhinoplasty',
    description: 'Structural reshaping of the nose, balancing aesthetic refinement with preserved breathing function.',
    durationMin: 60,
    priceUSD: 12000,
    consultModeOverride: 'in_person'
  },
  {
    id: 'facelift',
    name: 'Facelift',
    description: 'Surgical lifting and repositioning of facial tissue to address laxity across the midface, jawline, and neck.',
    durationMin: 60,
    priceUSD: 22000,
    consultModeOverride: 'in_person'
  },
  {
    id: 'eyelid-surgery',
    name: 'Eyelid Surgery',
    description: 'Blepharoplasty addressing excess skin and puffiness of the upper and/or lower eyelids.',
    durationMin: 45,
    priceUSD: 6500,
    consultModeOverride: 'in_person'
  },
  {
    id: 'breast-augmentation',
    name: 'Breast Augmentation',
    description: 'Implant- or fat-based augmentation, with implant type and placement matched to anatomy and goals.',
    durationMin: 60,
    priceUSD: 9500,
    consultModeOverride: 'in_person'
  },
  {
    id: 'body-contouring',
    name: 'Body Contouring',
    description: 'Surgical body reshaping — liposuction, abdominoplasty, and post-weight-loss procedures.',
    durationMin: 60,
    priceUSD: 14000,
    consultModeOverride: 'in_person'
  },
  {
    id: 'injectable-consultation',
    name: 'Injectable Consultation',
    description: 'A planning conversation around neuromodulators and fillers — conservative, anatomy-led dosing.',
    durationMin: 30,
    priceUSD: 0,
    consultModeOverride: null
  },
  {
    id: 'skin-restoration',
    name: 'Skin Restoration & Mohs',
    description: 'Medical and cosmetic dermatology, including skin-cancer treatment, Mohs surgery, and reconstruction.',
    durationMin: 45,
    priceUSD: 0,
    consultModeOverride: 'in_person'
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
