'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const LISTING_TYPES = [
  { value: 'gym', label: '🏋️ Gym / Fitness Center' },
  { value: 'trainer', label: '💪 Personal Trainer' },
  { value: 'fitness_class', label: '🤸 Fitness Class' },
  { value: 'wellness_center', label: '🧖 Wellness Center / Spa' },
  { value: 'yoga_studio', label: '🧘 Yoga / Pilates Studio' },
  { value: 'crossfit_box', label: '🏆 CrossFit Box' },
  { value: 'martial_arts', label: '🥋 Martial Arts Academy' },
  { value: 'dance_studio', label: '💃 Dance Studio' },
  { value: 'aquatics', label: '🏊 Swimming / Aquatics' },
  { value: 'sports_club', label: '⚽ Sports Club' },
  { value: 'equipment_sale', label: '🛒 Fitness Equipment (Sale)' },
  { value: 'equipment_rental', label: '🔁 Fitness Equipment (Rental)' },
  { value: 'apparel', label: '👕 Fitness Apparel' },
  { value: 'supplements', label: '💊 Supplements / Nutrition' },
  { value: 'nutrition_coaching', label: '🥗 Nutrition Coaching' },
  { value: 'sports_medicine', label: '🩺 Sports Medicine / Physio' },
  { value: 'massage', label: '💆 Massage Therapy' },
  { value: 'pt_services', label: '🎯 Personal Training Services' },
  { value: 'group_training', label: '👥 Group Training' },
  { value: 'online_coaching', label: '💻 Online Coaching' },
  { value: 'fitness_retreat', label: '🏝️ Fitness Retreat' },
  { value: 'facility_rental', label: '🏟️ Sports Facility Rental' },
  { value: 'other', label: '✨ Other' },
]

const CATEGORIES = [
  { value: 'services', label: 'Services' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'classes', label: 'Classes' },
  { value: 'products', label: 'Products' },
  { value: 'rentals', label: 'Rentals' },
]

const ISLANDS = [
  'New Providence', 'Grand Bahama', 'Abaco', 'Eleuthera',
  'Exuma', 'Andros', 'Bimini', 'Long Island',
  'Cat Island', 'San Salvador', 'Other',
]

const AMENITY_OPTIONS = [
  { value: 'free_weights', label: 'Free Weights' },
  { value: 'cardio', label: 'Cardio Equipment' },
  { value: 'weight_machines', label: 'Weight Machines' },
  { value: 'pool', label: 'Swimming Pool' },
  { value: 'sauna', label: 'Sauna' },
  { value: 'steam_room', label: 'Steam Room' },
  { value: 'lockers', label: 'Locker Rooms' },
  { value: 'showers', label: 'Showers' },
  { value: 'parking', label: 'Parking' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'ac', label: 'Air Conditioning' },
  { value: 'juice_bar', label: 'Juice Bar' },
  { value: 'childcare', label: 'Child Care' },
  { value: 'personal_training', label: 'Personal Training' },
  { value: 'group_classes', label: 'Group Classes' },
  { value: 'outdoor_training', label: 'Outdoor Training Area' },
  { value: 'beach_access', label: 'Beach Access' },
  { value: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
]

const SPECIALIZATION_OPTIONS = [
  { value: 'personal_training', label: 'Personal Training' },
  { value: 'strength_conditioning', label: 'Strength & Conditioning' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'sports_performance', label: 'Sports Performance' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'nutrition', label: 'Nutrition Coaching' },
  { value: 'rehabilitation', label: 'Rehabilitation' },
  { value: 'senior_fitness', label: 'Senior Fitness' },
  { value: 'prenatal_postnatal', label: 'Pre/Postnatal' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'martial_arts', label: 'Martial Arts' },
  { value: 'dance_fitness', label: 'Dance Fitness' },
  { value: 'bodybuilding', label: 'Bodybuilding' },
  { value: 'functional', label: 'Functional Training' },
  { value: 'group_fitness', label: 'Group Fitness' },
]

const TRAINER_TYPES = new Set([
  'trainer',
  'pt_services',
  'online_coaching',
  'group_training',
  'nutrition_coaching',
])

const FACILITY_TYPES = new Set([
  'gym',
  'fitness_class',
  'wellness_center',
  'yoga_studio',
  'crossfit_box',
  'martial_arts',
  'dance_studio',
  'aquatics',
  'sports_club',
  'facility_rental',
])

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

function Toggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-[#0dd5b5]' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

function CheckboxGrid({
  options,
  selected,
  onToggle,
}: {
  options: Array<{ value: string; label: string }>
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => {
        const isOn = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
              isOn
                ? 'border-[#0dd5b5] bg-[#0dd5b5]/10 text-[#0a6e70] font-semibold'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0dd5b5]/40 focus:border-[#0dd5b5] transition-all bg-gray-50/50'

const selectClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0dd5b5]/40 focus:border-[#0dd5b5] transition-all bg-gray-50/50 appearance-none'

export default function CreateListingPage() {
  const { status } = useSession()
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Section 1 — Basic Info
  const [title, setTitle] = useState('')
  const [listingType, setListingType] = useState('')
  const [category, setCategory] = useState('')
  const [shortDescription, setShortDescription] = useState('')

  // Section 2 — Location
  const [hasPhysicalLocation, setHasPhysicalLocation] = useState(true)
  const [offersOnlineServices, setOffersOnlineServices] = useState(false)
  const [venue, setVenue] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [island, setIsland] = useState('')
  const [country, setCountry] = useState('Bahamas')
  const [serviceAreas, setServiceAreas] = useState('')

  // Section 3 — Contact
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactWhatsapp, setContactWhatsapp] = useState('')
  const [website, setWebsite] = useState('')

  // Section 4 — Hours
  const [byAppointmentOnly, setByAppointmentOnly] = useState(false)
  const [operatingHours, setOperatingHours] = useState('')

  // Section 5 — Details (type-specific)
  const [amenities, setAmenities] = useState<string[]>([])
  const [specializations, setSpecializations] = useState<string[]>([])
  const [features, setFeatures] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/listings/new')
    }
  }, [status, router])

  const showAmenities = FACILITY_TYPES.has(listingType)
  const showSpecializations = TRAINER_TYPES.has(listingType)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Listing name is required'
    if (!listingType) e.listingType = 'Listing type is required'
    if (hasPhysicalLocation && !city.trim()) e.city = 'City is required for physical locations'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const toggleSet = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => (value: string) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')

    const payload = {
      title: title.trim(),
      listingType,
      category: category || undefined,
      shortDescription: shortDescription.trim() || undefined,
      hasPhysicalLocation,
      offersOnlineServices,
      location: hasPhysicalLocation
        ? {
            venueName: venue || undefined,
            address: address || undefined,
            city: city || undefined,
            island: island || undefined,
            country: country || undefined,
          }
        : undefined,
      serviceAreas: !hasPhysicalLocation && serviceAreas
        ? serviceAreas
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      contact: {
        email: contactEmail || undefined,
        phone: contactPhone || undefined,
        whatsapp: contactWhatsapp || undefined,
        website: website || undefined,
      },
      byAppointmentOnly,
      operatingHours: operatingHours.trim() || undefined,
      amenities: showAmenities ? amenities : [],
      specializations: showSpecializations ? specializations : [],
      features: features
        ? features
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    }

    try {
      const res = await fetch('/api/listings/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to create listing')
        setSubmitting(false)
        return
      }
      router.push('/dashboard?listing_created=1')
    } catch {
      setSubmitError('An unexpected error occurred')
      setSubmitting(false)
    }
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
              Create a New Listing
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-8">
            Fill in the details below to publish your listing to the Bahafit community.
          </p>
        </div>
      </div>

      <main className="bg-gray-50/80 min-h-screen">
        <form onSubmit={handleSubmit} noValidate>
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

            {/* ── 1. Basic Info ── */}
            <SectionCard number={1} title="Basic Info" subtitle="Tell people what your listing is about">
              <Field label="Listing Name" required error={errors.title}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Island Strength Gym"
                  className={inputClass}
                />
              </Field>

              <Field label="Listing Type" required error={errors.listingType}>
                <div className="relative">
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select a listing type…</option>
                    {LISTING_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Field>

              <Field label="Category" hint="Optional — helps people browse">
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select a category…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
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
                  placeholder="Give a brief summary of what you offer…"
                  rows={3}
                  className={inputClass + ' resize-none'}
                />
              </Field>
            </SectionCard>

            {/* ── 2. Location ── */}
            <SectionCard number={2} title="Location" subtitle="Where can people find you?">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Has a Physical Location</p>
                  <p className="text-xs text-gray-500">Toggle off for mobile or fully online businesses</p>
                </div>
                <Toggle on={hasPhysicalLocation} onChange={() => setHasPhysicalLocation((v) => !v)} />
              </div>

              {hasPhysicalLocation ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Venue Name">
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Cable Beach Plaza"
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
                    <Field label="City" required error={errors.city}>
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
              ) : (
                <Field label="Service Areas" hint="Comma separated — e.g. Nassau, Paradise Island, Cable Beach">
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    placeholder="Nassau, Paradise Island"
                    className={inputClass}
                  />
                </Field>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Offers Online / Virtual Services</p>
                  <p className="text-xs text-gray-500">Live classes, online coaching, virtual consults</p>
                </div>
                <Toggle on={offersOnlineServices} onChange={() => setOffersOnlineServices((v) => !v)} />
              </div>
            </SectionCard>

            {/* ── 3. Contact ── */}
            <SectionCard number={3} title="Contact Info" subtitle="How can people reach you?">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 242 000 0000"
                    className={inputClass}
                  />
                </Field>
                <Field label="WhatsApp">
                  <input
                    type="tel"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="+1 242 000 0000"
                    className={inputClass}
                  />
                </Field>
                <Field label="Website">
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className={inputClass}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* ── 4. Hours & Availability ── */}
            <SectionCard number={4} title="Hours & Availability" subtitle="When are you open?">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">By Appointment Only</p>
                  <p className="text-xs text-gray-500">Clients book ahead rather than walking in</p>
                </div>
                <Toggle on={byAppointmentOnly} onChange={() => setByAppointmentOnly((v) => !v)} />
              </div>

              {!byAppointmentOnly && (
                <Field label="Operating Hours" hint="A short summary — e.g. Mon–Fri 6am–9pm, Sat–Sun 7am–6pm">
                  <textarea
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="Mon–Fri 6am–9pm, Sat–Sun 7am–6pm"
                    rows={2}
                    className={inputClass + ' resize-none'}
                  />
                </Field>
              )}
            </SectionCard>

            {/* ── 5. Details ── */}
            <SectionCard number={5} title="Details" subtitle="Tell people what makes your listing unique">
              {showAmenities && (
                <Field label="Amenities" hint="Select everything that applies">
                  <CheckboxGrid
                    options={AMENITY_OPTIONS}
                    selected={amenities}
                    onToggle={toggleSet(setAmenities)}
                  />
                </Field>
              )}

              {showSpecializations && (
                <Field label="Specializations" hint="Select your areas of expertise">
                  <CheckboxGrid
                    options={SPECIALIZATION_OPTIONS}
                    selected={specializations}
                    onToggle={toggleSet(setSpecializations)}
                  />
                </Field>
              )}

              <Field label="Other Features" hint="Comma separated — anything not in the lists above">
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Free intro session, Bilingual coaching"
                  className={inputClass}
                />
              </Field>
            </SectionCard>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {submitError}
              </div>
            )}

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
                    Publishing Listing…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Listing
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Your listing will be visible to the Bahafit community immediately after publishing.
              </p>
            </div>

          </div>
        </form>
      </main>

      <Footer />
    </>
  )
}
