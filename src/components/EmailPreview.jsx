export default function EmailPreview({ from, to, subject, children }) {
  return (
    <div className="rounded-lg border border-sand-200 bg-white overflow-hidden">
      <div className="bg-sand-100 px-4 py-2 border-b border-sand-200 text-[10px] text-navy/70 space-y-0.5">
        <div>
          <span className="font-semibold text-navy/80">From:</span> {from}
        </div>
        <div>
          <span className="font-semibold text-navy/80">To:</span> {to}
        </div>
        <div>
          <span className="font-semibold text-navy/80">Subject:</span>{' '}
          <span className="text-navy">{subject}</span>
        </div>
      </div>
      <div className="px-4 py-3 text-[12px] text-navy/80 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}
