'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CheckoutCancelledPage() {
  const params = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId')

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment wasn&apos;t completed and you haven&apos;t been charged. Your registration is on hold; you can try again whenever you&apos;re ready.
          </p>
          {registrationId && (
            <p className="text-xs text-gray-400 mb-6">Reference: {registrationId}</p>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/events/${params.slug}/checkout`}
              className="bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors"
            >
              Try again
            </Link>
            <Link
              href={`/events/${params.slug}`}
              className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Back to event
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
