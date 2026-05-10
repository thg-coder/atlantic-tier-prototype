import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, X, AlertTriangle } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { CATEGORIES, SERVICES, findService } from '../mockData.js'
import { formatPriceUSD } from '../utils/format.js'

export default function ServiceSelection() {
  const { state, dispatch, goNext } = useBooking()
  const [rawSearch, setRawSearch] = useState('')
  const [search, setSearch] = useState('')
  const debounceRef = useRef(null)
  const [expanded, setExpanded] = useState(() => {
    // Auto-expand the category of the previously selected service
    const set = new Set()
    if (state.serviceId) {
      const svc = findService(state.serviceId)
      if (svc) set.add(svc.category)
    }
    return set
  })
  const [pendingChange, setPendingChange] = useState(null)

  // Debounce search 150ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(rawSearch.trim().toLowerCase()), 150)
    return () => clearTimeout(debounceRef.current)
  }, [rawSearch])

  const filtered = useMemo(() => {
    if (!search) return SERVICES
    return SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        (s.description && s.description.toLowerCase().includes(search))
    )
  }, [search])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const cat of CATEGORIES) map.set(cat.id, [])
    for (const s of filtered) {
      if (map.has(s.category)) map.get(s.category).push(s)
    }
    return map
  }, [filtered])

  const allExpanded = !!search

  function toggle(catId) {
    if (allExpanded) return
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
  }

  function clickService(svc) {
    if (state.serviceId && state.serviceId !== svc.id) {
      // Past first selection — confirm, since this can drop other state.
      setPendingChange(svc.id)
      return
    }
    dispatch({ type: 'SELECT_SERVICE', serviceId: svc.id })
    goNext()
  }

  function confirmChange() {
    if (!pendingChange) return
    dispatch({ type: 'SELECT_SERVICE', serviceId: pendingChange })
    setPendingChange(null)
    goNext()
  }

  const noMatches = search && filtered.length === 0

  return (
    <div className="screen-enter flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl text-navy mb-1">Choose a service</h2>
        <p className="text-xs text-navy/60">
          Search or browse by category to start your booking.
        </p>
      </div>

      <div className="sticky top-0 z-10 bg-white pt-1">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
            aria-hidden="true"
          />
          <input
            type="text"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            placeholder="Search services..."
            aria-label="Search services"
            className="w-full pl-9 pr-9 py-2 rounded-md border border-sand-200 bg-cream text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
          {rawSearch && (
            <button
              type="button"
              onClick={() => setRawSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-sand-200 text-navy/60"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {noMatches && (
        <div className="rounded-md bg-sand-100 border border-sand-200 px-4 py-3 text-xs text-navy/70">
          No services match your search. Try a different keyword or browse by category below.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {CATEGORIES.map((cat) => {
          const items = grouped.get(cat.id) || []
          const open = allExpanded || expanded.has(cat.id)
          // When searching, hide categories that have no matches.
          if (search && items.length === 0) return null
          return (
            <div key={cat.id} className="rounded-lg border border-sand-200 overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggle(cat.id)}
                aria-expanded={open}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-sand-100 transition-colors"
              >
                <span className="text-sm font-semibold text-navy">
                  {cat.name}{' '}
                  <span className="text-navy/50 font-normal">
                    ({items.length})
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={'text-navy/60 transition-transform ' + (open ? 'rotate-180' : '')}
                  aria-hidden="true"
                />
              </button>
              {open && (
                <div className="border-t border-sand-200 divide-y divide-sand-200">
                  {items.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => clickService(s)}
                      className={
                        'w-full text-left px-4 py-3 hover:bg-cream transition-colors active:scale-[0.99] ' +
                        (state.serviceId === s.id ? 'bg-cream' : 'bg-white')
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-navy">{s.name}</div>
                          <div className="text-[11px] text-navy/60 mt-0.5 leading-snug">
                            {s.description}
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-navy/60">
                            <span>{s.durationMin} min</span>
                            <span className="text-navy/30">•</span>
                            <span className="font-semibold text-navy">
                              {formatPriceUSD(s.priceUSD)}
                            </span>
                            {s.consultRequired && (
                              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full bg-navy/5 text-navy/70 text-[10px] font-medium">
                                Consultation required
                              </span>
                            )}
                            {s.inPersonConsultOnly && (
                              <span className="text-[10px] italic text-navy/50">
                                (in-person consult only)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {pendingChange && (
        <ServiceChangeConfirm
          onConfirm={confirmChange}
          onCancel={() => setPendingChange(null)}
        />
      )}
    </div>
  )
}

function ServiceChangeConfirm({ onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={onCancel}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel()
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-widget max-w-[360px] w-full p-5"
      >
        <div className="flex items-start gap-3">
          <div className="text-amber-600 mt-0.5">
            <AlertTriangle size={18} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-lg text-navy">Change service?</h3>
            <p className="mt-1 text-xs text-navy/70 leading-relaxed">
              Changing your service will reset your time selection and same-day procedure
              choice. Your contact info will be saved.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 rounded-lg bg-navy text-white text-sm font-semibold"
          >
            Change service
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-lg bg-white text-navy text-sm font-semibold border border-navy/20"
          >
            Keep current
          </button>
        </div>
      </div>
    </div>
  )
}
