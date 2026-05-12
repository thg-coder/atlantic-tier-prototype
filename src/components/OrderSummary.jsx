import { useBooking } from '../state/BookingContext.jsx'
import { findService, CONSULTATION_FEE } from '../mockData.js'
import { siteConfig } from '../siteConfig.js'
import { formatPriceUSD, formatLongDate, formatTime12h } from '../utils/format.js'

export default function OrderSummary() {
  const { state } = useBooking()
  const service = findService(state.intake.procedureInterest)
  const formatLabel = state.consultFormat === 'virtual' ? 'Virtual consultation' : 'In-person consultation'

  const dateObj = state.selectedDateKey
    ? new Date(state.selectedDateKey + 'T12:00:00')
    : null

  return (
    <div className="rounded-lg border border-sand-200 bg-cream/40 p-4 space-y-3">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
          Order summary
        </div>
        <div className="mt-1 text-sm font-semibold text-navy">
          {formatLabel} with {siteConfig.practitionerName}
        </div>
        {service && (
          <div className="text-[11px] text-navy/60">Procedure of interest: {service.name}</div>
        )}
        {dateObj && (
          <div className="text-[11px] text-navy/60">
            {formatLongDate(dateObj)}
            {state.selectedSlotTime && <> at {formatTime12h(state.selectedSlotTime)} (ET)</>}
          </div>
        )}
      </div>

      <div className="border-t border-sand-200 pt-3 space-y-1">
        <div className="flex justify-between text-xs text-navy/80">
          <span>Consultation fee</span>
          <span>{formatPriceUSD(CONSULTATION_FEE)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-navy pt-1">
          <span>Total today</span>
          <span>{formatPriceUSD(CONSULTATION_FEE)}</span>
        </div>
      </div>

      <div className="border-t border-sand-200 pt-3 text-[11px] text-navy/60 leading-relaxed">
        The consultation fee is charged today to secure your appointment.
      </div>
    </div>
  )
}
