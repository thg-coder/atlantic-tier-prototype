import { useBooking } from '../state/BookingContext.jsx'
import {
  findService,
  CONSULTATION_FEE,
  SAME_DAY_DEPOSIT,
  PRACTITIONER
} from '../mockData.js'
import { getCheckoutScenario, isConsultFlow } from '../state/pathUtils.js'
import { formatPriceUSD, formatLongDate, formatTime12h } from '../utils/format.js'

export default function OrderSummary() {
  const { state } = useBooking()
  const service = findService(state.serviceId)
  const scenario = getCheckoutScenario(state)
  const consult = isConsultFlow(state)
  const sameDay = consult && state.sameDayProcedure === true

  const dateObj = state.selectedDateKey
    ? new Date(state.selectedDateKey + 'T12:00:00')
    : null

  const formatLabel = consult
    ? state.consultFormat === 'virtual'
      ? 'Virtual consultation'
      : 'In-person consultation'
    : 'Service appointment'

  const lineItems = []
  if (scenario === 'A' || scenario === 'B') {
    lineItems.push({ label: 'Consultation fee', amount: CONSULTATION_FEE })
  }
  if (scenario === 'B') {
    lineItems.push({ label: 'Same-day procedure deposit', amount: SAME_DAY_DEPOSIT })
  }
  const totalToday = lineItems.reduce((sum, l) => sum + l.amount, 0)

  return (
    <div className="rounded-lg border border-sand-200 bg-cream/40 p-4 space-y-3">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
          Order summary
        </div>
        <div className="mt-1 text-sm font-semibold text-navy">{service?.name}</div>
        <div className="text-[11px] text-navy/60">
          {formatLabel} with {PRACTITIONER.shortName}
        </div>
        {dateObj && (
          <div className="text-[11px] text-navy/60">
            {formatLongDate(dateObj)}
            {state.selectedSlotTime && (
              <> at {formatTime12h(state.selectedSlotTime)} (ET)</>
            )}
          </div>
        )}
      </div>

      {lineItems.length > 0 && (
        <div className="border-t border-sand-200 pt-3 space-y-1">
          {lineItems.map((l) => (
            <div key={l.label} className="flex justify-between text-xs text-navy/80">
              <span>{l.label}</span>
              <span>{formatPriceUSD(l.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold text-navy pt-1">
            <span>Total today</span>
            <span>{formatPriceUSD(totalToday)}</span>
          </div>
        </div>
      )}

      <div className="border-t border-sand-200 pt-3 text-[11px] text-navy/60 leading-relaxed">
        {scenario === 'A' && (
          <>
            Card on file will be held to bill any post-visit charges. Today you'll only be
            charged the consultation fee.
          </>
        )}
        {scenario === 'B' && (
          <>
            Card on file will be held to bill any post-visit charges. Today you'll be charged
            the consultation fee plus the same-day procedure deposit.
          </>
        )}
        {scenario === 'C' && service && (
          <>
            Your card will be securely held on file. The med spa will charge{' '}
            <span className="font-semibold text-navy">
              {formatPriceUSD(service.priceUSD)}
            </span>{' '}
            after your visit.
          </>
        )}
      </div>
    </div>
  )
}
