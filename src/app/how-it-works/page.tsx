import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'How It Works | Bahafit',
  description: 'Learn how Bahafit connects you with fitness listings, events, and trainers across the Caribbean.',
}

export default function HowItWorksPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How Bahafit Works
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Your guide to finding the perfect fitness experience in the Caribbean.
          </p>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* For Fitness Seekers */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">For Fitness Seekers</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Finding your perfect workout has never been easier.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#0dd5b5] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="w-16 h-16 bg-[#0dd5b5]/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                  <svg className="w-8 h-8 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Discover</h3>
                <p className="text-gray-600">
                  Browse our comprehensive directory of gyms, trainers, fitness classes, and wellness centers across the Caribbean islands.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#0dd5b5] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="w-16 h-16 bg-[#0dd5b5]/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                  <svg className="w-8 h-8 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Compare & Choose</h3>
                <p className="text-gray-600">
                  Read reviews, compare prices, check amenities, and find the perfect fit for your fitness goals and budget.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#0dd5b5] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="w-16 h-16 bg-[#0dd5b5]/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                  <svg className="w-8 h-8 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Train</h3>
                <p className="text-gray-600">
                  Contact businesses directly, register for events, and start your fitness journey with confidence.
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </section>

        {/* For Businesses */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">For Fitness Businesses</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Grow your business and reach more fitness enthusiasts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#f7d656] text-gray-900 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="w-16 h-16 bg-[#f7d656]/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                  <svg className="w-8 h-8 text-[#f7d656]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Profile</h3>
                <p className="text-gray-600">
                  Sign up and create a detailed profile showcasing your services, amenities, pricing, and what makes you unique.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#f7d656] text-gray-900 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="w-16 h-16 bg-[#f7d656]/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                  <svg className="w-8 h-8 text-[#f7d656]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Post Events</h3>
                <p className="text-gray-600">
                  Create and promote fitness events, workshops, competitions, and special classes to attract new clients.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#f7d656] text-gray-900 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="w-16 h-16 bg-[#f7d656]/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                  <svg className="w-8 h-8 text-[#f7d656]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Grow Your Reach</h3>
                <p className="text-gray-600">
                  Get discovered by thousands of fitness enthusiasts looking for exactly what you offer.
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/list-your-business"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#f7d656] text-gray-900 font-semibold rounded-lg hover:bg-[#f5cc2f] transition-colors"
              >
                List Your Business
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Platform Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Listings</h3>
                <p className="text-sm text-gray-600">All businesses are verified to ensure quality and reliability.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
                <p className="text-sm text-gray-600">Real reviews from real users help you make informed decisions.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Island-Wide Coverage</h3>
                <p className="text-sm text-gray-600">Find fitness options across multiple Caribbean islands.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
                <p className="text-sm text-gray-600">Get the latest schedules, events, and availability information.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of fitness enthusiasts and businesses already using Bahafit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
              >
                Explore Events
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
