import { findService } from '../mockData.js'
import { STEP } from './pathUtils.js'

export const initialState = {
  currentStep: STEP.SERVICE,
  serviceId: null,
  isReturningPatient: null, // true | false | null
  consultFormat: null, // 'virtual' | 'in-person' | null
  selectedDateKey: null, // 'YYYY-MM-DD'
  selectedSlotTime: null, // 'HH:MM' (ET)
  sameDayProcedure: null, // true | false | null
  intake: {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    reason: '',
    hearAbout: '',
    conditions: '',
    healthAck: false
  },
  policyAgreed: false,
  payment: {
    last4: null,
    processed: false
  },
  availabilitySeed: null, // initialized in provider
  formatChangedBanner: false,
  pendingServiceChange: null // { newServiceId } when user requests service swap
}

export function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      // Replace state with persisted snapshot (already validated by caller)
      return { ...initialState, ...action.payload }
    }

    case 'SET_AVAILABILITY_SEED': {
      return { ...state, availabilitySeed: action.seed }
    }

    case 'GO_TO': {
      return { ...state, currentStep: action.step }
    }

    case 'SELECT_SERVICE': {
      const newService = findService(action.serviceId)
      if (!newService) return state
      // First-time selection or same service: just set + go to next.
      if (!state.serviceId || state.serviceId === action.serviceId) {
        return {
          ...state,
          serviceId: action.serviceId,
          // If switching to an in-person-only consult and user previously had virtual, drop it
          consultFormat:
            newService.consultModeOverride === 'in_person' && state.consultFormat === 'virtual'
              ? null
              : state.consultFormat
        }
      }
      // Different service: cascade-invalidate slot, sameDay, format if context changes.
      const oldService = findService(state.serviceId)
      // Phase A: every service is consult-led (per-service "consult required"
      // flag removed). The wasConsult / willBeConsult booleans are kept so the
      // existing branch structure stays intact; Phase B simplifies this.
      const wasConsult = !!oldService
      const willBeConsult = true
      let next = {
        ...state,
        serviceId: action.serviceId,
        selectedDateKey: null,
        selectedSlotTime: null,
        sameDayProcedure: null,
        formatChangedBanner: false
      }
      // If the new service doesn't require consult, drop format + returning flag
      // (returning flag only applies to consult-required services).
      if (!willBeConsult) {
        next.consultFormat = null
        next.isReturningPatient = null
      } else {
        // If the new service's consult is in-person-only and user had virtual, drop format.
        if (newService.consultModeOverride === 'in_person' && state.consultFormat === 'virtual') {
          next.consultFormat = null
        }
        // If switching from direct to consult, returning answer hasn't been gathered yet.
        if (!wasConsult) {
          next.isReturningPatient = null
        }
      }
      next.pendingServiceChange = null
      return next
    }

    case 'REQUEST_SERVICE_CHANGE': {
      // Used when user is past Step 1 and tries to change service
      return { ...state, pendingServiceChange: { newServiceId: action.serviceId } }
    }
    case 'CANCEL_SERVICE_CHANGE': {
      return { ...state, pendingServiceChange: null }
    }

    case 'SET_RETURNING': {
      // Toggling this can re-shape the path. Drop now-invalid state.
      const isReturning = action.value === true
      let next = { ...state, isReturningPatient: action.value }
      if (isReturning) {
        // Returning patient → direct path. Drop consult format + same-day.
        next.consultFormat = null
        next.sameDayProcedure = null
      } else {
        // New patient → consult flow. Same-day question will be re-asked.
        // Keep already-selected slot if they had one.
      }
      return next
    }

    case 'SET_FORMAT': {
      // If a slot was already selected, keep it (both formats share the same calendar)
      // but raise a banner asking the user to confirm.
      const showBanner = !!state.selectedSlotTime && state.consultFormat !== action.format
      return { ...state, consultFormat: action.format, formatChangedBanner: showBanner }
    }
    case 'CLEAR_FORMAT_BANNER': {
      return { ...state, formatChangedBanner: false }
    }

    case 'SELECT_SLOT': {
      return {
        ...state,
        selectedDateKey: action.dateKey,
        selectedSlotTime: action.slotTime,
        formatChangedBanner: false
      }
    }
    case 'CLEAR_SLOT': {
      return { ...state, selectedDateKey: null, selectedSlotTime: null }
    }

    case 'SET_SAME_DAY': {
      // If turning off after payment processed, force re-arm payment.
      const paymentReset =
        state.payment.processed && state.sameDayProcedure !== action.value
          ? { last4: null, processed: false }
          : state.payment
      return {
        ...state,
        sameDayProcedure: action.value,
        payment: paymentReset
      }
    }

    case 'UPDATE_INTAKE': {
      return {
        ...state,
        intake: { ...state.intake, ...action.patch }
      }
    }

    case 'SET_POLICY_AGREED': {
      return { ...state, policyAgreed: action.value }
    }

    case 'SET_PAYMENT': {
      return {
        ...state,
        payment: { last4: action.last4, processed: true }
      }
    }

    case 'RESET': {
      return {
        ...initialState,
        availabilitySeed: action.preserveSeed ? state.availabilitySeed : null
      }
    }

    default:
      return state
  }
}
