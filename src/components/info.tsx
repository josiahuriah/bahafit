import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image';

<section className="relative py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0dd5b5] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f7d656] opacity-5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#0dd5b5] bg-opacity-10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-[#0dd5b5] rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold" style={{ color: '#0dd5b5' }}>
                  YOUR FITNESS HUB
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block" style={{ color: '#0dd5b5' }}>What is</span>
                <span className="block mt-2" style={{ color: '#f7d656' }}>Bahafit</span>
                <span className="text-black">?</span>
              </h2>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  Bahafit is your{' '}
                  <span className="font-bold relative inline-block">
                    <span style={{ color: '#0dd5b5' }}>one-stop shop</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#f7d656] opacity-30"></span>
                  </span>
                  {' '}for everything fitness in the Bahamas.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  From events and competitions to gyms, trainers, and wellness centers, we bring the entire fitness community together in one place.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#0dd5b5] hover:bg-[#0bc5a5] text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105 group"
                >
                  Learn More
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column - Image with Modern Layout */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/workout1.jpg"
                  alt="Fitness workout"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border-4 border-[#f7d656]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0dd5b5] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-black">100% Verified</div>
                    <div className="text-sm text-gray-600">All listings verified</div>
                  </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-8 -right-8 w-32 h-32 bg-[#f7d656] rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
