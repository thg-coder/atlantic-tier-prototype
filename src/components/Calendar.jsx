import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBooking } from '../state/BookingContext.jsx'
import { formatDateKey } from '../mockData.js'
import { formatTime12h, monthLabel, formatLongDate } from '../utils/format.js'

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfMonth(year, monthIdx) {
  return new Date(year, monthIdx, 1)
}

function buildMonthGrid(year, monthIdx) {
  const first = startOfMonth(year, monthIdx)
  const startDay = first.getDay()
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIdx, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function Calendar() {
  const { state, dispatch, availability } = useBooking()
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const initialMonth = state.selectedDateKey
    ? new Date(state.selectedDateKey + 'T12:00:00')
    : today
  const [view, setView] = useState({
    year: initialMonth.getFullYear(),
    monthIdx: initialMonth.getMonth()
  })

  const cells = useMemo(() => buildMonthGrid(view.year, view.monthIdx), [view])

  // Re-render at minute boundary so past slots auto-disable while user lingers.
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  const selectedDateObj = state.selectedDateKey
    ? new Date(state.selectedDateKey + 'T12:00:00')
    : null
  const slots = state.selectedDateKey ? availability[state.selectedDateKey] || [] : []

  function pickDay(d) {
    if (!d) return
    if (d < today) return
    const key = formatDateKey(d)
    const has = availability[key] && availability[key].length > 0
    if (!has) return
    dispatch({ type: 'SELECT_SLOT', dateKey: key, slotTime: null })
  }

  function pickSlot(t) {
    if (!state.selectedDateKey) return
    dispatch({ type: 'SELECT_SLOT', dateKey: state.selectedDateKey, slotTime: t })
  }

  function isSlotPast(t) {
    if (!state.selectedDateKey) return false
    const d = new Date(state.selectedDateKey + 'T00:00:00')
    if (
      d.getFullYear() !== now.getFullYear() ||
      d.getMonth() !== now.getMonth() ||
      d.getDate() !== now.getDate()
    ) {
      return false
    }
    const [hh, mm] = t.split(':').map(Number)
    return hh < now.getHours() || (hh === now.getHours() && mm <= now.getMinutes())
  }

  return (
    <div className="space-y-4 rounded-xl border border-navy/10 bg-white shadow-card p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setView((v) =>
              v.monthIdx === 0
                ? { year: v.year - 1, monthIdx: 11 }
                : { year: v.year, monthIdx: v.monthIdx - 1 }
            )
          }
          className="p-2 rounded-lg text-navy/55 hover:bg-navy/[0.05] hover:text-navy transition-colors duration-150"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-display font-semibold text-[19px] text-navy">
          {monthLabel(view.year, view.monthIdx)}
        </span>
        <button
          type="button"
          onClick={() =>
            setView((v) =>
              v.monthIdx === 11
                ? { year: v.year + 1, monthIdx: 0 }
                : { year: v.year, monthIdx: v.monthIdx + 1 }
            )
          }
          className="p-2 rounded-lg text-navy/55 hover:bg-navy/[0.05] hover:text-navy transition-colors duration-150"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-[9px] font-semibold text-navy/35 uppercase tracking-[0.12em] pb-1">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const key = formatDateKey(d)
          const isPast = d < today
          const isToday = d.getTime() === today.getTime()
          const isSelected = state.selectedDateKey === key
          const has = availability[key] && availability[key].length > 0
          const disabled = isPast || !has
          return (
            <button
              key={key}
              type="button"
              onClick={() => pickDay(d)}
              disabled={disabled}
              className={
                'aspect-square text-[13px] tabular-nums rounded-lg transition-all duration-150 flex items-center justify-center ' +
                (isSelected
                  ? 'bg-navy text-white font-semibold shadow-card-active '
                  : disabled
                    ? 'text-navy/20 cursor-not-allowed '
                    : 'text-navy/85 hover:bg-navy/[0.06] ') +
                (isToday && !isSelected ? 'ring-1 ring-inset ring-navy/30 font-semibold ' : '')
              }
              aria-label={
                disabled ? `${d.getDate()} no availability` : `Select ${formatLongDate(d)}`
              }
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>

      {selectedDateObj && (
        <div className="space-y-2.5 pt-1">
          <div className="text-[11px] font-medium text-navy/60">
            Available times for {formatLongDate(selectedDateObj)}{' '}
            <span className="text-navy/35">(ET)</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {slots.length === 0 && (
              <div className="text-xs text-navy/45 italic py-2">
                No times available — try another day.
              </div>
            )}
            {slots.map((t) => {
              const past = isSlotPast(t)
              const selected = state.selectedSlotTime === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => !past && pickSlot(t)}
                  disabled={past}
                  className={
                    'flex-shrink-0 px-3.5 py-2 rounded-full text-[12px] font-medium tabular-nums border transition-all duration-150 ' +
                    (selected
                      ? 'bg-navy text-white border-navy shadow-card-active '
                      : past
                        ? 'bg-sand-100 text-navy/25 border-navy/8 cursor-not-allowed '
                        : 'bg-white text-navy/85 border-navy/12 hover:border-navy/30 hover:bg-navy/[0.03] ')
                  }
                >
                  {formatTime12h(t)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
