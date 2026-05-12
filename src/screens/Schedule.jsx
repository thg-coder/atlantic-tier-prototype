import { useEffect } from 'react'
import { Video, MapPin } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { findService } from '../mockData.js'
import { siteConfig } from '../siteConfig.js'
import ChoiceCard from '../components/ChoiceCard.jsx'
import Calendar from '../components/Calendar.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function Schedule() {
  const { state, dispatch, goNext } = useBooking()
  const service = findService(state.intake.procedureInterest)
  // 'in_person' override forces in-person. Phase D layers siteConfig.virtualConsultMode beneath this.
  const inPersonOnly = service?.consultModeOverride === 'in_person'

  // Lock the picker to in-person when the procedure requires it.
  useEffect(() => {
    if (inPersonOnly && state.consultFormat !== 'in-person') {
      dispatch({ type: 'SET_FORMAT', format: 'in-person' })
    }
  }, [inPersonOnly, state.consultFormat, dispatch])

  function pickFormat(format) {
    if (format === 'virtual' && inPersonOnly) return
    if (state.consultFormat === format) return
    dispatch({ type: 'SET_FORMAT', format })
  }

  const canContinue =
    !!state.consultFormat && !!state.selectedDateKey && !!state.selectedSlotTime

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          Schedule your consultation
        </h2>
        <p className="text-xs text-navy/60">
          You’ll be meeting with{' '}
          <span className="font-medium text-navy">{siteConfig.practitionerName}</span>
          {service ? <> about <span className="font-medium text-navy">{service.name}</span></> : null}.
        </p>
      </div>

      {/* Consultation format picker */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/50">
          Consultation format
        </div>
        <ChoiceCard
          icon={<Video size={20} />}
          title="Virtual"
          description="Meet by secure video — convenient and from anywhere."
          selected={state.consultFormat === 'virtual'}
          disabled={inPersonOnly}
          disabledNote={inPersonOnly ? 'In-person consultation required for this procedure.' : undefined}
          onClick={() => pickFormat('virtual')}
        />
        <ChoiceCard
          icon={<MapPin size={20} />}
          title="In-Person"
          description="Visit the practice to discuss your goals in person."
          selected={state.consultFormat === 'in-person'}
          onClick={() => pickFormat('in-person')}
        />
        {inPersonOnly && (
          <p className="text-[11px] text-navy/50">
            In-person consultation required for this procedure.
          </p>
        )}
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

      {/* Date + time */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/50">
          Pick a date &amp; time
        </div>
        <Calendar />
      </div>

      <PrimaryButton onClick={goNext} disabled={!canContinue}>
        Continue
      </PrimaryButton>
    </div>
  )
}
