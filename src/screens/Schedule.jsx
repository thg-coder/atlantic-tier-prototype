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
  const globalMode = siteConfig.virtualConsultMode || 'both' // 'both' | 'virtual_only' | 'in_person_only'
  // Per-procedure override beats the global config.
  const inPersonOverride = service?.consultModeOverride === 'in_person'

  // Effective format lock: 'in-person' | 'virtual' | null (null = user picks).
  // Per-procedure override wins; then the global mode; 'both' with no override = pick.
  const lockedFormat = inPersonOverride
    ? 'in-person'
    : globalMode === 'in_person_only'
      ? 'in-person'
      : globalMode === 'virtual_only'
        ? 'virtual'
        : null
  const showPicker = lockedFormat === null

  // Surface a config conflict to the deployer (per-procedure override wins).
  useEffect(() => {
    if (globalMode === 'virtual_only' && inPersonOverride) {
      // eslint-disable-next-line no-console
      console.warn(
        `Configuration warning: service "${service?.name}" requires in-person consult but siteConfig.virtualConsultMode is 'virtual_only'. Honoring per-procedure override.`
      )
    }
  }, [globalMode, inPersonOverride, service])

  // When the format is locked, auto-set it (raises the format-changed banner if a
  // slot was already chosen under a different format — that's intentional).
  useEffect(() => {
    if (lockedFormat && state.consultFormat !== lockedFormat) {
      dispatch({ type: 'SET_FORMAT', format: lockedFormat })
    }
  }, [lockedFormat, state.consultFormat, dispatch])

  function pickFormat(format) {
    if (!showPicker) return
    if (state.consultFormat === format) return
    dispatch({ type: 'SET_FORMAT', format })
  }

  const recommended = globalMode === 'both' ? siteConfig.recommendedConsultMode : null
  const lockedFormatLabel = lockedFormat === 'virtual' ? 'virtually' : 'in person'

  const canContinue =
    !!state.consultFormat && !!state.selectedDateKey && !!state.selectedSlotTime

  return (
    <div className="screen-enter flex flex-col gap-6">
      <div>
        <h2 className="font-display font-semibold text-[28px] leading-[1.12] text-navy">
          Reserve your consultation
        </h2>
        <p className="mt-1.5 text-[13px] text-navy/60 leading-relaxed">
          You’ll be meeting with{' '}
          <span className="font-medium text-navy/85">{siteConfig.practitionerName}</span>
          {service ? <> about <span className="font-medium text-navy/85">{service.name}</span></> : null}.
        </p>
      </div>

      {showPicker ? (
        /* Consultation format picker */
        <div className="flex flex-col gap-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
            Consultation format
          </div>
          <ChoiceCard
            icon={<Video size={20} />}
            title="Virtual"
            description="Meet by secure video — convenient and from anywhere."
            selected={state.consultFormat === 'virtual'}
            badge={recommended === 'virtual' ? 'Recommended' : undefined}
            onClick={() => pickFormat('virtual')}
          />
          <ChoiceCard
            icon={<MapPin size={20} />}
            title="In-Person"
            description="Visit the practice to discuss your goals in person."
            selected={state.consultFormat === 'in-person'}
            badge={recommended === 'in_person' ? 'Recommended' : undefined}
            onClick={() => pickFormat('in-person')}
          />
        </div>
      ) : (
        <div className="rounded-lg bg-cream border border-navy/10 px-4 py-2.5 text-[12px] text-navy/65">
          {inPersonOverride
            ? 'In-person consultation required for this procedure.'
            : `This consultation will be conducted ${lockedFormatLabel}.`}
        </div>
      )}

      {state.formatChangedBanner && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 text-[12px] text-amber-900 flex items-start justify-between gap-2">
          <span>Format updated — please confirm your time slot.</span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'CLEAR_FORMAT_BANNER' })}
            className="text-amber-900/60 hover:text-amber-900 text-xs font-semibold"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Date + time */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
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
