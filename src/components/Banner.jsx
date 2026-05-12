import { siteConfig } from '../siteConfig.js'

export default function Banner() {
  return (
    <div className="flex items-center justify-between bg-navy text-white px-5 py-4">
      <span className="font-display font-semibold text-2xl leading-none tracking-[-0.01em]">
        {siteConfig.brandName}
      </span>
      <span className="text-[10px] font-semibold tracking-[0.2em] text-sand-300">
        BOOK YOUR VISIT
      </span>
    </div>
  )
}
