import { Calendar as CalIcon, CheckCircle2, RotateCcw } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { findService, PRACTITIONER, CONSULTATION_FEE, SAME_DAY_DEPOSIT } from '../mockData.js'
import { siteConfig } from '../siteConfig.js'
import { getCheckoutScenario, isConsultFlow } from '../state/pathUtils.js'
import { formatLongDate, formatTime12h, formatPriceUSD } from '../utils/format.js'
import { buildICS, downloadICS } from '../utils/ics.js'
import EmailPreview from '../components/EmailPreview.jsx'

export default function Confirmation() {
  const { state, reset } = useBooking()
  const service = findService(state.serviceId)
  const consult = isConsultFlow(state)
  const scenario = getCheckoutScenario(state)
  const sameDay = consult && state.sameDayProcedure === true

  const dateObj = state.selectedDateKey
    ? new Date(state.selectedDateKey + 'T12:00:00')
    : null
  const slotLabel = state.selectedSlotTime ? formatTime12h(state.selectedSlotTime) : ''

  const formatLine = consult
    ? state.consultFormat === 'virtual'
      ? 'Virtual consultation'
      : 'In-person consultation'
    : 'Service appointment'

  const totalPaid =
    scenario === 'A' ? CONSULTATION_FEE : scenario === 'B' ? CONSULTATION_FEE + SAME_DAY_DEPOSIT : 0

  const locationLine =
    consult && state.consultFormat === 'virtual'
      ? 'Virtual link will be emailed'
      : `${siteConfig.practiceName} · ${siteConfig.practiceAddress}`

  function handleDownloadICS() {
    if (!service || !dateObj || !state.selectedSlotTime) return
    const [hh, mm] = state.selectedSlotTime.split(':').map(Number)
    const start = new Date(dateObj)
    start.setHours(hh, mm, 0, 0)
    const end = new Date(start)
    // Add the service duration plus same-day buffer if applicable
    const minutes =
      service.durationMin + (sameDay ? service.durationMin : 0)
    end.setMinutes(end.getMinutes() + minutes)
    const summary = consult
      ? `${service.name} consultation with ${PRACTITIONER.shortName}`
      : `${service.name} with ${PRACTITIONER.shortName}`
    const description =
      (consult
        ? `Consultation (${state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person'})`
        : `Service appointment`) +
      (sameDay ? `\nSame-day procedure reserved.` : '') +
      `\nProvider: ${PRACTITIONER.name}` +
      `\nContact: ${siteConfig.practicePhone}`
    const uid = `booking-${state.serviceId}-${state.selectedDateKey}-${state.selectedSlotTime}@rivr.local`
    const ics = buildICS({
      uid,
      summary,
      description,
      location: locationLine,
      startLocal: start,
      endLocal: end
    })
    downloadICS(`${service.id}-${state.selectedDateKey}.ics`, ics)
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div className="text-center pt-2">
        <div className="mx-auto h-12 w-12 rounded-full bg-navy/5 flex items-center justify-center text-navy">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="font-display font-medium text-[26px] text-navy mt-3">You're booked!</h2>
        {state.intake.email && (
          <p className="text-xs text-navy/60 mt-1">
            A confirmation has been sent to{' '}
            <span className="font-semibold text-navy">{state.intake.email}</span>
          </p>
        )}
      </div>

      <div className="rounded-lg border border-sand-200 bg-cream/40 p-4 space-y-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
            Appointment
          </div>
          <div className="mt-1 text-sm font-semibold text-navy">{service?.name}</div>
          <div className="text-[11px] text-navy/70">
            {formatLine} with {PRACTITIONER.shortName}
          </div>
          {dateObj && (
            <div className="text-[11px] text-navy/70">
              {formatLongDate(dateObj)} · {slotLabel} (ET)
            </div>
          )}
          <div className="text-[11px] text-navy/70 mt-1">{locationLine}</div>
        </div>

        <div className="border-t border-sand-200 pt-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
            Payment
          </div>
          {totalPaid > 0 ? (
            <div className="text-[11px] text-navy/70 mt-1">
              {formatPriceUSD(totalPaid)} paid today · card ending in{' '}
              {state.payment.last4 || '••••'}
            </div>
          ) : (
            <div className="text-[11px] text-navy/70 mt-1">
              No charge today · card on file ending in {state.payment.last4 || '••••'}
            </div>
          )}
          {scenario !== 'C' && (
            <div className="text-[11px] text-navy/70">Card on file for post-visit billing</div>
          )}
          {sameDay && (
            <div className="text-[11px] text-navy/70 font-medium">
              Same-day procedure reserved
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDownloadICS}
          className="w-full py-2.5 rounded-lg bg-white text-navy text-sm font-semibold border border-navy/20 hover:bg-sand-100 transition-colors active:scale-[0.99] inline-flex items-center justify-center gap-2"
        >
          <CalIcon size={14} />
          Add to Calendar
        </button>
        <button
          type="button"
          onClick={reset}
          className="w-full py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-600 transition-colors active:scale-[0.99] inline-flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Book Another Appointment
        </button>
      </div>

      <div className="border-t border-sand-200 pt-4 mt-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50 mb-2">
          Confirmation emails
        </div>
        <div className="flex flex-col gap-3">
          <PatientEmail state={state} service={service} consult={consult} sameDay={sameDay} totalPaid={totalPaid} locationLine={locationLine} slotLabel={slotLabel} dateObj={dateObj} />
          <SpaEmail state={state} service={service} consult={consult} sameDay={sameDay} totalPaid={totalPaid} slotLabel={slotLabel} dateObj={dateObj} />
        </div>
      </div>
    </div>
  )
}

function PatientEmail({ state, service, consult, sameDay, totalPaid, locationLine, slotLabel, dateObj }) {
  const subject = consult
    ? `Your ${service?.name} consultation with ${PRACTITIONER.shortName}`
    : `Your ${service?.name} appointment with ${PRACTITIONER.shortName}`
  return (
    <EmailPreview
      from={`${siteConfig.practiceName} <${siteConfig.emailSenderAddress}>`}
      to={`${state.intake.fullName || 'Patient'} <${state.intake.email}>`}
      subject={subject}
    >
      <p>
        Hi {state.intake.fullName?.split(' ')[0] || 'there'} — you're confirmed.
      </p>
      <p>
        <strong>{service?.name}</strong>
        <br />
        {dateObj && <>{formatLongDate(dateObj)} · {slotLabel} (ET)</>}
        <br />
        {locationLine}
        <br />
        Provider: {PRACTITIONER.name}
      </p>
      {totalPaid > 0 ? (
        <p>
          Receipt: {formatPriceUSD(totalPaid)} charged to card ending in{' '}
          {state.payment.last4 || '••••'}.
        </p>
      ) : (
        <p>
          No charge today. Your card ending in {state.payment.last4 || '••••'} is on file —
          {service ? ` ${formatPriceUSD(service.priceUSD)}` : ''} will be charged after your
          visit.
        </p>
      )}
      {sameDay && (
        <p>
          <strong>Same-day procedure reserved.</strong> Your $150 deposit is non-refundable but
          may be applied to any approved service within 12 months if Dr. Chen determines this
          procedure isn't right for you.
        </p>
      )}
      <p>
        <strong>What to expect:</strong>{' '}
        {consult
          ? state.consultFormat === 'virtual'
            ? "We'll email a secure video link 30 minutes before your appointment."
            : 'Please arrive 10 minutes early so we can check you in.'
          : 'Please arrive 10 minutes early so we can check you in.'}
      </p>
      <p>
        To cancel or reschedule, please call us at{' '}
        <strong>{siteConfig.practicePhone}</strong>. Cancellations cannot be processed by email.
      </p>
      <p style={{ color: '#0B1E3F99' }}>— {siteConfig.practiceName}</p>
    </EmailPreview>
  )
}

function SpaEmail({ state, service, consult, sameDay, totalPaid, slotLabel, dateObj }) {
  return (
    <EmailPreview
      from={`${siteConfig.emailSenderName} <${siteConfig.emailSenderAddress}>`}
      to={`${siteConfig.practiceName} <${siteConfig.spaInboxAddress}>`}
      subject={`New booking: ${service?.name} — ${state.intake.fullName || 'Patient'}`}
    >
      <p>
        <strong>New appointment booked.</strong>
      </p>
      <p>
        <strong>Patient:</strong> {state.intake.fullName}
        <br />
        <strong>Email:</strong> {state.intake.email}
        <br />
        <strong>Phone:</strong> {state.intake.phone}
        <br />
        <strong>DOB:</strong> {state.intake.dob}
        <br />
        <strong>How they heard:</strong> {state.intake.hearAbout}
      </p>
      <p>
        <strong>Service:</strong> {service?.name}
        <br />
        <strong>Type:</strong>{' '}
        {consult
          ? `Consultation (${state.consultFormat === 'virtual' ? 'Virtual' : 'In-Person'})`
          : 'Direct service appointment'}
        <br />
        <strong>When:</strong>{' '}
        {dateObj ? formatLongDate(dateObj) : ''} · {slotLabel} (ET)
        <br />
        <strong>Provider:</strong> {PRACTITIONER.name}
      </p>
      {state.intake.reason && (
        <p>
          <strong>Goals / reason:</strong> {state.intake.reason}
        </p>
      )}
      {state.intake.conditions && (
        <p>
          <strong>Allergies / medications / conditions:</strong> {state.intake.conditions}
        </p>
      )}
      <p>
        <strong>Payment status:</strong>{' '}
        {totalPaid > 0
          ? `${formatPriceUSD(totalPaid)} collected (consultation${sameDay ? ' + same-day deposit' : ''}) on card ending ${state.payment.last4 || '••••'}.`
          : `No charge collected. Card ending ${state.payment.last4 || '••••'} held on file.`}
        {sameDay && <><br /><strong>Same-day procedure flagged — reserve extra time.</strong></>}
        <br />
        <strong>Card on file:</strong>{' '}
        {state.payment.last4 ? `Yes (ending ${state.payment.last4})` : 'No'} — bill any
        post-visit charges directly.
      </p>
    </EmailPreview>
  )
}
