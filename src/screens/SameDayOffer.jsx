import { Sparkles } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { SAME_DAY_DEPOSIT } from '../mockData.js'
import { formatPriceUSD } from '../utils/format.js'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'

export default function SameDayOffer() {
  const { dispatch, goNext } = useBooking()

  function pick(value) {
    dispatch({ type: 'SET_SAME_DAY', value })
    setTimeout(goNext, 100)
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div className="rounded-xl bg-gradient-to-br from-cream to-sand-200 border border-sand-300 p-5">
        <div className="flex items-center gap-2 text-navy/70">
          <Sparkles size={16} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Optional add-on</span>
        </div>
        <h2 className="font-display text-2xl text-navy mt-2 leading-tight">
          Want your procedure done the same day?
        </h2>
        <p className="mt-2 text-xs text-navy/70 leading-relaxed">
          Reserve extra time on your appointment so your practitioner can perform the procedure
          right after your consultation, if you're approved. Secure this with a deposit —
          non-refundable, but transferable to any approved service if Dr. Chen determines the
          procedure isn't right for you.
        </p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-navy/50">
            Deposit
          </span>
          <span className="ml-1 text-2xl font-display text-navy">
            {formatPriceUSD(SAME_DAY_DEPOSIT)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <PrimaryButton onClick={() => pick(true)}>
          Yes, reserve same-day procedure
        </PrimaryButton>
        <SecondaryButton onClick={() => pick(false)}>No, just the consultation</SecondaryButton>
      </div>
    </div>
  )
}
