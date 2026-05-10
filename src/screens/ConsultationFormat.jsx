import { Video, MapPin } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { findService } from '../mockData.js'
import ChoiceCard from '../components/ChoiceCard.jsx'

export default function ConsultationFormat() {
  const { state, dispatch, goNext } = useBooking()
  const service = findService(state.serviceId)
  const inPersonOnly = !!service?.inPersonConsultOnly

  function pick(format) {
    if (format === 'virtual' && inPersonOnly) return
    dispatch({ type: 'SET_FORMAT', format })
    setTimeout(goNext, 100)
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl text-navy mb-1">Choose a consultation format</h2>
        {service && (
          <p className="text-xs text-navy/60">
            For your consultation on{' '}
            <span className="font-medium text-navy">{service.name}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <ChoiceCard
          icon={<Video size={20} />}
          title="Virtual Consultation"
          description="Meet with Dr. Chen by secure video — convenient and from anywhere."
          selected={state.consultFormat === 'virtual'}
          disabled={inPersonOnly}
          disabledNote={inPersonOnly ? 'In-person required for this service.' : undefined}
          onClick={() => pick('virtual')}
        />
        <ChoiceCard
          icon={<MapPin size={20} />}
          title="In-Person Consultation"
          description="Visit the spa to meet Dr. Chen and discuss your goals in person."
          selected={state.consultFormat === 'in-person'}
          onClick={() => pick('in-person')}
        />
      </div>
    </div>
  )
}
