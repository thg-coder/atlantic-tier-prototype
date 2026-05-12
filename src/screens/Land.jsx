import { useBooking } from '../state/BookingContext.jsx'
import { siteConfig } from '../siteConfig.js'
import { PrimaryButton } from '../components/Buttons.jsx'

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
        <PrimaryButton onClick={goNext}>Begin</PrimaryButton>
      </div>
    </div>
  )
}
