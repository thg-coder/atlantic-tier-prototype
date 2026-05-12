import { useBooking } from '../state/BookingContext.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

// Initials + age only — matches Atlantic privacy posture; real practices don't
// publish patient names for cosmetic procedures. Replaced during onboarding.
const TESTIMONIALS = [
  {
    attribution: 'A.M., age 42',
    quote:
      "The consultation didn't feel like a sales conversation. She explained what she'd recommend, what she wouldn't, and why. I felt informed rather than sold to.",
  },
  {
    attribution: 'J.K., age 56',
    quote:
      'I had consulted with three surgeons before this one. The difference was specificity. She told me what she could realistically achieve and what was outside the technique. I trusted her because of what she declined to promise.',
  },
]

// First two stay bracketed — they're real per-client configuration values.
const CREDENTIALS = [
  'Board Certified — American Board of Plastic Surgery',
  'Active Member, [Professional Society]',
  '[XX] Years in Practice',
]

export default function Trust() {
  const { goNext } = useBooking()

  return (
    <div className="screen-enter flex flex-col gap-8">
      {/* Section 1 — selected work */}
      <div>
        <h2 className="font-display font-semibold text-[28px] leading-[1.12] text-navy mb-3.5">
          Selected work
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-lg bg-navy/[0.06]" aria-hidden="true" />
          ))}
        </div>
        <p className="mt-3.5 font-display italic text-[15px] text-navy/45 leading-snug">
          Photographs shown with explicit patient permission. Identities are not disclosed.
        </p>
      </div>

      {/* Section 2 — what patients say */}
      <div>
        <h2 className="font-display font-semibold text-[22px] leading-[1.14] text-navy mb-3">
          What patients say
        </h2>
        <div className="flex flex-col gap-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.attribution}
              className="relative rounded-xl bg-cream border border-navy/10 shadow-card pt-7 pb-4 px-5"
            >
              <span
                aria-hidden="true"
                className="absolute left-4 top-0 font-display text-[44px] leading-none text-navy/15 select-none"
              >
                &ldquo;
              </span>
              <blockquote className="text-[13.5px] text-navy/80 leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/45">
                {t.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Section 3 — credentials */}
      <div>
        <h2 className="font-display font-semibold text-[22px] leading-[1.14] text-navy mb-3">
          Credentials
        </h2>
        <div className="flex flex-wrap gap-2">
          {CREDENTIALS.map((c) => (
            <span
              key={c}
              className="px-3 py-1.5 rounded-full border border-navy/10 bg-white text-[10.5px] font-semibold uppercase tracking-[0.08em] text-navy/60"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
    </div>
  )
}
