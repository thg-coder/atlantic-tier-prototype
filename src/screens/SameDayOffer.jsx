import { Sparkles, CheckCircle2, MinusCircle } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { SAME_DAY_DEPOSIT } from '../mockData.js'
import { formatPriceUSD } from '../utils/format.js'
import ChoiceCard from '../components/ChoiceCard.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function SameDayOffer() {
  const { state, dispatch, goNext } = useBooking()

  function pick(value) {
    if (state.sameDayProcedure === value) return // already selected
    dispatch({ type: 'SET_SAME_DAY', value })
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div className="rounded-xl bg-gradient-to-br from-cream to-sand-200 border border-sand-300 p-5">
        <div className="flex items-center gap-2 text-navy/70">
          <Sparkles size={16} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Optional add-on</span>
        </div>
        <h2 className="font-display font-medium text-[26px] text-navy mt-2 leading-tight">
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
          <span className="ml-1 text-2xl font-semibold text-navy tabular-nums">
            {formatPriceUSD(SAME_DAY_DEPOSIT)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ChoiceCard
          icon={<CheckCircle2 size={20} />}
          title="Yes, reserve same-day procedure"
          description={`We'll add a ${formatPriceUSD(SAME_DAY_DEPOSIT)} deposit to today's total and reserve extra time on your appointment.`}
          selected={state.sameDayProcedure === true}
          onClick={() => pick(true)}
        />
        <ChoiceCard
          icon={<MinusCircle size={20} />}
          title="No, just the consultation"
          description="You can always book the procedure separately after your consultation."
          selected={state.sameDayProcedure === false}
          onClick={() => pick(false)}
        />
      </div>

      <PrimaryButton
        onClick={goNext}
        disabled={state.sameDayProcedure === null || state.sameDayProcedure === undefined}
      >
        Continue
      </PrimaryButton>
    </div>
  )
}
