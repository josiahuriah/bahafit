import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | Bahafit',
  description: 'Learn about Bahafit — connecting the Caribbean fitness community with events, trainers, and wellness resources.',
}

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-black min-h-[60vh] flex items-end pb-16 pt-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl">
          <p className="text-[#0dd5b5] text-xs tracking-[0.4em] uppercase mb-8 font-medium">About Bahafit</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight">
            We believe<br />
            fitness belongs<br />
            <span className="text-[#0dd5b5]">to everyone.</span>
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="block text-[100px] lg:text-[130px] font-bold text-[#f7d656] leading-none -ml-1 -mt-6 select-none">
                01
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">Our Mission</h2>
            </div>
            <div className="lg:pt-16 space-y-5">
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                Bahafit was founded with a single purpose: to make the Caribbean&apos;s fitness landscape accessible, connected, and alive.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                Whether you&apos;re searching for your first gym, a seasoned trainer, or the next big fitness event — we&apos;ve built the platform that brings it all together.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                Our platform connects fitness enthusiasts with businesses, trainers, and events that match their goals, creating a thriving wellness ecosystem throughout the islands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[#0dd5b5] text-xs tracking-[0.4em] uppercase font-medium">What Drives Us</span>
            <div className="w-16 h-px bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Community First',
                body: 'We prioritize building strong connections within the Caribbean fitness community, fostering support and collaboration among all who share a passion for health.',
              },
              {
                title: 'Quality & Trust',
                body: 'We verify our listings and maintain high standards to provide you with reliable fitness options you can genuinely trust.',
              },
              {
                title: 'Accessibility',
                body: 'Fitness should never feel exclusive. We work to make health and wellness reachable across all islands and every community.',
              },
            ].map((val, i) => (
              <div key={i} className="border-t-2 border-black pt-8">
                <h3 className="text-xl font-bold text-black mb-4">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{val.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proudly Bahamian */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="block text-[100px] lg:text-[130px] font-bold text-black/[0.04] leading-none -ml-1 -mt-6 select-none">
                02
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-black -mt-12">Proudly Bahamian</h2>
              <p className="text-gray-500 leading-relaxed mt-6 text-base">
                Born in Nassau and built for the islands. Bahafit is more than a directory — it&apos;s a movement to make the Caribbean the most active, connected, and health-forward region in the world.
              </p>
            </div>
            <div className="flex flex-col">
              {[
                { label: 'Founded', value: '2024' },
                { label: 'Headquarters', value: 'Nassau, Bahamas' },
                { label: 'Coverage', value: 'Caribbean-wide' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-5 border-b border-gray-200 last:border-b-0">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">{item.label}</span>
                  <span className="font-bold text-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0dd5b5] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Ready to be part of it?</h2>
            <p className="text-black/60 mt-2 text-base">Join thousands already moving with Bahafit.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/listings"
              className="px-8 py-4 bg-black text-white text-sm font-semibold tracking-wide hover:bg-gray-900 transition-colors"
            >
              Browse Listings
            </Link>
            <Link
              href="/list-your-business"
              className="px-8 py-4 border-2 border-black text-black text-sm font-semibold tracking-wide hover:bg-black hover:text-[#0dd5b5] transition-colors"
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
