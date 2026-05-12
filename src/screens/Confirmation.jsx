import { Calendar as CalIcon, CheckCircle2 } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { findService, CONSULTATION_FEE } from '../mockData.js'
import { siteConfig } from '../siteConfig.js'
import { formatLongDate, formatTime12h, formatPriceUSD } from '../utils/format.js'
import { buildICS, downloadICS } from '../utils/ics.js'
import EmailPreview from '../components/EmailPreview.jsx'

const CONSULT_BLOCK_MINUTES = 45

export default function Confirmation() {
  const { state, reset } = useBooking()
  const service = findService(state.intake.procedureInterest)
  const procName = service?.name || 'your procedure'
  const virtual = state.consultFormat === 'virtual'
  const formatLabel = virtual ? 'Virtual consultation' : 'In-person consultation'

  const dateObj = state.selectedDateKey ? new Date(state.selectedDateKey + 'T12:00:00') : null
  const slotLabel = state.selectedSlotTime ? formatTime12h(state.selectedSlotTime) : ''

  const locationLine = virtual
    ? 'Virtual link will be emailed'
    : `${siteConfig.practiceName} · ${siteConfig.practiceAddress}`

  const firstName = state.intake.fullName?.split(' ')[0] || 'there'

  function handleDownloadICS() {
    if (!dateObj || !state.selectedSlotTime) return
    const [hh, mm] = state.selectedSlotTime.split(':').map(Number)
    const start = new Date(dateObj)
    start.setHours(hh, mm, 0, 0)
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + CONSULT_BLOCK_MINUTES)
    const summary = `${procName} consultation with ${siteConfig.practitionerName}`
    const description =
      `Consultation (${virtual ? 'Virtual' : 'In-Person'})` +
      `\nProvider: ${siteConfig.practitionerName}` +
      `\nContact: ${siteConfig.practicePhone}`
    const uid = `booking-${state.intake.procedureInterest || 'consult'}-${state.selectedDateKey}-${state.selectedSlotTime}@rivr.local`
    const ics = buildICS({
      uid,
      summary,
      description,
      location: locationLine,
      startLocal: start,
      endLocal: end,
    })
    downloadICS(`consultation-${state.selectedDateKey}.ics`, ics)
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div className="text-center pt-2">
        <div className="mx-auto h-12 w-12 rounded-full bg-navy/5 flex items-center justify-center text-navy">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="font-display font-medium text-[26px] text-navy mt-3">
          Your consultation is confirmed
        </h2>
        <p className="text-xs text-navy/60 mt-2 leading-relaxed">
          A confirmation has been sent to{' '}
          <span className="font-semibold text-navy">{state.intake.email || 'your email'}</span>{' '}
          with details, what to bring, and how to reach us if anything changes.
        </p>
      </div>

      <div className="rounded-lg border border-sand-200 bg-cream/40 p-4 space-y-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
            Consultation
          </div>
          <div className="mt-1 text-sm font-semibold text-navy">{formatLabel}</div>
          {dateObj && (
            <div className="text-[11px] text-navy/70">
              {formatLongDate(dateObj)} · {slotLabel} (ET)
            </div>
          )}
          <div className="text-[11px] text-navy/70">Provider: {siteConfig.practitionerName}</div>
          {service && (
            <div className="text-[11px] text-navy/70">Procedure of interest: {service.name}</div>
          )}
          <div className="text-[11px] text-navy/70 mt-1">{locationLine}</div>
        </div>

        <div className="border-t border-sand-200 pt-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
            Payment
          </div>
          <div className="text-[11px] text-navy/70 mt-1">
            {formatPriceUSD(CONSULTATION_FEE)} paid today · card ending in{' '}
            {state.payment.last4 || '••••'}
          </div>
        </div>

        <div className="border-t border-sand-200 pt-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
            What to bring
          </div>
          <ul className="mt-1 text-[11px] text-navy/70 list-disc pl-4 space-y-0.5">
            {siteConfig.preConsultChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDownloadICS}
          className="w-full py-2.5 rounded-lg bg-white text-navy text-sm font-semibold border border-navy/20 hover:bg-sand-100 transition-colors active:scale-[0.99] inline-flex items-center justify-center gap-2"
        >
          <CalIcon size={14} />
          Add to calendar
        </button>
        <button
          type="button"
          onClick={reset}
          className="w-full py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-600 transition-colors active:scale-[0.99]"
        >
          Done
        </button>
      </div>

      <div className="border-t border-sand-200 pt-4 mt-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-navy/50 mb-2">
          Confirmation emails
        </div>
        <div className="flex flex-col gap-3">
          <EmailPreview
            from={`${siteConfig.practiceName} <${siteConfig.emailSenderAddress}>`}
            to={`${state.intake.fullName || 'Patient'} <${state.intake.email}>`}
            subject={`Your ${procName} consultation with ${siteConfig.practitionerName}`}
          >
            <p>Hi {firstName} — your consultation is confirmed.</p>
            <p>
              <strong>{formatLabel}</strong>
              <br />
              {dateObj && (
                <>
                  {formatLongDate(dateObj)} · {slotLabel} (ET)
                  <br />
                </>
              )}
              {locationLine}
              <br />
              Provider: {siteConfig.practitionerName}
            </p>
            <p>
              Receipt: {formatPriceUSD(CONSULTATION_FEE)} charged to card ending in{' '}
              {state.payment.last4 || '••••'}.
            </p>
            <p>
              <strong>Before your consultation, please have ready:</strong>
            </p>
            <ul>
              {siteConfig.preConsultChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              <strong>What to expect:</strong>{' '}
              {virtual
                ? 'We’ll email a secure video link 30 minutes before your appointment.'
                : 'Please arrive 10 minutes early so we can check you in.'}
            </p>
            <p>
              To cancel or reschedule, please call us at{' '}
              <strong>{siteConfig.practicePhone}</strong>. Cancellations cannot be processed by
              email.
            </p>
            <p style={{ color: '#0B1E3F99' }}>— {siteConfig.practiceName}</p>
          </EmailPreview>

          <EmailPreview
            from={`${siteConfig.emailSenderName} <${siteConfig.emailSenderAddress}>`}
            to={`${siteConfig.practiceName} <${siteConfig.spaInboxAddress}>`}
            subject={`New consultation booking: ${procName} — ${state.intake.fullName || 'Patient'}`}
          >
            <p>
              <strong>New consultation booked.</strong>
            </p>
            <p>
              <strong>Patient:</strong> {state.intake.fullName}
              <br />
              <strong>Email:</strong> {state.intake.email}
              <br />
              <strong>Phone:</strong> {state.intake.phone}
              <br />
              <strong>DOB:</strong> {state.intake.dob}
            </p>
            <p>
              <strong>Procedure of interest:</strong> {service?.name || '—'}
              <br />
              <strong>Timeline:</strong> {state.intake.timeline || '—'}
              <br />
              <strong>Prior procedures:</strong> {state.intake.priorProcedures || '—'}
              <br />
              <strong>Budget range:</strong> {state.intake.budgetRange || 'Not provided'}
              <br />
              <strong>How they heard:</strong> {state.intake.referralSource || '—'}
            </p>
            <p>
              <strong>Consultation:</strong> {formatLabel}
              <br />
              <strong>When:</strong> {dateObj ? formatLongDate(dateObj) : ''} · {slotLabel} (ET)
              <br />
              <strong>Provider:</strong> {siteConfig.practitionerName}
            </p>
            <p>
              <strong>Payment status:</strong> {formatPriceUSD(CONSULTATION_FEE)} collected on
              card ending {state.payment.last4 || '••••'}.
            </p>
          </EmailPreview>
        </div>
      </div>
    </div>
  )
}
