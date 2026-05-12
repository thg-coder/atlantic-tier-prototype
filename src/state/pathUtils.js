import { findService } from '../mockData.js'

// Step IDs (canonical names — actual visible step number depends on the path)
export const STEP = {
  SERVICE: 'SERVICE',
  RETURNING_GATE: 'RETURNING_GATE',
  FORMAT: 'FORMAT',
  CALENDAR: 'CALENDAR',
  SAME_DAY: 'SAME_DAY',
  INTAKE: 'INTAKE',
  POLICY: 'POLICY',
  CHECKOUT: 'CHECKOUT',
  CONFIRMATION: 'CONFIRMATION'
}

export const STEP_LABELS = {
  SERVICE: 'Service',
  RETURNING_GATE: 'Patient',
  FORMAT: 'Format',
  CALENDAR: 'Time',
  SAME_DAY: 'Same-Day',
  INTAKE: 'Details',
  POLICY: 'Policy',
  CHECKOUT: 'Payment',
  CONFIRMATION: 'Done'
}

// Booking paths the progress bar can settle on:
//   - Direct service (no consult): 6 steps
//   - Consult required, returning patient: 7 steps
//   - Consult required, new patient, declined same-day: 8 steps
//   - Consult required, new patient, undecided OR opted in to same-day: 9 steps
//
// Until the path is fully determined we show the maximum-length path (9) as a
// placeholder so the progress bar doesn't show a misleading short total.
const FULL_NEW_PATH = [
  STEP.SERVICE,
  STEP.RETURNING_GATE,
  STEP.FORMAT,
  STEP.CALENDAR,
  STEP.SAME_DAY,
  STEP.INTAKE,
  STEP.POLICY,
  STEP.CHECKOUT,
  STEP.CONFIRMATION
]

const NEW_NO_SAMEDAY_PATH = [
  STEP.SERVICE,
  STEP.RETURNING_GATE,
  STEP.FORMAT,
  STEP.CALENDAR,
  STEP.INTAKE,
  STEP.POLICY,
  STEP.CHECKOUT,
  STEP.CONFIRMATION
]

const RETURNING_PATH = [
  STEP.SERVICE,
  STEP.RETURNING_GATE,
  STEP.CALENDAR,
  STEP.INTAKE,
  STEP.POLICY,
  STEP.CHECKOUT,
  STEP.CONFIRMATION
]

const DIRECT_PATH = [
  STEP.SERVICE,
  STEP.CALENDAR,
  STEP.INTAKE,
  STEP.POLICY,
  STEP.CHECKOUT,
  STEP.CONFIRMATION
]

export function getPathSteps(state) {
  const service = findService(state.serviceId)
  // No service yet — show the maximum possible path as the placeholder
  // so "Step 1 of 9" reads correctly.
  if (!service) return FULL_NEW_PATH

  // Phase A: every service is consult-led, so the non-consult DIRECT_PATH
  // branch is now unreachable. DIRECT_PATH stays in the file until Phase B
  // deletes it (and all the other direct-booking path logic).
  if (false) return DIRECT_PATH

  // Consult-required service. Until the returning gate is answered we don't
  // know if the path will be 7 (returning) or 8/9 (new). Show the longest.
  if (state.isReturningPatient === null || state.isReturningPatient === undefined) {
    return FULL_NEW_PATH
  }

  if (state.isReturningPatient === true) return RETURNING_PATH

  // New patient: 8 if they declined same-day AND already moved past that
  // step, 9 otherwise. Keeping SAME_DAY in the path while the user is still
  // on it (or before it) ensures the bar doesn't shrink under their feet
  // when they answer the question, and that going Back returns them to the
  // step they're on.
  if (state.sameDayProcedure === false) {
    const sameDayIdx = FULL_NEW_PATH.indexOf(STEP.SAME_DAY)
    const currentIdx = FULL_NEW_PATH.indexOf(state.currentStep)
    if (currentIdx > sameDayIdx) return NEW_NO_SAMEDAY_PATH
  }
  return FULL_NEW_PATH
}

export function getStepIndex(state) {
  const steps = getPathSteps(state)
  const idx = steps.indexOf(state.currentStep)
  return idx === -1 ? 0 : idx
}

export function isConsultFlow(state) {
  const service = findService(state.serviceId)
  // Phase A: services are always consult-led — the per-service "consult
  // required" check is now hardcoded `true`.
  return !!(service && true && state.isReturningPatient === false)
}

export function isDirectFlow(state) {
  const service = findService(state.serviceId)
  if (!service) return false
  // Phase A: non-consult services no longer exist (hardcoded `false` here);
  // the only remaining "direct" path is returning-patient. Both branches go
  // away in Phase B along with the direct-booking concept.
  if (false) return true
  return true && state.isReturningPatient === true
}

// Checkout scenario:
// A: consultation only (consult flow, no same-day) — charge $75 + card on file
// B: consultation + same-day deposit — charge $225 + card on file
// C: direct service — no charge today, card on file only
export function getCheckoutScenario(state) {
  if (isConsultFlow(state)) {
    return state.sameDayProcedure === true ? 'B' : 'A'
  }
  return 'C'
}
