import { useBooking } from '../state/BookingContext.jsx'
import { siteConfig } from '../siteConfig.js'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function Land() {
  const { goNext } = useBooking()

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="font-display font-medium text-[28px] text-navy leading-tight">
          {siteConfig.practitionerName}
        </h1>
        <p className="mt-2 text-sm text-navy/70 leading-relaxed">
          A practice built on training, judgment, and the privilege of being chosen carefully.
        </p>
      </div>

      {siteConfig.heroImageUrl ? (
        <img
          src={siteConfig.heroImageUrl}
          alt=""
          className="w-full aspect-[4/3] object-cover rounded-xl"
        />
      ) : (
        <div className="w-full aspect-[4/3] rounded-xl bg-gray-200" aria-hidden="true" />
      )}

      {siteConfig.signatureProcedures?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {siteConfig.signatureProcedures.map((p) => (
            <span
              key={p}
              className="px-3 py-1.5 rounded-full bg-cream border border-sand-200 text-xs font-medium text-navy/80"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-navy/70 leading-relaxed">{siteConfig.landingBio}</p>

      <div>
        <p className="text-[11px] text-navy/50 mb-2">
          Consultations are conducted in person or virtually, by appointment.
        </p>
        <PrimaryButton onClick={goNext}>Begin</PrimaryButton>
      </div>
    </div>
  )
}
