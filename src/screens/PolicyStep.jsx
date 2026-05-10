import { useBooking } from '../state/BookingContext.jsx'
import { isConsultFlow, getCheckoutScenario } from '../state/pathUtils.js'
import { SPA_PHONE } from '../mockData.js'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function PolicyStep() {
  const { state, dispatch, goNext } = useBooking()
  const consult = isConsultFlow(state)
  const sameDay = consult && state.sameDayProcedure === true
  // Card on file applies on every scenario (A, B, C) — both consult and direct flows hold a card.
  const cardOnFile = !!getCheckoutScenario(state)

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl text-navy mb-1">Cancellation & policies</h2>
        <p className="text-xs text-navy/60">Please review before continuing.</p>
      </div>

      <Callout title="Cancellations & reschedules">
        <p>
          All cancellations and reschedules must be handled by calling{' '}
          <span className="font-semibold text-navy">{SPA_PHONE}</span> directly. We do not
          process cancellations through this widget.
        </p>
      </Callout>

      {sameDay && (
        <Callout title="Same-day procedure deposit">
          <p>
            Same-day procedure deposit of{' '}
            <span className="font-semibold text-navy">$150</span> is non-refundable. If Dr. Chen
            determines the procedure isn't right for you at your consultation, your deposit can
            be applied to any other approved service within 12 months.
          </p>
        </Callout>
      )}

      {cardOnFile && (
        <Callout title="Card on file">
          <p>
            Your card will be securely held on file. The med spa will charge for services after
            your visit per their pricing.
          </p>
        </Callout>
      )}

      <label className="flex items-start gap-2 cursor-pointer mt-1">
        <input
          type="checkbox"
          checked={state.policyAgreed}
          onChange={(e) => dispatch({ type: 'SET_POLICY_AGREED', value: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-sand-300 text-navy focus:ring-navy"
        />
        <span className="text-xs text-navy/80 leading-relaxed">
          I understand and agree to these policies.{' '}
          <span className="text-red-600">*</span>
        </span>
      </label>

      <PrimaryButton onClick={goNext} disabled={!state.policyAgreed}>
        Continue
      </PrimaryButton>
    </div>
  )
}

function Callout({ title, children }) {
  return (
    <div className="rounded-lg bg-cream border border-sand-200 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
        {title}
      </div>
      <div className="mt-1 text-xs text-navy/80 leading-relaxed">{children}</div>
    </div>
  )
}
