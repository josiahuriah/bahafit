import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'List Your Business | Bahafit',
  description: 'Add your fitness business to Bahafit and reach thousands of health-conscious customers across the Caribbean.',
}

const benefits = [
  {
    icon: '👥',
    title: 'Reach More Customers',
    description: 'Get discovered by thousands of fitness enthusiasts actively searching for services like yours.',
  },
  {
    icon: '📊',
    title: 'Track Performance',
    description: 'Access analytics to see how many people view your listing and engage with your business.',
  },
  {
    icon: '⭐',
    title: 'Build Your Reputation',
    description: 'Collect reviews and ratings that help build trust with potential customers.',
  },
  {
    icon: '📅',
    title: 'Promote Events',
    description: 'Create and promote fitness events, classes, and workshops to attract new clients.',
  },
  {
    icon: '✅',
    title: 'Get Verified',
    description: 'Earn a verified badge to stand out from competitors and build credibility.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Your listing looks great on all devices, reaching customers wherever they are.',
  },
]

const listingTypes = [
  'Gyms & Fitness Centers',
  'Personal Trainers',
  'Yoga & Pilates Studios',
  'CrossFit Boxes',
  'Martial Arts Academies',
  'Dance Studios',
  'Swimming & Aquatics',
  'Wellness Centers & Spas',
  'Sports Clubs',
  'Fitness Equipment Sales',
  'Nutrition Coaching',
  'And More...',
]

export default function ListYourBusinessPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            List Your Fitness Business
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join the Caribbean's premier fitness directory and connect with thousands of health-conscious customers.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0dd5b5] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* Benefits Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Why List With Us?</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Bahafit helps fitness businesses grow by connecting them with the right customers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Listing Types */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Who Can List?</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              We welcome all types of fitness and wellness businesses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listingTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 text-center text-gray-700 font-medium"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="w-12 h-12 bg-[#0dd5b5] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
                <p className="text-sm text-gray-600">Create a free account in minutes.</p>
              </div>

              <div className="text-center relative">
                <div className="w-12 h-12 bg-[#0dd5b5] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Your Listing</h3>
                <p className="text-sm text-gray-600">Add your business details, photos, and services.</p>
              </div>

              <div className="text-center relative">
                <div className="w-12 h-12 bg-[#0dd5b5] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Verified</h3>
                <p className="text-sm text-gray-600">Our team reviews and verifies your listing.</p>
              </div>

              <div className="text-center relative">
                <div className="w-12 h-12 bg-[#0dd5b5] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Growing</h3>
                <p className="text-sm text-gray-600">Get discovered by customers and grow your business.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of fitness businesses already using Bahafit to reach more customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
              >
                Create Free Listing
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
