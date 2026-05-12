// Brand color driven by siteConfig.primaryColor + primaryColorDark via inline
// gradient. Other UI uses static Tailwind navy/ink palette. Full theming
// deferred to post-launch.
import { siteConfig } from '../siteConfig.js'

export default function Banner() {
  return (
    <div
      className="flex items-center justify-between text-white px-5 py-4"
      style={{
        background: `linear-gradient(135deg, ${siteConfig.primaryColor}, ${siteConfig.primaryColorDark})`,
      }}
    >
      {siteConfig.logoUrl ? (
        <img
          src={siteConfig.logoUrl}
          alt={siteConfig.brandName}
          className="h-7 w-auto max-h-7 object-contain"
        />
      ) : (
        <span className="font-display font-semibold text-2xl leading-none tracking-[-0.01em]">
          {siteConfig.brandName}
        </span>
      )}
      <span className="text-[10px] font-semibold tracking-[0.2em] text-white/60">
        BOOK YOUR VISIT
      </span>
    </div>
  )
}
