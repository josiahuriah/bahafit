'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const EVENT_TYPES = [
  { value: 'race', label: '🏃 Race / Run' },
  { value: 'marathon', label: '🏅 Marathon' },
  { value: 'triathlon', label: '🏊 Triathlon' },
  { value: 'cycling', label: '🚴 Cycling Event' },
  { value: 'swimming', label: '🌊 Swimming Event' },
  { value: 'competition', label: '🏆 Fitness Competition' },
  { value: 'crossfit', label: '💪 CrossFit Competition' },
  { value: 'bodybuilding', label: '🥇 Bodybuilding Show' },
  { value: 'challenge', label: '🎯 Fitness Challenge' },
  { value: 'bootcamp', label: '⚡ Bootcamp' },
  { value: 'yoga_retreat', label: '🧘 Yoga Retreat' },
  { value: 'wellness_expo', label: '🌿 Wellness Expo' },
  { value: 'workshop', label: '📚 Fitness Workshop' },
  { value: 'charity', label: '❤️ Charity Event' },
  { value: 'beach_workout', label: '🏖️ Beach Workout' },
  { value: 'group_class', label: '👥 Group Fitness Class' },
  { value: 'tournament', label: '🎖️ Sports Tournament' },
  { value: 'outdoor_adventure', label: '🏔️ Outdoor Adventure' },
  { value: 'virtual', label: '💻 Virtual Event' },
  { value: 'other', label: '✨ Other' },
]

const ISLANDS = [
  'New Providence', 'Grand Bahama', 'Abaco', 'Eleuthera',
  'Exuma', 'Andros', 'Bimini', 'Long Island',
  'Cat Island', 'San Salvador', 'Other',
]

interface PricingTier {
  tierName: string
  price: string
  currency: 'BSD' | 'USD'
  earlyBirdPrice: string
  description: string
}

const emptyTier = (): PricingTier => ({
  tierName: '',
  price: '',
  currency: 'BSD',
  earlyBirdPrice: '',
  description: '',
})

function SectionCard({
  number,
  title,
  subtitle,
  children,
}: {
  number: number
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-start gap-4 p-6 pb-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
          style={{ background: '#0dd5b5' }}
        >
          {number}
        </div>
        <div className="flex-1 pb-4 border-b border-gray-100">
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 pt-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0dd5b5]/40 focus:border-[#0dd5b5] transition-all bg-gray-50/50'

const selectClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0dd5b5]/40 focus:border-[#0dd5b5] transition-all bg-gray-50/50 appearance-none'

export default function CreateEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Section 1 — Basic Info
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState('')
  const [shortDescription, setShortDescription] = useState('')

  // Section 2 — Dates
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [regDeadline, setRegDeadline] = useState('')
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState('')

  // Section 3 — Location
  const [isVirtual, setIsVirtual] = useState(false)
  const [virtualLink, setVirtualLink] = useState('')
  const [venue, setVenue] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [island, setIsland] = useState('')
  const [country, setCountry] = useState('Bahamas')

  // Section 4 — Capacity
  const [requiresRegistration, setRequiresRegistration] = useState(true)
  const [capacity, setCapacity] = useState('')

  // Section 5 — Pricing
  const [isFree, setIsFree] = useState(true)
  const [tiers, setTiers] = useState<PricingTier[]>([emptyTier()])

  // Section 6 — Contact
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactWhatsapp, setContactWhatsapp] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/events/new')
    }
  }, [status, router])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!eventType) e.eventType = 'Event type is required'
    if (!startDate) e.startDate = 'Start date is required'
    if (!isFree) {
      tiers.forEach((t, i) => {
        if (!t.tierName.trim()) e[`tier_name_${i}`] = 'Tier name required'
        if (!t.price || isNaN(Number(t.price))) e[`tier_price_${i}`] = 'Valid price required'
      })
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')

    const payload = {
      title: title.trim(),
      eventType,
      shortDescription: shortDescription.trim() || undefined,
      startDate,
      endDate: endDate || undefined,
      registrationDeadline: regDeadline || undefined,
      earlyBirdDeadline: earlyBirdDeadline || undefined,
      isVirtual,
      virtualEventLink: isVirtual ? virtualLink : undefined,
      location: isVirtual
        ? undefined
        : {
            venueName: venue || undefined,
            address: address || undefined,
            city: city || undefined,
            island: island || undefined,
            country: country || undefined,
          },
      capacity: capacity ? Number(capacity) : undefined,
      requiresRegistration,
      isFree,
      pricing: isFree
        ? []
        : tiers.map((t) => ({
            tierName: t.tierName,
            price: Number(t.price),
            currency: t.currency,
            earlyBirdPrice: t.earlyBirdPrice ? Number(t.earlyBirdPrice) : undefined,
            description: t.description || undefined,
          })),
      contactInfo: {
        email: contactEmail || undefined,
        phone: contactPhone || undefined,
        whatsapp: contactWhatsapp || undefined,
      },
    }

    try {
      const res = await fetch('/api/events/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to create event')
        setSubmitting(false)
        return
      }
      router.push('/dashboard?created=1')
    } catch {
      setSubmitError('An unexpected error occurred')
      setSubmitting(false)
    }
  }

  const updateTier = (i: number, field: keyof PricingTier, value: string) => {
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-[#0dd5b5] border-t-transparent animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Create a New Event
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-8">
            Fill in the details below to publish your event to the Bahafit community.
          </p>
        </div>
      </div>

      <main className="bg-gray-50/80 min-h-screen">
        <form onSubmit={handleSubmit} noValidate>
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

            {/* ── 1. Basic Info ── */}
            <SectionCard number={1} title="Basic Info" subtitle="Tell attendees what your event is about">
              <Field label="Event Title" required error={errors.title}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nassau Half Marathon 2025"
                  className={inputClass}
                />
              </Field>

              <Field label="Event Type" required error={errors.eventType}>
                <div className="relative">
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select an event type…</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Field>

              <Field
                label="Short Description"
                hint={`${shortDescription.length}/300 characters`}
              >
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value.slice(0, 300))}
                  placeholder="Give a brief summary of your event…"
                  rows={3}
                  className={inputClass + ' resize-none'}
                />
              </Field>
            </SectionCard>

            {/* ── 2. Date & Time ── */}
            <SectionCard number={2} title="Date & Time" subtitle="When does your event take place?">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Start Date & Time" required error={errors.startDate}>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="End Date & Time">
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Registration Deadline" hint="Optional">
                  <input
                    type="datetime-local"
                    value={regDeadline}
                    onChange={(e) => setRegDeadline(e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Early Bird Deadline" hint="Optional — set before adding early bird prices">
                  <input
                    type="datetime-local"
                    value={earlyBirdDeadline}
                    onChange={(e) => setEarlyBirdDeadline(e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* ── 3. Location ── */}
            <SectionCard number={3} title="Location" subtitle="Where will attendees show up?">
              {/* Virtual toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Virtual Event</p>
                  <p className="text-xs text-gray-500">Held online, no physical venue</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVirtual((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isVirtual ? 'bg-[#0dd5b5]' : 'bg-gray-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isVirtual ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {isVirtual ? (
                <Field label="Virtual Event Link" hint="Link will be shared with registered attendees">
                  <input
                    type="url"
                    value={virtualLink}
                    onChange={(e) => setVirtualLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className={inputClass}
                  />
                </Field>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Venue Name">
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Baha Mar Resort"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Address">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="City">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Nassau"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Island">
                      <div className="relative">
                        <select
                          value={island}
                          onChange={(e) => setIsland(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select island…</option>
                          {ISLANDS.map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </Field>
                    <Field label="Country">
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Bahamas"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </>
              )}
            </SectionCard>

            {/* ── 4. Capacity & Registration ── */}
            <SectionCard number={4} title="Capacity & Registration" subtitle="Control who can sign up and how many">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Requires Registration</p>
                  <p className="text-xs text-gray-500">Attendees must sign up in advance</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequiresRegistration((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${requiresRegistration ? 'bg-[#0dd5b5]' : 'bg-gray-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${requiresRegistration ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              <Field label="Capacity" hint="Leave blank for unlimited attendance">
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min={1}
                  placeholder="Unlimited"
                  className={inputClass}
                />
              </Field>
            </SectionCard>

            {/* ── 5. Pricing ── */}
            <SectionCard number={5} title="Pricing" subtitle="Set your ticket prices or mark it as free">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Free Event</p>
                  <p className="text-xs text-gray-500">No charge to attend</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFree((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isFree ? 'bg-[#0dd5b5]' : 'bg-gray-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isFree ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {!isFree && (
                <div className="space-y-4">
                  {tiers.map((tier, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">
                          Ticket Tier {i + 1}
                        </span>
                        {tiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setTiers((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-xs text-red-400 hover:text-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Tier Name" required error={errors[`tier_name_${i}`]}>
                          <input
                            type="text"
                            value={tier.tierName}
                            onChange={(e) => updateTier(i, 'tierName', e.target.value)}
                            placeholder="e.g. General, VIP, Early Bird"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Description">
                          <input
                            type="text"
                            value={tier.description}
                            onChange={(e) => updateTier(i, 'description', e.target.value)}
                            placeholder="Optional details"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <Field label="Price" required error={errors[`tier_price_${i}`]}>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => updateTier(i, 'price', e.target.value)}
                            min={0}
                            step="0.01"
                            placeholder="0.00"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Currency">
                          <div className="relative">
                            <select
                              value={tier.currency}
                              onChange={(e) => updateTier(i, 'currency', e.target.value)}
                              className={selectClass}
                            >
                              <option value="BSD">BSD</option>
                              <option value="USD">USD</option>
                            </select>
                            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </Field>
                        <Field label="Early Bird Price" hint="Optional">
                          <input
                            type="number"
                            value={tier.earlyBirdPrice}
                            onChange={(e) => updateTier(i, 'earlyBirdPrice', e.target.value)}
                            min={0}
                            step="0.01"
                            placeholder="—"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setTiers((prev) => [...prev, emptyTier()])}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-400 hover:border-[#0dd5b5] hover:text-[#0dd5b5] transition-colors"
                  >
                    + Add Another Tier
                  </button>
                </div>
              )}
            </SectionCard>

            {/* ── 6. Contact Info ── */}
            <SectionCard number={6} title="Contact Info" subtitle="How can attendees reach you?">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Email" hint="Optional">
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone" hint="Optional">
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 242 000 0000"
                    className={inputClass}
                  />
                </Field>
                <Field label="WhatsApp" hint="Optional">
                  <input
                    type="tel"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="+1 242 000 0000"
                    className={inputClass}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* ── Error ── */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {submitError}
              </div>
            )}

            {/* ── Submit ── */}
            <div className="pb-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: submitting ? '#6ee7da' : '#0dd5b5', fontFamily: 'var(--font-display)' }}
              >
                {submitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Publishing Event…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Event
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Your event will be visible to the Bahafit community immediately after publishing.
              </p>
            </div>

          </div>
        </form>
      </main>

      <Footer />
    </>
  )
}
