import { STEP } from './pathUtils.js'

export const initialState = {
  currentStep: STEP.LAND,
  consultFormat: null, // 'virtual' | 'in-person' | null
  selectedDateKey: null, // 'YYYY-MM-DD'
  selectedSlotTime: null, // 'HH:MM' (ET)
  intake: {
    // qualifying
    procedureInterest: null, // a SERVICES[].id
    timeline: null,
    priorProcedures: null,
    budgetRange: null, // optional
    referralSource: null,
    // contact
    fullName: '',
    email: '',
    phone: '',
    dob: '',
  },
  policyAgreed: false,
  payment: {
    last4: null,
    processed: false,
  },
  availabilitySeed: null, // initialized in provider
  formatChangedBanner: false,
}

export function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      // Replace state with persisted snapshot (already validated by caller).
      return { ...initialState, ...action.payload }
    }

    case 'SET_AVAILABILITY_SEED': {
      return { ...state, availabilitySeed: action.seed }
    }

    case 'GO_TO': {
      return { ...state, currentStep: action.step }
    }

    case 'SET_FORMAT': {
      // If a slot was already selected, keep it (both formats share the same
      // calendar) but raise a banner asking the user to confirm.
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
        formatChangedBanner: false,
      }
    }
    case 'CLEAR_SLOT': {
      return { ...state, selectedDateKey: null, selectedSlotTime: null }
    }

    case 'UPDATE_INTAKE': {
      return {
        ...state,
        intake: { ...state.intake, ...action.patch },
      }
    }

    case 'SET_POLICY_AGREED': {
      return { ...state, policyAgreed: action.value }
    }

    case 'SET_PAYMENT': {
      return {
        ...state,
        payment: { last4: action.last4, processed: true },
      }
    }

    case 'RESET': {
      return {
        ...initialState,
        availabilitySeed: action.preserveSeed ? state.availabilitySeed : null,
      }
    }

    default:
      return state
  }
}
