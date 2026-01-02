import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | Bahafit',
  description: 'Learn about Bahafit - connecting the Caribbean fitness community with events, trainers, and wellness resources.',
}

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About Bahafit
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Connecting the Caribbean fitness community with events, trainers, and wellness resources since 2024.
          </p>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-4">
                  Bahafit was founded with a simple mission: to make fitness accessible, enjoyable, and community-driven across the Caribbean.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  We believe that everyone deserves access to quality fitness resources, whether you're looking for a local gym, a personal trainer, or an exciting fitness event to participate in.
                </p>
                <p className="text-lg text-gray-600">
                  Our platform connects fitness enthusiasts with businesses, trainers, and events that match their goals and interests, creating a thriving wellness ecosystem throughout the islands.
                </p>
              </div>
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0dd5b5]/20 to-[#f7d656]/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💪</div>
                    <p className="text-xl font-semibold text-gray-700">Empowering Caribbean Fitness</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#0dd5b5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
                <p className="text-gray-600">
                  We prioritize building strong connections within the Caribbean fitness community, fostering support and collaboration.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#f7d656]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#f7d656]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality & Trust</h3>
                <p className="text-gray-600">
                  We verify our listings and ensure high standards to provide you with reliable fitness options you can trust.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#0dd5b5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Fitness should be for everyone. We work to make health and wellness accessible across all islands and communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#0dd5b5] mb-2">500+</div>
                <div className="text-gray-400">Fitness Listings</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#f7d656] mb-2">100+</div>
                <div className="text-gray-400">Events Hosted</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0dd5b5] mb-2">15+</div>
                <div className="text-gray-400">Islands Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#f7d656] mb-2">10K+</div>
                <div className="text-gray-400">Community Members</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Community</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a fitness enthusiast looking for your next workout or a business wanting to reach more clients, Bahafit is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
              >
                Browse Listings
              </Link>
              <Link
                href="/list-your-business"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
              >
                List Your Business
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
