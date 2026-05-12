import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { CONSULTATION_FEE } from '../mockData.js'
import {
  formatCardNumber,
  formatCVC,
  formatExpiry,
  formatZIP,
  formatPriceUSD,
} from '../utils/format.js'
import OrderSummary from '../components/OrderSummary.jsx'
import { FormField, inputClass, inputErrorClass } from '../components/FormField.jsx'

function Callout({ title, children }) {
  return (
    <div className="rounded-lg bg-cream border border-sand-200 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">{title}</div>
      <div className="mt-1 text-xs text-navy/80 leading-relaxed">{children}</div>
    </div>
  )
}

export default function Confirm() {
  const { state, dispatch, goNext } = useBooking()

  const [cardNum, setCardNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const [zip, setZip] = useState('')
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const cardDigits = cardNum.replace(/\D/g, '')
  const expDigits = exp.replace(/\D/g, '')
  const errors = {
    card: cardDigits.length < 13 ? 'Card number looks incomplete.' : null,
    exp:
      expDigits.length < 4
        ? 'Add expiration date.'
        : (() => {
            const mm = Number(expDigits.slice(0, 2))
            const yy = Number(expDigits.slice(2, 4))
            if (mm < 1 || mm > 12) return 'Invalid month.'
            const now = new Date()
            const fullYear = 2000 + yy
            const expDate = new Date(fullYear, mm, 0)
            if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) return 'Card is expired.'
            return null
          })(),
    cvc: cvc.length < 3 ? 'Add CVC.' : null,
    zip: zip.length < 3 ? 'Add ZIP.' : null,
  }
  const cardValid = !errors.card && !errors.exp && !errors.cvc && !errors.zip
  const policyAgreed = state.policyAgreed === true
  const canSubmit = cardValid && policyAgreed

  function showError(field) {
    return touched[field] && errors[field]
  }
  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function submit() {
    setTouched({ card: true, exp: true, cvc: true, zip: true })
    if (!canSubmit) return
    setSubmitting(true)
    setTimeout(() => {
      dispatch({ type: 'SET_PAYMENT', last4: cardDigits.slice(-4) })
      setSubmitting(false)
      goNext()
    }, 1200)
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <h2 className="font-display font-medium text-[26px] text-navy mb-1 leading-tight">
          Confirm your consultation
        </h2>
        <p className="text-[11px] text-navy/60 inline-flex items-center gap-1">
          <Lock size={11} aria-hidden="true" />
          Secured &amp; encrypted (demo only)
        </p>
      </div>

      <OrderSummary />

      <Callout title="Cancellation">
        <p>
          Cancellations made more than 48 hours before your consultation are fully refundable.
          Cancellations within 48 hours forfeit the consultation fee. Rescheduling without
          cancellation does not incur a fee.
        </p>
      </Callout>
      <Callout title="No-show">
        <p>
          If you do not arrive within 15 minutes of your scheduled consultation time and have
          not contacted us, the appointment is treated as a no-show and the consultation fee is
          forfeited.
        </p>
      </Callout>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={policyAgreed}
          onChange={(e) => dispatch({ type: 'SET_POLICY_AGREED', value: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-sand-300 text-navy focus:ring-navy"
        />
        <span className="text-xs text-navy/80 leading-relaxed">
          I have read and agree to the cancellation and no-show policy.{' '}
          <span className="text-red-600">*</span>
        </span>
      </label>

      <div className="rounded-lg border border-sand-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-navy">Card details</span>
          <CreditCard size={14} className="text-navy/40" aria-hidden="true" />
        </div>

        <FormField
          id="card"
          label="Card number"
          required
          error={showError('card') ? errors.card : null}
          helper="Demo: use card 4242 4242 4242 4242, any future date, any CVC."
        >
          <input
            id="card"
            inputMode="numeric"
            autoComplete="cc-number"
            value={cardNum}
            onChange={(e) => setCardNum(formatCardNumber(e.target.value))}
            onBlur={() => blur('card')}
            placeholder="1234 1234 1234 1234"
            className={inputClass + (showError('card') ? ' ' + inputErrorClass : '')}
            aria-invalid={!!showError('card')}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField id="exp" label="Expiration" required error={showError('exp') ? errors.exp : null}>
            <input
              id="exp"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={exp}
              onChange={(e) => setExp(formatExpiry(e.target.value))}
              onBlur={() => blur('exp')}
              placeholder="MM/YY"
              className={inputClass + (showError('exp') ? ' ' + inputErrorClass : '')}
              aria-invalid={!!showError('exp')}
            />
          </FormField>
          <FormField id="cvc" label="CVC" required error={showError('cvc') ? errors.cvc : null}>
            <input
              id="cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cvc}
              onChange={(e) => setCvc(formatCVC(e.target.value))}
              onBlur={() => blur('cvc')}
              placeholder="CVC"
              className={inputClass + (showError('cvc') ? ' ' + inputErrorClass : '')}
              aria-invalid={!!showError('cvc')}
            />
          </FormField>
        </div>

        <FormField id="zip" label="ZIP" required error={showError('zip') ? errors.zip : null}>
          <input
            id="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            value={zip}
            onChange={(e) => setZip(formatZIP(e.target.value))}
            onBlur={() => blur('zip')}
            placeholder="12345"
            className={inputClass + (showError('zip') ? ' ' + inputErrorClass : '')}
            aria-invalid={!!showError('zip')}
          />
        </FormField>
      </div>

      <div>
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={submit}
          className={
            'w-full py-3 rounded-lg text-sm font-semibold tracking-wide text-white transition-all ' +
            'bg-navy hover:bg-navy-600 active:scale-[0.99] disabled:bg-navy/30 disabled:cursor-not-allowed ' +
            (submitting ? ' opacity-80' : '')
          }
          aria-busy={submitting}
        >
          {submitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Processing…
            </span>
          ) : (
            `Confirm and Pay ${formatPriceUSD(CONSULTATION_FEE)}`
          )}
        </button>
        {cardValid && !policyAgreed && (
          <p className="mt-2 text-[11px] font-medium text-navy/60">
            Please review and acknowledge the policy above to continue.
          </p>
        )}
      </div>
    </div>
  )
}
