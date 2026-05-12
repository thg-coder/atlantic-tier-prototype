// The single 6-stage Atlantic flow, plus a terminal CONFIRMATION screen that is
// NOT counted in the "Step X of 6" progress indicator.
//
//   LAND → PICK → LEARN → QUALIFY → SCHEDULE → CONFIRM   (→ CONFIRMATION)
//
// Procedure-of-interest is collected at PICK (step 2), so LEARN (step 3) can
// render procedure-aware education, gallery, and testimonial content. There is
// no path branching — Atlantic books a consultation regardless of new/returning
// status; a returning patient ready to book directly is a phone call, not a
// path through this funnel.

export const STEP = {
  LAND: 'LAND',
  PICK: 'PICK',
  LEARN: 'LEARN',
  QUALIFY: 'QUALIFY',
  SCHEDULE: 'SCHEDULE',
  CONFIRM: 'CONFIRM',
  CONFIRMATION: 'CONFIRMATION', // terminal — excluded from the step counter
}

// Constant — not state-dependent. Denominator for "Step X of 6" is always 6.
export const PATH_STEPS = [
  STEP.LAND,
  STEP.PICK,
  STEP.LEARN,
  STEP.QUALIFY,
  STEP.SCHEDULE,
  STEP.CONFIRM,
]

export const STEP_LABELS = {
  LAND: 'Welcome',
  PICK: 'What brings you in',
  LEARN: 'Your procedure',
  QUALIFY: 'About you',
  SCHEDULE: 'Schedule',
  CONFIRM: 'Confirm',
  CONFIRMATION: '', // terminal — no label needed
}

// A currentStep is valid if it's part of the active flow or the terminal screen.
// Used by the hydration guard to reject stale/unknown steps (e.g. a now-deleted
// 'TRUST' / 'EDUCATE' persisted from a previous build).
export function isValidStep(step) {
  return PATH_STEPS.includes(step) || step === STEP.CONFIRMATION
}

export function getStepIndex(state) {
  const idx = PATH_STEPS.indexOf(state.currentStep)
  return idx === -1 ? 0 : idx
}
