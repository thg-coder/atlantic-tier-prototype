import { useBooking } from '../state/BookingContext.jsx'
import { siteConfig } from '../siteConfig.js'
import { PrimaryButton } from '../components/Buttons.jsx'

const WHAT_TO_EXPECT = [
  'Most consultations last 45–60 minutes, in person or by video.',
  "Bring any photographs of results you're drawn to, plus questions you'd like answered.",
  'You will not be asked to commit to a procedure during the consultation.',
]

export default function Educate() {
  const { state, goNext } = useBooking()
  const { pricingVisibility, priceRanges } = siteConfig
  const priceLabel = priceRanges?.[state.intake.procedureInterest] ?? 'Available on request'

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          About this procedure
        </h2>
        <p className="text-xs text-navy/60">[Procedure name — placeholder.]</p>
      </div>

      <div className="space-y-3 text-sm text-navy/70 leading-relaxed">
        <p>
          Every aesthetic procedure is a balance — between what a technique can deliver and what
          your anatomy, expectations, and life circumstances allow. The right starting point
          isn't a treatment plan, but an honest conversation about what you're trying to change
          and whether this is the right approach to change it.
        </p>
        <p>
          Consultations are unhurried. We review your goals, examine the relevant areas, discuss
          what's surgically realistic, and walk through the alternatives — including the
          alternative of doing nothing. You'll leave the consultation with a written summary of
          what was discussed and the recommendations you were offered.
        </p>
        <p>
          If your goals are a good fit for the practice, scheduling, pricing, and pre-operative
          steps are discussed in a follow-up conversation. We do not pressure patients to commit
          during the consultation itself.
        </p>
      </div>

      <div className="rounded-lg bg-cream border border-sand-200 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60 mb-2">
          What to expect
        </div>
        <ul className="text-xs text-navy/80 leading-relaxed list-disc pl-4 space-y-1">
          {WHAT_TO_EXPECT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {pricingVisibility === 'show' && (
        <div className="text-sm text-navy/80">
          <span className="font-semibold">Investment:</span> {priceLabel}
        </div>
      )}
      {pricingVisibility === 'starting_at' && (
        <div className="text-sm text-navy/80">
          <span className="font-semibold">Starting at:</span> {priceLabel}
        </div>
      )}

      <PrimaryButton onClick={goNext}>Continue to consultation request</PrimaryButton>
    </div>
  )
}
