import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { reducer, initialState } from './reducer.js'
import { getPathSteps, getStepIndex, STEP } from './pathUtils.js'
import { generateAvailability } from '../mockData.js'
import { safeGet, safeSet, safeRemove } from '../utils/storage.js'

const STORAGE_KEY = 'atlantic_booking_state_v1'
const SEED_KEY = 'atlantic_seed_v1'

const BookingContext = createContext(null)

function loadInitial() {
  // Hydrate from sessionStorage if present
  let restored = null
  const raw = safeGet(STORAGE_KEY)
  if (raw) {
    try {
      restored = JSON.parse(raw)
    } catch {
      restored = null
    }
  }
  // Seed: persist for the session so availability is stable across reloads
  let seedRaw = safeGet(SEED_KEY)
  let seed = seedRaw ? Number(seedRaw) : NaN
  if (!Number.isFinite(seed)) {
    seed = Math.floor(Math.random() * 0xffffffff)
    safeSet(SEED_KEY, String(seed))
  }
  const merged = { ...initialState, ...(restored || {}), availabilitySeed: seed }
  // Drop confirmation step on hydrate — if the user reloads after booking we
  // still keep them on confirmation; otherwise no special handling needed.
  return merged
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)
  const skipSaveRef = useRef(false)

  // Persist to sessionStorage on every change, except when we just reset.
  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }
    safeSet(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Availability map memoized by seed
  const availability = useMemo(
    () => (state.availabilitySeed != null ? generateAvailability(state.availabilitySeed) : {}),
    [state.availabilitySeed]
  )

  // History integration: push a state on each step change so browser back works.
  useEffect(() => {
    const onPop = () => {
      // Treat browser-back as in-widget back when not on Step 1.
      const steps = getPathSteps(state)
      const idx = steps.indexOf(state.currentStep)
      if (idx <= 0) {
        // On Step 1 (or unknown) — let native nav happen by re-pushing nothing.
        return
      }
      // Don't allow back from confirmation (user pressed Book Another to leave).
      if (state.currentStep === STEP.CONFIRMATION) {
        // Re-push so we stay here
        window.history.pushState({ atlantic: true, step: state.currentStep }, '')
        return
      }
      const prev = steps[idx - 1]
      dispatch({ type: 'GO_TO', step: prev })
      // Re-push a sentinel so subsequent backs continue working
      window.history.pushState({ atlantic: true, step: prev }, '')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentStep])

  // Push history sentinel when advancing past Step 1 so back gestures have something to pop.
  const prevStepRef = useRef(state.currentStep)
  useEffect(() => {
    if (prevStepRef.current !== state.currentStep) {
      const steps = getPathSteps(state)
      const idx = steps.indexOf(state.currentStep)
      if (idx > 0) {
        try {
          window.history.pushState({ atlantic: true, step: state.currentStep }, '')
        } catch {
          /* noop */
        }
      }
      prevStepRef.current = state.currentStep
    }
  }, [state.currentStep, state])

  // Keep a ref to the latest state so that navigation helpers called after a
  // dispatch (e.g. dispatch(...); setTimeout(goNext, 100)) always see the
  // post-dispatch state when computing the active path. Updated during render
  // so the ref is current before any post-render setTimeout fires.
  const stateRef = useRef(state)
  stateRef.current = state

  const goNext = () => {
    const cur = stateRef.current
    const steps = getPathSteps(cur)
    const idx = steps.indexOf(cur.currentStep)
    if (idx >= 0 && idx < steps.length - 1) {
      dispatch({ type: 'GO_TO', step: steps[idx + 1] })
    }
  }
  const goBack = () => {
    const cur = stateRef.current
    const steps = getPathSteps(cur)
    const idx = steps.indexOf(cur.currentStep)
    if (idx > 0) {
      dispatch({ type: 'GO_TO', step: steps[idx - 1] })
    }
  }
  const reset = () => {
    skipSaveRef.current = true
    safeRemove(STORAGE_KEY)
    // Keep the seed so availability is stable in this session
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
      pathSteps: getPathSteps(state),
      stepIndex: getStepIndex(state)
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
