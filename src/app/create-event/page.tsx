'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const eventTypes = [
  { name: 'Fitness Classes', icon: '🏋️', description: 'Yoga, HIIT, spin, and more' },
  { name: 'Competitions', icon: '🏆', description: 'Races, challenges, tournaments' },
  { name: 'Workshops', icon: '📚', description: 'Educational sessions and seminars' },
  { name: 'Wellness Retreats', icon: '🧘', description: 'Multi-day wellness experiences' },
  { name: 'Community Meetups', icon: '🤝', description: 'Group runs, beach workouts' },
  { name: 'Certification Courses', icon: '📜', description: 'Professional development' },
]

const features = [
  {
    title: 'Easy Event Creation',
    description: 'User-friendly form to create detailed event listings in minutes.',
    icon: '✨',
  },
  {
    title: 'Registration Management',
    description: 'Track attendees and manage event capacity effortlessly.',
    icon: '📋',
  },
  {
    title: 'Promotion Tools',
    description: 'Featured placement options to maximize your event visibility.',
    icon: '📢',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track views, registrations, and engagement for your events.',
    icon: '📊',
  },
]

export default function CreateEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // If already signed in, skip the marketing page and go straight to the form
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/events/new')
    }
  }, [status, router])

  // Show spinner while checking session or mid-redirect
  if (status === 'loading' || status === 'authenticated') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent" />
        </div>
        <Footer />
      </>
    )
  }

  // Only unauthenticated visitors see the marketing page below
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#f7d656] to-[#f5cc2f] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Create a Fitness Event
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-8">
            Promote your fitness event to thousands of health-conscious individuals across the Caribbean.
          </p>
          <Link
            href="/auth/signup?callbackUrl=/events/new"
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-lg"
          >
            Start Creating
          </Link>
          <p className="mt-4 text-sm text-gray-700">
            Already have an account?{' '}
            <Link href="/auth/signin?callbackUrl=/events/new" className="font-semibold underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* Event Types */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">What Events Can You Create?</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Host any type of fitness or wellness event on our platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventTypes.map((type, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
                  <div className="text-4xl">{type.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Event Creation Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f7d656]/20 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How to Create an Event</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f7d656] text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Sign Up or Log In</h3>
                <p className="text-gray-600">Create an account or log in to get started.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f7d656] text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">Fill in Event Details</h3>
                <p className="text-gray-600">Add your event title, description, date, location, pricing, and images.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f7d656] text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Publish & Promote</h3>
                <p className="text-gray-600">Submit and start receiving registrations immediately.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Host Your Event?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Create your event today and reach fitness enthusiasts across the Caribbean.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup?callbackUrl=/events/new"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#f7d656] text-gray-900 font-semibold rounded-lg hover:bg-[#f5cc2f] transition-colors"
              >
                Create Your Event
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
