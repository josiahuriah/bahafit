import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'How It Works | Bahafit',
  description: 'Learn how Bahafit connects you with fitness listings, events, and trainers across the Caribbean.',
}

const seekerSteps = [
  {
    num: '01',
    title: 'Search & Discover',
    body: 'Browse our comprehensive directory of gyms, trainers, fitness classes, and wellness centers across the Caribbean islands.',
  },
  {
    num: '02',
    title: 'Compare & Choose',
    body: 'Review details, compare services and pricing, check amenities, and find the perfect fit for your fitness goals.',
  },
  {
    num: '03',
    title: 'Connect & Train',
    body: 'Reach out directly to businesses, register for events, and start your fitness journey with total confidence.',
  },
]

const businessSteps = [
  {
    num: '01',
    title: 'Create Your Profile',
    body: 'Sign up and build a detailed profile showcasing your services, amenities, pricing, and what makes your business unique.',
  },
  {
    num: '02',
    title: 'Post Events',
    body: 'Create and promote fitness events, workshops, competitions, and special classes to attract and engage new clients.',
  },
  {
    num: '03',
    title: 'Grow Your Reach',
    body: 'Get discovered by thousands of fitness enthusiasts who are actively looking for exactly what you offer.',
  },
]

const features = [
  { label: 'Verified Listings', desc: 'All businesses are verified to ensure quality and reliability.' },
  { label: 'Island-Wide Coverage', desc: 'Find fitness options across multiple Caribbean islands.' },
  { label: 'Real-Time Updates', desc: 'Get the latest schedules, events, and availability.' },
  { label: 'Direct Contact', desc: 'Reach businesses and trainers instantly, no middleman.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-black min-h-[55vh] flex items-end pb-16 pt-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl">
          <p className="text-[#0dd5b5] text-xs tracking-[0.4em] uppercase mb-8 font-medium">How It Works</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight">
            Simple.<br />
            <span className="text-[#f7d656]">Straightforward.</span><br />
            Effective.
          </h1>
        </div>
      </section>

      {/* For Seekers */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-16">
            <span className="text-[#0dd5b5] text-xs tracking-[0.4em] uppercase font-medium">For You</span>
            <div className="hidden sm:block w-12 h-px bg-gray-200"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Finding your fitness</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {seekerSteps.map((step, i) => (
              <div key={i} className="py-10 md:py-0 md:pr-12 last:pr-0 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 md:pl-12 first:pl-0">
                <div className="text-7xl font-bold text-[#0dd5b5]/15 leading-none mb-4 select-none">{step.num}</div>
                <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-gray-100">
            <Link
              href="/listings"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0dd5b5] text-black text-sm font-semibold tracking-wide hover:bg-[#0bc5a5] transition-colors"
            >
              Browse Listings <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-16">
            <span className="text-[#f7d656] text-xs tracking-[0.4em] uppercase font-medium">For Businesses</span>
            <div className="hidden sm:block w-12 h-px bg-gray-700"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Growing your audience</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {businessSteps.map((step, i) => (
              <div key={i} className="py-10 md:py-0 md:pr-12 last:pr-0 border-b md:border-b-0 md:border-r border-white/10 last:border-0 md:pl-12 first:pl-0">
                <div className="text-7xl font-bold text-[#f7d656]/15 leading-none mb-4 select-none">{step.num}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-white/10">
            <Link
              href="/list-your-business"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#f7d656] text-black text-sm font-semibold tracking-wide hover:bg-[#f5cc2f] transition-colors"
            >
              List Your Business <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-[#0dd5b5] text-xs tracking-[0.4em] uppercase font-medium">Platform Features</span>
            <div className="w-12 h-px bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-8">
                <div className="w-2 h-2 rounded-full bg-[#0dd5b5] mb-6"></div>
                <h3 className="font-bold text-black mb-2 text-sm">{f.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0dd5b5] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Ready to get started?</h2>
            <p className="text-black/60 mt-2 text-base">Join thousands already using Bahafit.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/events"
              className="px-8 py-4 bg-black text-white text-sm font-semibold tracking-wide hover:bg-gray-900 transition-colors"
            >
              Explore Events
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-black text-black text-sm font-semibold tracking-wide hover:bg-black hover:text-[#0dd5b5] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
