import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { CONSULTATION_FEE } from '../mockData.js'
import { siteConfig } from '../siteConfig.js'
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
    <div className="rounded-lg bg-cream border border-navy/10 border-l-2 border-l-navy/40 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/55">{title}</div>
      <div className="mt-1.5 text-[12px] text-navy/70 leading-relaxed">{children}</div>
    </div>
  )
}

export default function Confirm() {
  const { state, dispatch, goNext } = useBooking()

  const feeModel = siteConfig.consultFeeModel || 'paid_nonrefundable'
  const feeAmount = siteConfig.consultFeeAmount ?? CONSULTATION_FEE
  const isFree = feeModel === 'free'
  const isCredit = feeModel === 'paid_credit'

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
  // A free consult collects no card, so card validity is moot.
  const cardValid = isFree || (!errors.card && !errors.exp && !errors.cvc && !errors.zip)
  const policyAgreed = state.policyAgreed === true
  const canSubmit = cardValid && policyAgreed

  function showError(field) {
    return touched[field] && errors[field]
  }
  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function submit() {
    if (!isFree) setTouched({ card: true, exp: true, cvc: true, zip: true })
    if (!canSubmit) return
    if (isFree) {
      dispatch({ type: 'SET_PAYMENT', last4: null })
      goNext()
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      dispatch({ type: 'SET_PAYMENT', last4: cardDigits.slice(-4) })
      setSubmitting(false)
      goNext()
    }, 1200)
  }

  const ctaLabel = isFree ? 'Confirm consultation' : `Confirm and Pay ${formatPriceUSD(feeAmount)}`

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <h2 className="font-display font-semibold text-[28px] leading-[1.12] text-navy">
          Confirm your consultation
        </h2>
        {!isFree && (
          <p className="mt-1.5 text-[11px] text-navy/50 inline-flex items-center gap-1.5">
            <Lock size={11} aria-hidden="true" />
            Secured &amp; encrypted (demo only)
          </p>
        )}
      </div>

      <OrderSummary />

      <Callout title="Cancellation policy">
        <p>{siteConfig.cancellationPolicyText}</p>
        {isCredit && (
          <p className="mt-2">
            Note: this fee is credited toward your procedure if you schedule within{' '}
            {siteConfig.consultFeeCreditWindow} months of your consultation.
          </p>
        )}
      </Callout>
      <Callout title="No-show policy">
        <p>{siteConfig.noShowPolicyText}</p>
      </Callout>

      <label className="group flex items-start gap-3 cursor-pointer rounded-lg border border-navy/10 bg-white px-4 py-3 transition-colors duration-150 hover:border-navy/20">
        <input
          type="checkbox"
          checked={policyAgreed}
          onChange={(e) => dispatch({ type: 'SET_POLICY_AGREED', value: e.target.checked })}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={
            'mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-150 ' +
            (policyAgreed ? 'bg-navy border-navy' : 'border-navy/30 group-hover:border-navy/45')
          }
        >
          <svg viewBox="0 0 12 12" className={'h-2.5 w-2.5 text-white transition-opacity duration-150 ' + (policyAgreed ? 'opacity-100' : 'opacity-0')} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6.5 4.8 9 10 3" />
          </svg>
        </span>
        <span className="text-[12.5px] text-navy/75 leading-relaxed">
          I have read and agree to the cancellation and no-show policy.{' '}
          <span className="text-rose-700">*</span>
        </span>
      </label>

      {!isFree && (
        <div className="rounded-xl border border-navy/10 bg-white shadow-card p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">Card details</span>
            <CreditCard size={14} className="text-navy/35" aria-hidden="true" />
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
      )}

      <div>
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={submit}
          className={
            'w-full py-3.5 rounded-xl text-sm font-semibold tracking-[0.01em] text-white shadow-cta transition-all duration-150 ease-out ' +
            'bg-navy hover:bg-navy-600 active:scale-[0.985] active:shadow-card-active disabled:bg-navy/25 disabled:text-white/70 disabled:shadow-none disabled:cursor-not-allowed ' +
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
            ctaLabel
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
