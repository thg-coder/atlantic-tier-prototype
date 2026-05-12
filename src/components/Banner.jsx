// Brand color driven by siteConfig.primaryColor + primaryColorDark via inline
// gradient (with a subtle radial highlight for depth). Other UI uses the static
// Tailwind navy/sand/ink palette. Full Tailwind theming deferred to post-launch.
import { siteConfig } from '../siteConfig.js'

export default function Banner() {
  return (
    <div
      className="relative overflow-hidden flex items-center justify-between text-white px-6 py-5"
      style={{
        backgroundColor: siteConfig.primaryColorDark,
        backgroundImage:
          `radial-gradient(120% 140% at 18% 0%, rgba(255,255,255,0.12), rgba(255,255,255,0) 55%), ` +
          `linear-gradient(135deg, ${siteConfig.primaryColor}, ${siteConfig.primaryColorDark})`,
      }}
    >
      {siteConfig.logoUrl ? (
        <img
          src={siteConfig.logoUrl}
          alt={siteConfig.brandName}
          className="relative h-7 w-auto max-h-7 object-contain"
        />
      ) : (
        <span className="relative font-display font-semibold text-[26px] leading-none tracking-[0.005em]">
          {siteConfig.brandName}
        </span>
      )}
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
        Book your visit
      </span>
    </div>
  )
}
