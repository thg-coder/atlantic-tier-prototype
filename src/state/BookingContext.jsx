import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { reducer, initialState } from './reducer.js'
import { PATH_STEPS, getStepIndex, isValidStep, STEP } from './pathUtils.js'
import { generateAvailability } from '../mockData.js'
import { safeGet, safeSet, safeRemove } from '../utils/storage.js'

// v2: bumped for the Phase B structural reshape (9→6 stages). Any state persisted
// under v1 referenced now-deleted step enum values; bumping the key invalidates it.
const STORAGE_KEY = 'atlantic_booking_state_v2'
const SEED_KEY = 'atlantic_seed_v2'

const BookingContext = createContext(null)

function loadInitial() {
  // Hydrate from sessionStorage if present.
  let restored = null
  const raw = safeGet(STORAGE_KEY)
  if (raw) {
    try {
      restored = JSON.parse(raw)
    } catch {
      restored = null
    }
  }
  // Seed: persist for the session so availability is stable across reloads.
  let seedRaw = safeGet(SEED_KEY)
  let seed = seedRaw ? Number(seedRaw) : NaN
  if (!Number.isFinite(seed)) {
    seed = Math.floor(Math.random() * 0xffffffff)
    safeSet(SEED_KEY, String(seed))
  }
  const merged = { ...initialState, ...(restored || {}), availabilitySeed: seed }
  // Hydration guard: a stale/corrupt currentStep (e.g. a deleted enum value from
  // a previous build, or a hand-edited sessionStorage value) must not leave the
  // app in an unrenderable state. Reject anything that isn't a known step.
  if (!isValidStep(merged.currentStep)) {
    merged.currentStep = STEP.LAND
  }
  return merged
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)
  const skipSaveRef = useRef(false)

  // Persist to sessionStorage on every change, except right after a reset.
  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }
    safeSet(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Availability map memoized by seed.
  const availability = useMemo(
    () => (state.availabilitySeed != null ? generateAvailability(state.availabilitySeed) : {}),
    [state.availabilitySeed]
  )

  // History integration: push a state on each step change so browser back works.
  useEffect(() => {
    const onPop = () => {
      const idx = PATH_STEPS.indexOf(state.currentStep)
      if (idx <= 0) {
        // On the first step (or terminal/unknown) — let native nav happen.
        return
      }
      // Don't allow back from confirmation (terminal screen).
      if (state.currentStep === STEP.CONFIRMATION) {
        window.history.pushState({ atlantic: true, step: state.currentStep }, '')
        return
      }
      const prev = PATH_STEPS[idx - 1]
      dispatch({ type: 'GO_TO', step: prev })
      window.history.pushState({ atlantic: true, step: prev }, '')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentStep])

  // Push a history sentinel when advancing past the first step so back gestures
  // have something to pop.
  const prevStepRef = useRef(state.currentStep)
  useEffect(() => {
    if (prevStepRef.current !== state.currentStep) {
      const idx = PATH_STEPS.indexOf(state.currentStep)
      if (idx > 0) {
        try {
          window.history.pushState({ atlantic: true, step: state.currentStep }, '')
        } catch {
          /* noop */
        }
      }
      prevStepRef.current = state.currentStep
    }
  }, [state.currentStep])

  // Keep a ref to the latest state so navigation helpers called right after a
  // dispatch see the post-dispatch state.
  const stateRef = useRef(state)
  stateRef.current = state

  const goNext = () => {
    const cur = stateRef.current
    const idx = PATH_STEPS.indexOf(cur.currentStep)
    if (idx >= 0 && idx < PATH_STEPS.length - 1) {
      dispatch({ type: 'GO_TO', step: PATH_STEPS[idx + 1] })
    } else if (cur.currentStep === STEP.CONFIRM) {
      // CONFIRM is the last counted step; advancing from it lands on the
      // terminal CONFIRMATION screen (which isn't part of PATH_STEPS).
      dispatch({ type: 'GO_TO', step: STEP.CONFIRMATION })
    }
  }
  const goBack = () => {
    const cur = stateRef.current
    const idx = PATH_STEPS.indexOf(cur.currentStep)
    if (idx > 0) {
      dispatch({ type: 'GO_TO', step: PATH_STEPS[idx - 1] })
    }
  }
  const reset = () => {
    skipSaveRef.current = true
    safeRemove(STORAGE_KEY)
    // Keep the seed so availability is stable in this session.
    dispatch({ type: 'RESET', preserveSeed: true })
  }

  const value = useMemo(
    () => ({
      state,
      dispatch,
      availability,
      goNext,
      goBack,
      reset,
      pathSteps: PATH_STEPS,
      stepIndex: getStepIndex(state),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, availability]
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
