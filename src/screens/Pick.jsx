import { useBooking } from '../state/BookingContext.jsx'
import { siteConfig } from '../siteConfig.js'
import ChoiceCard from '../components/ChoiceCard.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

const COMPREHENSIVE_ID = 'comprehensive'

export default function Pick() {
  const { state, dispatch, goNext } = useBooking()
  const selected = state.intake.procedureInterest

  // Procedure cards in the explicit siteConfig.procedureOrder, skipping any id
  // that lacks a procedureDetails entry. The 'comprehensive' fallback is never
  // in procedureOrder — it's rendered separately below the divider.
  const detailsMap = siteConfig.procedureDetails || {}
  const order = siteConfig.procedureOrder || Object.keys(detailsMap).filter((id) => id !== COMPREHENSIVE_ID)
  const procedures = order
    .filter((id) => id !== COMPREHENSIVE_ID && detailsMap[id])
    .map((id) => [id, detailsMap[id]])
  const comprehensive = detailsMap[COMPREHENSIVE_ID]

  function pick(id) {
    if (selected === id) return
    dispatch({ type: 'UPDATE_INTAKE', patch: { procedureInterest: id } })
  }

  return (
    <div className="screen-enter flex flex-col gap-6">
      <div>
        <h2 className="font-display font-semibold text-[28px] leading-[1.12] text-navy">
          What brings you in?
        </h2>
        <p className="mt-1.5 text-[13px] text-navy/60 leading-relaxed">
          Select the area you’re considering. We’ll tailor the rest of your visit to that.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {procedures.map(([id, details]) => (
          <ChoiceCard
            key={id}
            title={details.label}
            description={details.descriptionShort}
            imageUrl={siteConfig.procedureCardImages?.[id]}
            selected={selected === id}
            onClick={() => pick(id)}
          />
        ))}
      </div>

      {comprehensive && (
        <>
          <hr className="hairline" />
          <ChoiceCard
            title="Comprehensive consultation"
            description="Multiple concerns or unsure where to begin — we’ll discuss your options in depth."
            imageUrl={siteConfig.procedureCardImages?.[COMPREHENSIVE_ID]}
            selected={selected === COMPREHENSIVE_ID}
            onClick={() => pick(COMPREHENSIVE_ID)}
          />
        </>
      )}

      <PrimaryButton onClick={goNext} disabled={!selected}>
        Continue
      </PrimaryButton>
    </div>
  )
}
