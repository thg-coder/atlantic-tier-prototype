import { useBooking } from '../state/BookingContext.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

// Phase B: placeholder content — the prototype shows the structure, not real
// content. Anonymous initials only; Atlantic respects patient privacy.
const TESTIMONIALS = [
  {
    initials: 'A.M.',
    quote:
      '[Anonymous patient testimonial — placeholder copy describing a positive experience with the practice.]',
  },
  {
    initials: 'J.K.',
    quote:
      '[Anonymous patient testimonial — placeholder copy describing a positive experience with the practice.]',
  },
]

const CREDENTIALS = ['Board Certified', '[Society] Member', 'Years in Practice']

export default function Trust() {
  const { goNext } = useBooking()

  return (
    <div className="screen-enter flex flex-col gap-6">
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          Our work
        </h2>
        <p className="text-xs text-navy/60">[Section intro — placeholder copy.]</p>
      </div>

      {/* Section 1 — before/after gallery */}
      <div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-gray-200" aria-hidden="true" />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-navy/50">
          Selected work — names and details withheld for patient privacy.
        </p>
      </div>

      {/* Section 2 — testimonials */}
      <div className="flex flex-col gap-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.initials} className="rounded-lg bg-cream border border-sand-200 p-4">
            <p className="text-sm text-navy/80 leading-relaxed italic">“{t.quote}”</p>
            <p className="mt-2 text-xs font-semibold text-navy/60">— {t.initials}</p>
          </div>
        ))}
      </div>

      {/* Section 3 — credentials */}
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

      <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
    </div>
  )
}
