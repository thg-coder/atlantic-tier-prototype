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
    <div className="space-y-4">
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
          className="p-2 rounded-md hover:bg-sand-100 text-navy/70"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-display text-lg text-navy">
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
          className="p-2 rounded-md hover:bg-sand-100 text-navy/70"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-[10px] font-semibold text-navy/40 uppercase tracking-wider py-1">
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
                'aspect-square text-sm rounded-md transition-colors flex items-center justify-center ' +
                (isSelected
                  ? 'bg-navy text-white font-semibold '
                  : disabled
                    ? 'text-navy/25 cursor-not-allowed '
                    : 'text-navy hover:bg-sand-100 ') +
                (isToday && !isSelected ? 'ring-1 ring-navy/40 ' : '')
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
        <div className="space-y-2">
          <div className="text-xs font-medium text-navy/70">
            Available times for {formatLongDate(selectedDateObj)}{' '}
            <span className="text-navy/40">(ET)</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {slots.length === 0 && (
              <div className="text-xs text-navy/50 italic py-2">
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
                    'flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium border transition-all ' +
                    (selected
                      ? 'bg-navy text-white border-navy '
                      : past
                        ? 'bg-sand-100 text-navy/30 border-sand-200 cursor-not-allowed '
                        : 'bg-white text-navy border-sand-300 hover:border-navy/50 ')
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
