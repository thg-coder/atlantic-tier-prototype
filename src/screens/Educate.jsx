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
    <div className="screen-enter flex flex-col gap-6">
      <div>
        <h2 className="font-display font-semibold text-[28px] leading-[1.12] text-navy">
          About this procedure
        </h2>
        <p className="mt-1 text-[12px] text-navy/50">[Procedure name — placeholder.]</p>
      </div>

      <div className="prose-editorial space-y-4 text-[14.5px] text-navy/70">
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

      <hr className="hairline" />

      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45 mb-3">
          What to expect
        </div>
        <ul className="space-y-2.5">
          {WHAT_TO_EXPECT.map((item) => (
            <li key={item} className="flex gap-3 text-[13.5px] text-navy/70 leading-relaxed">
              <span aria-hidden="true" className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-navy/35" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {(pricingVisibility === 'show' || pricingVisibility === 'starting_at') && (
        <>
          <hr className="hairline" />
          <div className="text-[14px] text-navy/75">
            <span className="font-semibold text-navy">
              {pricingVisibility === 'starting_at' ? 'Starting at:' : 'Investment:'}
            </span>{' '}
            {priceLabel}
          </div>
        </>
      )}

      <PrimaryButton onClick={goNext}>Continue to consultation request</PrimaryButton>
    </div>
  )
}
