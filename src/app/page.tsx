import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          {/* Fallback gradient if video doesn't load */}
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Your Caribbean Fitness
              <br />
              <span className="text-blue-400">Community Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Connect with fitness events, trainers, gyms, and wellness centers across the Caribbean
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/events"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Join the most exciting fitness events in the Caribbean
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm font-semibold">Event Image</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>December 15, 2025</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Caribbean Marathon 2025
                </h3>
                <p className="text-gray-600 mb-4">
                  Join hundreds of runners for the annual Caribbean Marathon in Nassau
                </p>
                <Link
                  href="/events/caribbean-marathon"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm font-semibold">Event Image</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>January 8, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Wellness & Fitness Expo
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover the latest in health, wellness, and fitness innovations
                </p>
                <Link
                  href="/events/wellness-expo"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm font-semibold">Event Image</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>February 20, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Caribbean Fitness Challenge
                </h3>
                <p className="text-gray-600 mb-4">
                  Test your strength and endurance in this ultimate fitness competition
                </p>
                <Link
                  href="/events/fitness-challenge"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Trainers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Trainers
            </h2>
            <p className="text-xl text-gray-600">
              Work with certified professionals to reach your fitness goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-sm font-semibold">Trainer Photo</p>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Trainer Name
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Certified Personal Trainer</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Specializing in strength training and nutrition
                  </p>
                  <Link
                    href={`/trainers/trainer-${i}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/trainers"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Trainers
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore By Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Gyms & Classes', icon: '🏋️', href: '/listings/gyms' },
              { name: 'Wellness Centers', icon: '🧘', href: '/listings/wellness' },
              { name: 'Activities & Clubs', icon: '⚽', href: '/listings/clubs' },
              { name: 'Fitness Apparel', icon: '👕', href: '/listings/apparel' },
              { name: 'Equipment', icon: '🏃', href: '/listings/equipment' },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="bg-gray-50 hover:bg-blue-50 rounded-lg p-6 text-center transition-colors group"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts in the Caribbean community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              href="/list-your-business"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
