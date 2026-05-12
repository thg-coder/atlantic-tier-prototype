import { UserCheck, UserPlus } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { findService } from '../mockData.js'
import ChoiceCard from '../components/ChoiceCard.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function ReturningGate() {
  const { state, dispatch, goNext } = useBooking()
  const service = findService(state.serviceId)

  function pick(value) {
    if (state.isReturningPatient === value) return // same option already selected
    dispatch({ type: 'SET_RETURNING', value })
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          Have you been seen here before?
        </h2>
        {service && (
          <p className="text-xs text-navy/60">
            Service: <span className="font-medium text-navy">{service.name}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <ChoiceCard
          icon={<UserCheck size={20} />}
          title="Yes, I've been here before"
          description="I have been seen here before."
          selected={state.isReturningPatient === true}
          onClick={() => pick(true)}
        />
        <ChoiceCard
          icon={<UserPlus size={20} />}
          title="No, I'm new here"
          description="I have not been seen here before."
          selected={state.isReturningPatient === false}
          onClick={() => pick(false)}
        />
      </div>

      <p className="text-[11px] text-navy/50 leading-relaxed">
        This helps us prepare for your visit.
      </p>

      <PrimaryButton
        onClick={goNext}
        disabled={state.isReturningPatient === null || state.isReturningPatient === undefined}
      >
        Continue
      </PrimaryButton>
    </div>
  )
}
