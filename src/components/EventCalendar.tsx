'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CalendarIcon,
  CalendarXIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  TicketIcon,
} from '@/components/ui/icons'
import { grossPrice } from '@/lib/utils'

// Mirror of the /api/events/calendar normalized shape. Kept local so this
// client component never imports from a server route module.
interface CalendarEvent {
  _id: string
  title: string
  slug: string
  eventType?: string
  startDate: string
  endDate?: string
  isFree: boolean
  isVirtual: boolean
  city?: string
  island?: string
  venueName?: string
  price?: number | null
  currency?: string
  capacity?: number | null
  currentRegistrations?: number
  featuredImage?: string | null
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function eventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function eventLocation(e: CalendarEvent): string {
  if (e.isVirtual) return 'Virtual'
  const parts = [e.venueName, e.city].filter(Boolean)
  return parts.length ? parts.join(', ') : (e.island || 'Bahamas')
}

function priceLabel(e: CalendarEvent): string {
  if (e.isFree) return 'Free'
  if (e.price != null) return `From ${e.currency || 'BSD'} ${grossPrice(e.price).toFixed(2)}`
  return 'See pricing'
}

export default function EventCalendar({
  title = 'Upcoming Events',
  subtitle = 'Browse the calendar and register for what’s coming up.',
  className = '',
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const todayKey = dayKey(today)

  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [selectedKey, setSelectedKey] = useState(todayKey)

  useEffect(() => {
    let active = true
    fetch('/api/events/calendar')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        const list: CalendarEvent[] = data.events || []
        setEvents(list)
        // Jump the view to the first upcoming event so the calendar opens on
        // something registerable, and preselect that day.
        if (list.length > 0) {
          const first = new Date(list[0].startDate)
          setViewMonth(first.getMonth())
          setViewYear(first.getFullYear())
          setSelectedKey(dayKey(first))
        }
      })
      .catch((err) => console.error('Failed to load calendar events:', err))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const key = dayKey(new Date(e.startDate))
      const bucket = map.get(key)
      if (bucket) bucket.push(e)
      else map.set(key, [e])
    }
    return map
  }, [events])

  // 6-week (42-cell) grid starting on the Sunday on/before the 1st.
  const cells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
    return Array.from({ length: 42 }, (_, i) => new Date(viewYear, viewMonth, 1 - firstWeekday + i))
  }, [viewMonth, viewYear])

  const selectedEvents = (eventsByDay.get(selectedKey) || [])
    .slice()
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  // Don't let visitors page back before the current month — there are no
  // upcoming events there anyway.
  const isCurrentOrPast =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth())

  const goToMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewMonth(next.getMonth())
    setViewYear(next.getFullYear())
  }

  const selectedDateLabel = (() => {
    const [y, m, d] = selectedKey.split('-').map(Number)
    return new Date(y, m, d).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  })()

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-[#1a1e26] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-black/8 dark:border-white/8 px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0dd5b5]/15 text-[#0a8a76] dark:text-[#0dd5b5]">
          <CalendarIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#13191f] dark:text-white">{title}</h3>
          <p className="truncate text-sm text-black/55 dark:text-white/50">{subtitle}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0dd5b5] border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          {/* Month grid */}
          <div className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                disabled={isCurrentOrPast}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 text-[#13191f] dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <div className="text-sm font-bold text-[#13191f] dark:text-white">
                {MONTHS[viewMonth]} {viewYear}
              </div>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 text-[#13191f] dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7">
              {WEEKDAYS.map((w) => (
                <div
                  key={w}
                  className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-black/40 dark:text-white/40"
                >
                  {w.slice(0, 1)}
                  <span className="hidden sm:inline">{w.slice(1)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell) => {
                const key = dayKey(cell)
                const inMonth = cell.getMonth() === viewMonth
                const dayEvents = eventsByDay.get(key) || []
                const hasEvents = dayEvents.length > 0
                const isToday = key === todayKey
                const isSelected = key === selectedKey

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (!inMonth) {
                        setViewMonth(cell.getMonth())
                        setViewYear(cell.getFullYear())
                      }
                      setSelectedKey(key)
                    }}
                    className={[
                      'relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors',
                      isSelected
                        ? 'bg-[#0dd5b5] text-black font-bold'
                        : hasEvents
                          ? 'bg-[#0dd5b5]/10 text-[#0a8a76] dark:text-[#0dd5b5] font-semibold hover:bg-[#0dd5b5]/20'
                          : 'text-[#13191f] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10',
                      !inMonth ? 'opacity-30' : '',
                      isToday && !isSelected ? 'ring-1 ring-inset ring-[#0dd5b5]' : '',
                    ].join(' ')}
                  >
                    <span>{cell.getDate()}</span>
                    {hasEvents && (
                      <span
                        className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                          isSelected ? 'bg-black/70' : 'bg-[#0dd5b5]'
                        }`}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected-day event list */}
          <div className="border-t border-black/8 dark:border-white/8 bg-black/[0.015] dark:bg-white/[0.02] p-4 sm:p-5 md:border-l md:border-t-0">
            <p className="mb-3 text-sm font-bold text-[#13191f] dark:text-white">{selectedDateLabel}</p>

            {selectedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarXIcon className="mb-2 h-8 w-8 text-black/20 dark:text-white/20" />
                <p className="text-sm text-black/50 dark:text-white/40">No events on this day.</p>
                <p className="mt-1 text-xs text-black/40 dark:text-white/30">
                  Pick a highlighted date to see what’s on.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEvents.map((e) => {
                  const spotsLeft = e.capacity != null ? e.capacity - (e.currentRegistrations || 0) : null
                  const soldOut = spotsLeft != null && spotsLeft <= 0
                  return (
                    <Link
                      key={e._id}
                      href={`/events/${e.slug}`}
                      className="group block rounded-xl border border-black/8 dark:border-white/10 bg-white dark:bg-[#20242d] p-3 transition-colors hover:border-[#0dd5b5]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#13191f] dark:text-white line-clamp-2 group-hover:text-[#0a8a76] dark:group-hover:text-[#0dd5b5]">
                          {e.title}
                        </h4>
                        <span className="shrink-0 rounded-full bg-[#0dd5b5]/15 px-2 py-0.5 text-[11px] font-semibold text-[#0a8a76] dark:text-[#0dd5b5]">
                          {eventTime(e.startDate)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-black/55 dark:text-white/50">
                        <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{eventLocation(e)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-[#13191f] dark:text-white">
                          {priceLabel(e)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            soldOut
                              ? 'bg-black/5 dark:bg-white/10 text-black/40 dark:text-white/40'
                              : 'bg-[#0dd5b5] text-black group-hover:bg-[#0bc4a6]'
                          }`}
                        >
                          <TicketIcon className="h-3.5 w-3.5" />
                          {soldOut ? 'Sold out' : 'Register'}
                        </span>
                      </div>
                      {spotsLeft != null && !soldOut && spotsLeft <= 20 && (
                        <p className="mt-1.5 text-[11px] font-medium text-orange-600">
                          Only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left
                        </p>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}

            <Link
              href="/events"
              className="mt-4 block text-center text-sm font-semibold text-[#0a8a76] dark:text-[#0dd5b5] hover:underline"
            >
              See all events →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
