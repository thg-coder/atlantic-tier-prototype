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

// Booking paths
// 1. Consultation (new patient) flow: 9 steps (incl. same-day offer)
// 2. Direct service flow (no consult required): 7 steps
// 3. Returning patient direct flow (consult-required service, returning yes): 8 steps
//    spec describes 8 steps for this path; we use Service, Returning Gate,
//    Calendar, Intake, Policy, Checkout, Done — that is 7 explicit steps;
//    we render an additional confirmation step "Verify" implicitly by counting
//    the gate as its own visible step.
//
// Implementation: build the list of visible step IDs for each path.
export function getPathSteps(state) {
  const service = findService(state.serviceId)
  if (!service) {
    return [STEP.SERVICE]
  }

  if (!service.consultRequired) {
    // Direct flow: 7 steps
    return [
      STEP.SERVICE,
      STEP.CALENDAR,
      STEP.INTAKE,
      STEP.POLICY,
      STEP.CHECKOUT,
      STEP.CONFIRMATION
    ]
  }

  // Consult-required service. Need to know returning answer.
  if (state.isReturningPatient === null || state.isReturningPatient === undefined) {
    // Until they answer, only show what's known so far
    return [STEP.SERVICE, STEP.RETURNING_GATE]
  }

  if (state.isReturningPatient === true) {
    // Returning patient direct flow
    return [
      STEP.SERVICE,
      STEP.RETURNING_GATE,
      STEP.CALENDAR,
      STEP.INTAKE,
      STEP.POLICY,
      STEP.CHECKOUT,
      STEP.CONFIRMATION
    ]
  }

  // New / 12+ months: full consult flow with same-day offer
  return [
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
}

export function getStepIndex(state) {
  const steps = getPathSteps(state)
  const idx = steps.indexOf(state.currentStep)
  return idx === -1 ? 0 : idx
}

export function isConsultFlow(state) {
  const service = findService(state.serviceId)
  return !!(service && service.consultRequired && state.isReturningPatient === false)
}

export function isDirectFlow(state) {
  const service = findService(state.serviceId)
  if (!service) return false
  if (!service.consultRequired) return true
  return service.consultRequired && state.isReturningPatient === true
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
