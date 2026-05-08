'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface RegistrationView {
  _id: string
  eventId: string
  eventTitle: string
  ticketType?: string
  price: number
  currency: string
  status: string
  paymentStatus: string
  paymentId?: string
}

export default function CheckoutConfirmationPage() {
  const params = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId')

  const [registration, setRegistration] = useState<RegistrationView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pollCount = useRef(0)

  useEffect(() => {
    let cancelled = false

    async function fetchOnce() {
      if (!registrationId) {
        setError('Missing registration reference. Please check your email for your confirmation.')
        return false
      }
      try {
        const res = await fetch(`/api/registrations/${registrationId}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('We could not find this registration.')
            return false
          }
          // Auth or transient — surface a soft error but keep polling.
          return true
        }
        const data = await res.json()
        if (cancelled) return false
        setRegistration(data.registration)
        // Stop polling once we hit a terminal state.
        if (data.registration?.paymentStatus === 'paid') return false
        if (data.registration?.paymentStatus === 'refunded') return false
        return true
      } catch {
        return true
      }
    }

    async function loop() {
      // Free events hit the confirmation page already at status=confirmed,
      // so the very first fetch is usually enough. For paid events we poll
      // for ~2 minutes waiting on the webhook.
      const keepGoing = await fetchOnce()
      if (!keepGoing || cancelled) return
      pollCount.current += 1
      if (pollCount.current > 24) return // ~2 min at 5s intervals
      setTimeout(loop, 5000)
    }

    loop()
    return () => {
      cancelled = true
    }
  }, [registrationId])

  const isPaid = registration?.paymentStatus === 'paid'
  const isFree = registration && registration.price === 0
  const isPending = registration?.paymentStatus === 'pending'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                href={`/events/${params.slug}`}
                className="inline-block bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
              >
                Back to event
              </Link>
            </div>
          )}

          {!error && !registration && (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent" />
            </div>
          )}

          {!error && registration && (isPaid || isFree) && (
            <div className="text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isFree ? "You're registered!" : 'Payment received'}
              </h1>
              <p className="text-gray-600 mb-6">
                {isFree
                  ? `You're registered for ${registration.eventTitle}.`
                  : `Thanks! Your registration for ${registration.eventTitle} is confirmed.`}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-600 mb-6">
                <p><span className="font-medium text-gray-900">Reference:</span> {registration._id}</p>
                {registration.ticketType && (
                  <p><span className="font-medium text-gray-900">Ticket:</span> {registration.ticketType}</p>
                )}
                {!isFree && (
                  <p><span className="font-medium text-gray-900">Amount:</span> {registration.currency} {registration.price.toFixed(2)}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
                >
                  View my registrations
                </Link>
                <Link
                  href={`/events/${params.slug}`}
                  className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  Back to event
                </Link>
              </div>
            </div>
          )}

          {!error && registration && isPending && !isFree && (
            <div className="text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-amber-600 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming your payment</h1>
              <p className="text-gray-600 mb-6">
                We&apos;re finalizing your registration. This page will update automatically as soon as your payment is confirmed.
              </p>
              <p className="text-xs text-gray-400">
                Reference: {registration._id}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
