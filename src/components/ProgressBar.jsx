import { useBooking } from '../state/BookingContext.jsx'
import { PATH_STEPS, STEP, STEP_LABELS } from '../state/pathUtils.js'

export default function ProgressBar() {
  const { stepIndex, state } = useBooking()

  // Terminal screen has no progress bar.
  if (state.currentStep === STEP.CONFIRMATION) return null

  const total = PATH_STEPS.length // always 6
  const current = stepIndex + 1
  const currentLabel = STEP_LABELS[state.currentStep] || ''
  const pct = Math.round((current / total) * 100)

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Step ${current} of ${total}: ${currentLabel}`}
      className="px-6 pt-4 pb-3.5"
    >
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
          Step {current} of {total}
        </span>
        <span className="text-[11px] font-medium text-navy/65">{currentLabel}</span>
      </div>
      <div className="h-[3px] rounded-full bg-navy/8 overflow-hidden" aria-hidden="true">
        <div
          className="h-full rounded-full bg-navy transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
