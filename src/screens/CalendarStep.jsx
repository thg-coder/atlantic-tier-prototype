import { useBooking } from '../state/BookingContext.jsx'
import { findService, PRACTITIONER } from '../mockData.js'
import { isConsultFlow, isDirectFlow } from '../state/pathUtils.js'
import Calendar from '../components/Calendar.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function CalendarStep() {
  const { state, dispatch, goNext } = useBooking()
  const service = findService(state.serviceId)
  const consult = isConsultFlow(state)
  const direct = isDirectFlow(state)

  let contextLabel = ''
  if (consult) {
    const format = state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person'
    contextLabel = `Consultation • ${format}`
  } else if (direct && service) {
    contextLabel = `Service • ${service.name}`
  }

  const canContinue = !!state.selectedDateKey && !!state.selectedSlotTime

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <span className="inline-block px-2 py-1 rounded-full bg-navy/5 text-[10px] font-semibold tracking-wider uppercase text-navy/70">
          {contextLabel}
        </span>
        <h2 className="font-display text-2xl text-navy mt-2 mb-1">Pick a time</h2>
        <p className="text-xs text-navy/60">
          You'll be seeing{' '}
          <span className="font-medium text-navy">{PRACTITIONER.shortName}</span>,{' '}
          {PRACTITIONER.title}.
        </p>
      </div>

      {state.formatChangedBanner && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900 flex items-start justify-between gap-2">
          <span>Format updated — please confirm your time slot.</span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'CLEAR_FORMAT_BANNER' })}
            className="text-amber-900/70 hover:text-amber-900 text-xs font-semibold"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <Calendar />

      <PrimaryButton onClick={goNext} disabled={!canContinue}>
        Continue
      </PrimaryButton>
    </div>
  )
}
