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
    <div className="screen-enter flex flex-col gap-6">
      {/* Section 1 — selected work */}
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          Selected work
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-gray-200" aria-hidden="true" />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-navy/50">
          Photographs shown with explicit patient permission. Identities are not disclosed.
        </p>
      </div>

      {/* Section 2 — what patients say */}
      <div>
        <h2 className="font-display font-medium text-[20px] text-navy mb-2 leading-tight">
          What patients say
        </h2>
        <div className="flex flex-col gap-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.attribution} className="rounded-lg bg-cream border border-sand-200 p-4">
              <p className="text-sm text-navy/80 leading-relaxed italic">“{t.quote}”</p>
              <p className="mt-2 text-xs font-semibold text-navy/60">— {t.attribution}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — credentials */}
      <div>
        <h2 className="font-display font-medium text-[20px] text-navy mb-2 leading-tight">
          Credentials
        </h2>
        <div className="flex flex-wrap gap-2">
          {CREDENTIALS.map((c) => (
            <span
              key={c}
              className="px-3 py-1.5 rounded-full bg-navy/5 text-xs font-medium text-navy/80"
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
