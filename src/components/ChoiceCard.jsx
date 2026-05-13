export default function ChoiceCard({
  title,
  description,
  selected,
  disabled,
  disabledNote,
  icon,
  badge,
  imageUrl,
  onClick
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected || undefined}
      className={
        'w-full text-left rounded-xl border overflow-hidden transition-all duration-150 ease-out ' +
        (disabled
          ? 'bg-sand-100/70 border-navy/8 cursor-not-allowed '
          : selected
            ? 'bg-navy text-white border-navy shadow-card-active '
            : 'bg-white border-navy/10 shadow-card hover:border-navy/20 hover:shadow-card-hover active:scale-[0.99] active:shadow-card-active ')
      }
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-full aspect-[4/3] object-cover"
        />
      )}
      <div className="p-5">
        <div className="flex items-start gap-3.5">
          {icon && (
            <div
              className={
                'mt-0.5 flex-shrink-0 ' +
                (selected ? 'text-white/85' : disabled ? 'text-navy/25' : 'text-navy/65')
              }
            >
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div
              className={
                'text-sm font-semibold inline-flex items-center gap-2 ' +
                (selected ? 'text-white' : disabled ? 'text-navy/45' : 'text-navy')
              }
            >
              {title}
              {badge && (
                <span
                  className={
                    'px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.08em] ' +
                    (selected ? 'bg-white/20 text-white' : 'bg-navy/8 text-navy/65')
                  }
                >
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <div
                className={
                  'mt-1 text-xs leading-relaxed ' +
                  (selected ? 'text-white/75' : disabled ? 'text-navy/35' : 'text-navy/55')
                }
              >
                {description}
              </div>
            )}
            {disabled && disabledNote && (
              <div className="mt-2 text-[11px] font-medium text-navy/45 italic">
                {disabledNote}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
