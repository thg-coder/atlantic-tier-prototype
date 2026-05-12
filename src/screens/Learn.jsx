import { Lock } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { siteConfig } from '../siteConfig.js'
import { PrimaryButton } from '../components/Buttons.jsx'

// The procedure-specific testimonial folded down from the Phase C Trust screen.
// For the prototype this same quote renders for every procedure — real onboarding
// would supply a procedure-matched testimonial. Initials + age only.
const PROCEDURE_TESTIMONIAL = {
  attribution: 'J.K., age 56',
  quote:
    'I had consulted with three surgeons before this one. The difference was specificity. She told me what she could realistically achieve and what was outside the technique. I trusted her because of what she declined to promise.',
}

function GatedGallery() {
  return (
    <div className="rounded-xl bg-cream border border-navy/10 shadow-card px-5 py-7 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-navy/[0.06] text-navy/55">
        <Lock size={18} aria-hidden="true" />
      </span>
      <div className="mt-3 font-display font-semibold text-[18px] text-navy">
        Before / after gallery
      </div>
      <p className="mt-1.5 mx-auto max-w-[320px] text-[12.5px] text-navy/55 leading-relaxed">
        Photographs are reviewed during your consultation to protect patient privacy. Selected
        work will be shared in person when relevant to your procedure.
      </p>
    </div>
  )
}

function PublicGallery() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] rounded-lg bg-navy/[0.06]" aria-hidden="true" />
        ))}
      </div>
      <p className="mt-3.5 font-display italic text-[15px] text-navy/45 leading-snug">
        Photographs shown with explicit patient permission. Identities are not disclosed.
      </p>
    </div>
  )
}

export default function Learn() {
  const { state, goNext } = useBooking()
  const details =
    siteConfig.procedureDetails?.[state.intake.procedureInterest] ||
    siteConfig.procedureDetails?.comprehensive ||
    { label: 'Your consultation', education: [], whatToExpect: [] }

  const galleryMode = siteConfig.galleryMode || 'gated'

  return (
    <div className="screen-enter flex flex-col gap-7">
      <div>
        <h2 className="font-display font-semibold text-[30px] leading-[1.1] text-navy">
          {details.label}
        </h2>
        <p className="mt-1.5 text-[13px] text-navy/60 leading-relaxed">Here’s what to expect.</p>
      </div>

      {/* Section 1 — about this procedure */}
      {details.education?.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-[20px] leading-[1.16] text-navy mb-3">
            About this procedure
          </h3>
          <div className="prose-editorial space-y-4 text-[14.5px] text-navy/70">
            {details.education.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      )}

      {/* Section 2 — what to expect */}
      {details.whatToExpect?.length > 0 && (
        <div>
          <hr className="hairline mb-6" />
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45 mb-3">
            What to expect
          </div>
          <ul className="space-y-2.5">
            {details.whatToExpect.map((item, i) => (
              <li key={i} className="flex gap-3 text-[13.5px] text-navy/70 leading-relaxed">
                <span aria-hidden="true" className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-navy/35" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 3 — selected work (gated by default) */}
      {galleryMode !== 'hidden' && (
        <div>
          <hr className="hairline mb-6" />
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45 mb-3">
            Selected work
          </div>
          {galleryMode === 'public' ? <PublicGallery /> : <GatedGallery />}
        </div>
      )}

      {/* Section 4 — procedure-specific testimonial */}
      <div>
        <hr className="hairline mb-6" />
        <figure className="relative rounded-xl bg-cream border border-navy/10 shadow-card pt-7 pb-4 px-5">
          <span
            aria-hidden="true"
            className="absolute left-4 top-0 font-display text-[44px] leading-none text-navy/15 select-none"
          >
            &ldquo;
          </span>
          <blockquote className="text-[13.5px] text-navy/80 leading-relaxed">
            {PROCEDURE_TESTIMONIAL.quote}
          </blockquote>
          <figcaption className="mt-3 font-display italic text-[14px] text-navy/45">
            — {PROCEDURE_TESTIMONIAL.attribution}
          </figcaption>
        </figure>
      </div>

      <PrimaryButton onClick={goNext}>Continue to consultation request</PrimaryButton>
    </div>
  )
}
