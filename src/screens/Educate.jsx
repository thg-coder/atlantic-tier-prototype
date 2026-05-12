import { useBooking } from '../state/BookingContext.jsx'
import { siteConfig } from '../siteConfig.js'
import { PrimaryButton } from '../components/Buttons.jsx'
import { formatPriceUSD } from '../utils/format.js'

export default function Educate() {
  const { goNext } = useBooking()
  const { pricingVisibility } = siteConfig

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          About the procedure
        </h2>
        <p className="text-xs text-navy/60">[Procedure name — placeholder.]</p>
      </div>

      <div className="space-y-3 text-sm text-navy/70 leading-relaxed">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
        </p>
      </div>

      <div className="rounded-lg bg-cream border border-sand-200 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60 mb-1">
          What to expect
        </div>
        <p className="text-xs text-navy/80 leading-relaxed">
          [Placeholder — what happens during the consultation, what the procedure itself
          involves, recovery, and follow-up. Real copy comes from the client during onboarding.]
        </p>
      </div>

      {pricingVisibility === 'show' && (
        <div className="text-sm text-navy/80">
          <span className="font-semibold">Investment:</span> {formatPriceUSD(0)} – {formatPriceUSD(0)}
          {' '}
          <span className="text-navy/50">[placeholder range]</span>
        </div>
      )}
      {pricingVisibility === 'starting_at' && (
        <div className="text-sm text-navy/80">
          <span className="font-semibold">Starting at</span> {formatPriceUSD(0)}{' '}
          <span className="text-navy/50">[placeholder]</span>
        </div>
      )}

      <PrimaryButton onClick={goNext}>I’m interested</PrimaryButton>
    </div>
  )
}
