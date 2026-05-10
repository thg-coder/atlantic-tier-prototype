import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <div className="mt-auto border-t border-sand-200 px-5 py-3 flex items-center justify-between text-[11px] text-navy/60">
      <span className="font-medium tracking-wide">Powered by RIVR</span>
      <span className="inline-flex items-center gap-1">
        <ShieldCheck size={12} aria-hidden="true" />
        HIPAA-compliant data handling
      </span>
    </div>
  )
}
