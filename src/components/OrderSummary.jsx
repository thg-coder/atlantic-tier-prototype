import { useBooking } from '../state/BookingContext.jsx'
import { findService, CONSULTATION_FEE } from '../mockData.js'
import { siteConfig } from '../siteConfig.js'
import { formatPriceUSD, formatLongDate, formatTime12h } from '../utils/format.js'

export default function OrderSummary() {
  const { state } = useBooking()
  const service = findService(state.intake.procedureInterest)
  const formatLabel = state.consultFormat === 'virtual' ? 'Virtual consultation' : 'In-person consultation'

  const feeModel = siteConfig.consultFeeModel || 'paid_nonrefundable'
  const feeAmount = siteConfig.consultFeeAmount ?? CONSULTATION_FEE
  const isFree = feeModel === 'free'
  const isCredit = feeModel === 'paid_credit'

  const dateObj = state.selectedDateKey
    ? new Date(state.selectedDateKey + 'T12:00:00')
    : null

  return (
    <div className="rounded-xl border border-navy/10 bg-cream shadow-card p-5 space-y-4">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
          Order summary
        </div>
        <div className="mt-1.5 text-[15px] font-semibold text-navy">
          {formatLabel} with {siteConfig.practitionerName}
        </div>
        {service && (
          <div className="mt-0.5 text-[12px] text-navy/55">Procedure of interest: {service.name}</div>
        )}
        {dateObj && (
          <div className="text-[12px] text-navy/55 tabular-nums">
            {formatLongDate(dateObj)}
            {state.selectedSlotTime && <> at {formatTime12h(state.selectedSlotTime)} (ET)</>}
          </div>
        )}
      </div>

      <div className="hairline" />

      <div className="space-y-1.5">
        <div className="flex justify-between text-[13px] text-navy/75">
          <span>Consultation fee</span>
          <span className="tabular-nums">{isFree ? 'Complimentary' : formatPriceUSD(feeAmount)}</span>
        </div>
        {isCredit && (
          <div className="text-[11px] text-navy/50 leading-relaxed">
            Credited toward your procedure if scheduled within{' '}
            {siteConfig.consultFeeCreditWindow} months.
          </div>
        )}
        <div className="flex justify-between text-[15px] font-semibold text-navy pt-1.5">
          <span>Total today</span>
          <span className="tabular-nums">{isFree ? formatPriceUSD(0) : formatPriceUSD(feeAmount)}</span>
        </div>
      </div>

      <div className="hairline" />

      <p className="text-[11px] text-navy/55 leading-relaxed">
        {isFree
          ? 'This consultation is complimentary — there is no charge today.'
          : 'The consultation fee is charged today to secure your appointment.'}
      </p>
    </div>
  )
}
