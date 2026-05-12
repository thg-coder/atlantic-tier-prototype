import { useBooking } from '../state/BookingContext.jsx'
import { PATH_STEPS, STEP, STEP_LABELS } from '../state/pathUtils.js'

export default function ProgressBar() {
  const { stepIndex, state } = useBooking()

  // Terminal screen has no progress bar.
  if (state.currentStep === STEP.CONFIRMATION) return null

  const total = PATH_STEPS.length // always 6
  const current = stepIndex + 1
  const currentLabel = STEP_LABELS[state.currentStep] || ''

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Step ${current} of ${total}: ${currentLabel}`}
      className="px-5 pt-4 pb-3"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
          Step {current} of {total}
        </span>
        <span className="text-[11px] font-medium text-navy/70">{currentLabel}</span>
      </div>
      <div className="flex gap-1" aria-hidden="true">
        {PATH_STEPS.map((s, i) => {
          const reached = i <= stepIndex
          return (
            <div
              key={s}
              className={
                'h-1.5 flex-1 rounded-full transition-colors ' +
                (reached ? 'bg-navy' : 'bg-sand-200')
              }
            />
          )
        })}
      </div>
    </div>
  )
}
