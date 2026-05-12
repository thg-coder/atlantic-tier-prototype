import { useBooking } from '../state/BookingContext.jsx'
import { siteConfig } from '../siteConfig.js'
import { PrimaryButton } from '../components/Buttons.jsx'

// The single anonymized testimonial folded down from the Phase C Trust screen.
// Initials + age only — Atlantic privacy posture. Replaced at onboarding.
const LAND_TESTIMONIAL = {
  attribution: 'A.M., age 42',
  quote:
    "The consultation didn't feel like a sales conversation. She explained what she'd recommend, what she wouldn't, and why. I felt informed rather than sold to.",
}

export default function Land() {
  const { goNext } = useBooking()

  return (
    <div className="screen-enter flex flex-col gap-6">
      <div>
        <h1 className="font-display font-semibold text-[34px] leading-[1.1] text-navy">
          {siteConfig.practitionerName}
        </h1>
        <p className="mt-2.5 text-[15px] text-navy/65 leading-relaxed">
          A practice built on training, judgment, and the privilege of being chosen carefully.
        </p>
      </div>

      {siteConfig.heroImageUrl ? (
        <img
          src={siteConfig.heroImageUrl}
          alt=""
          className="w-full aspect-[4/3] object-cover rounded-xl shadow-card"
        />
      ) : (
        <div className="w-full aspect-[4/3] rounded-xl bg-navy/[0.06]" aria-hidden="true" />
      )}

      {/* Inline trust signals — small, editorial, stacked vertically (not cards in a row). */}
      <div className="flex flex-col gap-7 py-1">
        {/* 1 — credential */}
        {siteConfig.credentials?.[0] && (
          <div className="flex justify-center">
            <span className="px-3.5 py-1.5 rounded-full border border-navy/10 bg-white text-[10.5px] font-semibold uppercase tracking-[0.1em] text-navy/60">
              {siteConfig.credentials[0]}
            </span>
          </div>
        )}

        {/* 2 — anonymized pull-quote */}
        <figure className="relative rounded-xl bg-cream border border-navy/10 shadow-card pt-7 pb-4 px-5">
          <span
            aria-hidden="true"
            className="absolute left-4 top-0 font-display text-[44px] leading-none text-navy/15 select-none"
          >
            &ldquo;
          </span>
          <blockquote className="text-[13.5px] text-navy/80 leading-relaxed">
            {LAND_TESTIMONIAL.quote}
          </blockquote>
          <figcaption className="mt-3 font-display italic text-[14px] text-navy/45">
            — {LAND_TESTIMONIAL.attribution}
          </figcaption>
        </figure>

        {/* 3 — years-in-practice stat */}
        <div className="flex items-start justify-center gap-9 text-center">
          <div>
            <div className="font-display font-semibold text-[28px] leading-none text-navy">
              {siteConfig.yearsInPractice}
            </div>
            <div className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-navy/45">
              years in practice
            </div>
          </div>
          <div>
            <div className="font-display font-semibold text-[28px] leading-none text-navy">
              {siteConfig.consultationCount}
            </div>
            <div className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-navy/45">
              consultations
            </div>
          </div>
        </div>
      </div>

      {siteConfig.signatureProcedures?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {siteConfig.signatureProcedures.map((p) => (
            <span
              key={p}
              className="px-3 py-1.5 rounded-full bg-cream border border-navy/10 text-[11px] font-medium text-navy/70 tracking-[0.01em]"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      <p className="text-[14px] text-navy/65 leading-relaxed">{siteConfig.landingBio}</p>

      <div>
        <p className="text-[11px] text-navy/45 mb-2.5 leading-relaxed">
          Consultations are conducted in person or virtually, by appointment.
        </p>
        <PrimaryButton onClick={goNext}>Begin a conversation</PrimaryButton>
      </div>
    </div>
  )
}
