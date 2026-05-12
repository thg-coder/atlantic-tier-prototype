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

  const feeModel = siteConfig.consultFeeModel || 'paid_nonrefundable'
  const feeAmount = siteConfig.consultFeeAmount ?? CONSULTATION_FEE
  const isFree = feeModel === 'free'

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
    const summary = `Consultation — ${siteConfig.practiceName}`
    const icsLocation = virtual
      ? `${siteConfig.brandName} — Virtual consultation`
      : siteConfig.practiceAddress
    const description =
      `${procName} consultation (${virtual ? 'Virtual' : 'In-Person'})` +
      `\nProvider: ${siteConfig.practitionerName}` +
      `\nContact: ${siteConfig.practicePhone}`
    const uid = `booking-${state.intake.procedureInterest || 'consult'}-${state.selectedDateKey}-${state.selectedSlotTime}@rivr.local`
    const ics = buildICS({
      uid,
      summary,
      description,
      location: icsLocation,
      startLocal: start,
      endLocal: end,
    })
    downloadICS(`consultation-${state.selectedDateKey}.ics`, ics)
  }

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div className="text-center pt-1">
        <div className="mx-auto h-12 w-12 rounded-full bg-navy/[0.06] flex items-center justify-center text-navy/80">
          <CheckCircle2 size={26} />
        </div>
        <h2 className="font-display font-semibold text-[28px] leading-[1.12] text-navy mt-3.5">
          Your consultation is confirmed
        </h2>
        <p className="text-[12.5px] text-navy/60 mt-2 leading-relaxed">
          A confirmation has been sent to{' '}
          <span className="font-semibold text-navy/85">{state.intake.email || 'your email'}</span>{' '}
          with details, what to bring, and how to reach us if anything changes.
        </p>
      </div>

      <div className="rounded-xl border border-navy/10 bg-cream shadow-card p-5 space-y-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
            Consultation
          </div>
          <div className="mt-1.5 text-[15px] font-semibold text-navy">{formatLabel}</div>
          {dateObj && (
            <div className="text-[12px] text-navy/60 tabular-nums">
              {formatLongDate(dateObj)} · {slotLabel} (ET)
            </div>
          )}
          <div className="text-[12px] text-navy/60">Provider: {siteConfig.practitionerName}</div>
          {service && (
            <div className="text-[12px] text-navy/60">Procedure of interest: {service.name}</div>
          )}
          <div className="text-[12px] text-navy/60 mt-1">{locationLine}</div>
        </div>

        <div className="hairline" />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
            Payment
          </div>
          <div className="text-[12px] text-navy/60 mt-1.5 tabular-nums">
            {isFree
              ? 'No charge — complimentary consultation.'
              : `${formatPriceUSD(feeAmount)} paid today · card ending in ${state.payment.last4 || '••••'}`}
          </div>
        </div>

        <div className="hairline" />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
            What to bring
          </div>
          <ul className="mt-2 space-y-1.5">
            {siteConfig.preConsultChecklist.map((item) => (
              <li key={item} className="flex gap-2.5 text-[12px] text-navy/60 leading-relaxed">
                <span aria-hidden="true" className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-navy/30" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleDownloadICS}
          className="w-full py-3 rounded-xl bg-transparent text-navy/80 text-sm font-medium border border-navy/15 hover:bg-navy/[0.04] hover:text-navy transition-all duration-150 ease-out active:scale-[0.985] inline-flex items-center justify-center gap-2"
        >
          <CalIcon size={14} />
          Add to calendar
        </button>
        <button
          type="button"
          onClick={reset}
          className="w-full py-3 rounded-xl bg-navy text-white text-sm font-semibold shadow-cta hover:bg-navy-600 transition-all duration-150 ease-out active:scale-[0.985] active:shadow-card-active"
        >
          Done
        </button>
      </div>

      <div className="border-t border-navy/10 pt-5 mt-1">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45 mb-3">
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
              {isFree
                ? 'This consultation is complimentary — there is no charge.'
                : `Receipt: ${formatPriceUSD(feeAmount)} charged to card ending in ${state.payment.last4 || '••••'}.`}
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
              <strong>Payment status:</strong>{' '}
              {isFree
                ? 'Complimentary consultation — no charge collected.'
                : `${formatPriceUSD(feeAmount)} collected on card ending ${state.payment.last4 || '••••'}.`}
            </p>
          </EmailPreview>
        </div>
      </div>
    </div>
  )
}
