export default function ChoiceCard({
  title,
  description,
  selected,
  disabled,
  disabledNote,
  icon,
  onClick
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        'w-full text-left rounded-xl border p-4 transition-all ' +
        (disabled
          ? 'bg-sand-100/60 border-sand-200 cursor-not-allowed opacity-60 '
          : selected
            ? 'bg-navy text-white border-navy shadow-md '
            : 'bg-white border-sand-200 hover:border-navy/40 active:scale-[0.99] ')
      }
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={
              'mt-0.5 flex-shrink-0 ' +
              (selected ? 'text-sand-300' : disabled ? 'text-navy/30' : 'text-navy/70')
            }
          >
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div
            className={
              'text-sm font-semibold ' +
              (selected ? 'text-white' : disabled ? 'text-navy/50' : 'text-navy')
            }
          >
            {title}
          </div>
          {description && (
            <div
              className={
                'mt-1 text-xs leading-relaxed ' +
                (selected ? 'text-white/80' : disabled ? 'text-navy/40' : 'text-navy/60')
              }
            >
              {description}
            </div>
          )}
          {disabled && disabledNote && (
            <div className="mt-2 text-[11px] font-medium text-navy/50 italic">
              {disabledNote}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
