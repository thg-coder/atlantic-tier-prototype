// The single 6-stage Atlantic flow, plus a terminal CONFIRMATION screen that is
// NOT counted in the "Step X of 6" progress indicator.
//
//   LAND → TRUST → EDUCATE → QUALIFY → SCHEDULE → CONFIRM   (→ CONFIRMATION)
//
// There is no path branching anymore — Atlantic books a consultation regardless
// of new/returning status. A returning patient ready to book a procedure
// directly is a phone call to the practice, not a path through this funnel.

export const STEP = {
  LAND: 'LAND',
  TRUST: 'TRUST',
  EDUCATE: 'EDUCATE',
  QUALIFY: 'QUALIFY',
  SCHEDULE: 'SCHEDULE',
  CONFIRM: 'CONFIRM',
  CONFIRMATION: 'CONFIRMATION', // terminal — excluded from the step counter
}

// Constant — no longer state-dependent. Denominator for "Step X of 6" is always 6.
export const PATH_STEPS = [
  STEP.LAND,
  STEP.TRUST,
  STEP.EDUCATE,
  STEP.QUALIFY,
  STEP.SCHEDULE,
  STEP.CONFIRM,
]

export const STEP_LABELS = {
  LAND: 'Welcome',
  TRUST: 'Our work',
  EDUCATE: 'About the procedure',
  QUALIFY: 'Tell us about you',
  SCHEDULE: 'Schedule',
  CONFIRM: 'Confirm',
  CONFIRMATION: '', // terminal — no label needed
}

// A currentStep is valid if it's part of the active flow or the terminal screen.
// Used by the hydration guard to reject stale/unknown steps (e.g. a now-deleted
// 'RETURNING_GATE' persisted from a previous build).
export function isValidStep(step) {
  return PATH_STEPS.includes(step) || step === STEP.CONFIRMATION
}

export function getStepIndex(state) {
  const idx = PATH_STEPS.indexOf(state.currentStep)
  return idx === -1 ? 0 : idx
}
