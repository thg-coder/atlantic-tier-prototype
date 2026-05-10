import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { CONSULTATION_FEE, SAME_DAY_DEPOSIT } from '../mockData.js'
import { getCheckoutScenario } from '../state/pathUtils.js'
import { formatCardNumber, formatCVC, formatExpiry, formatZIP, formatPriceUSD } from '../utils/format.js'
import OrderSummary from '../components/OrderSummary.jsx'
import { FormField, inputClass, inputErrorClass } from '../components/FormField.jsx'

export default function Checkout() {
  const { state, dispatch, goNext } = useBooking()
  const scenario = getCheckoutScenario(state)
  const totalToday =
    scenario === 'A' ? CONSULTATION_FEE : scenario === 'B' ? CONSULTATION_FEE + SAME_DAY_DEPOSIT : 0

  const [card, setCard] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const [zip, setZip] = useState('')
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const cardDigits = card.replace(/\D/g, '')
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
            if (expDate < new Date(now.getFullYear(), now.getMonth(), 1))
              return 'Card is expired.'
            return null
          })(),
    cvc: cvc.length < 3 ? 'Add CVC.' : null,
    zip: zip.length < 3 ? 'Add ZIP.' : null
  }

  const allValid = !errors.card && !errors.exp && !errors.cvc && !errors.zip

  const buttonLabel =
    scenario === 'C'
      ? 'Save Card and Book'
      : `Pay ${formatPriceUSD(totalToday)} and Book`

  function showError(field) {
    return touched[field] && errors[field]
  }

  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function submit() {
    setTouched({ card: true, exp: true, cvc: true, zip: true })
    if (!allValid) return
    setSubmitting(true)
    setTimeout(() => {
      const last4 = cardDigits.slice(-4)
      dispatch({ type: 'SET_PAYMENT', last4 })
      setSubmitting(false)
      goNext()
    }, 1200)
  }

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl text-navy mb-1">Payment</h2>
        <p className="text-[11px] text-navy/60 inline-flex items-center gap-1">
          <Lock size={11} aria-hidden="true" />
          Secured & encrypted (demo only)
        </p>
      </div>

      <OrderSummary />

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
            value={card}
            onChange={(e) => setCard(formatCardNumber(e.target.value))}
            onBlur={() => blur('card')}
            placeholder="1234 1234 1234 1234"
            className={inputClass + (showError('card') ? ' ' + inputErrorClass : '')}
            aria-invalid={!!showError('card')}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="exp"
            label="Expiration"
            required
            error={showError('exp') ? errors.exp : null}
          >
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
          <FormField
            id="cvc"
            label="CVC"
            required
            error={showError('cvc') ? errors.cvc : null}
          >
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

      <button
        type="button"
        disabled={!allValid || submitting}
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
          buttonLabel
        )}
      </button>
    </div>
  )
}
