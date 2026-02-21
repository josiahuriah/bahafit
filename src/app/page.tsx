import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import ExploreSection from '@/components/ExploreSection'


export default function Home() {
  return (
    <>
      <Header />

      {/* ─── Hero Section ─── */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Video Background — Desktop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Video Background — Mobile */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-video2.mp4" type="video/mp4" />
        </video>

      </section>

      {/* ─── Explore Section (was Quick Links) ─── */}
      <ExploreSection />

      {/* ─── Upcoming Events ─── */}
      <section className="py-16 md:py-20 bg-white border-t border-black/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-10">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Upcoming Events
              </h2>
              <p className="text-sm text-black/50 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                The most exciting fitness events in the Caribbean
              </p>
            </div>
            <Link
              href="/events"
              className="hidden md:inline-flex items-center text-sm font-medium text-black/50 hover:text-black transition-colors gap-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View all <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                src: '/images/event1.jpeg',
                date: 'December 15, 2025',
                title: 'Caribbean Marathon 2025',
                description: 'Join hundreds of runners for the annual Caribbean Marathon in Nassau',
                href: '/events/caribbean-marathon',
              },
              {
                src: '/images/event4.jpg',
                date: 'January 8, 2026',
                title: 'Wellness & Fitness Expo',
                description: 'Discover the latest in health, wellness, and fitness innovations',
                href: '/events/wellness-expo',
              },
              {
                src: '/images/event2.jpeg',
                date: 'February 20, 2026',
                title: 'Caribbean Fitness Challenge',
                description: 'Test your strength and endurance in this ultimate fitness competition',
                href: '/events/fitness-challenge',
              },
            ].map((event, i) => (
              <Link
                key={i}
                href={event.href}
                className="group block bg-white border border-black/8 rounded-2xl overflow-hidden hover:border-black/20 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
              >
                <div className="h-56 flex items-center justify-center overflow-hidden bg-black/3">
                  <Image
                    src={event.src}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-black/40 mb-2.5" style={{ fontFamily: 'var(--font-body)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </div>
                  <h3
                    className="text-lg font-bold text-black mb-1.5 group-hover:text-[#0dd5b5] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm text-black/55 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {event.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0dd5b5] hover:text-black transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View all events <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Find Everything ─── */}
      <section className="flex flex-col bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Find everything
            <br />
            <span className="text-[#0dd5b5]">you&apos;re looking for</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:h-[68vh] min-h-[520px]">
          {[
            { number: '01', title: 'FITNESS CLASSES', image: '/images/fitness-classes.jpg', href: '/listings/classes' },
            { number: '02', title: 'NUTRITIONAL EATS', image: '/images/nutritional-eats.jpg', href: '/blog/nutrition' },
            { number: '03', title: 'YOGA CLASSES', image: '/images/yoga-classes.jpg', href: '/listings/studios/yoga' },
            { number: '04', title: 'FITNESS APPAREL', image: '/images/fitness-apparel.jpg', href: '/listings/apparel' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="relative overflow-hidden group cursor-pointer block"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="relative h-full min-h-[260px] md:min-h-0 flex flex-col justify-end p-7 md:p-8">
                <div>
                  <span
                    className="text-5xl md:text-6xl font-bold block mb-2"
                    style={{ color: '#f7d656', fontFamily: 'var(--font-display)' }}
                  >
                    {item.number}
                  </span>
                  <h4
                    className="text-white text-xl md:text-2xl font-bold tracking-wide leading-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Trainers ─── */}
      <section className="py-16 md:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Featured Trainers
              </h2>
              <p className="text-sm text-white/40 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                Certified professionals ready to help you reach your goals
              </p>
            </div>
            <Link
              href="/trainers"
              className="hidden md:inline-flex items-center text-sm font-medium text-white/40 hover:text-white transition-colors gap-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View all <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Darius Johnson', specialty: 'Strength Training & Bodybuilding', image: 'trainer1.jpeg' },
              { name: 'Sarah Williams', specialty: 'Yoga & Flexibility Training', image: 'trainer2.jpeg' },
              { name: 'Renaldo Rahming', specialty: 'CrossFit & HIIT Workouts', image: 'trainer3.jpeg' },
              { name: 'James Rodriguez', specialty: 'Nutrition and Weight Management', image: 'trainer4.jpeg' },
            ].map((trainer, i) => (
              <Link
                key={i}
                href={`/trainers/trainer-${i + 1}`}
                className="group block bg-white/5 border border-white/8 rounded-2xl overflow-hidden hover:border-[#0dd5b5]/50 hover:bg-white/8 transition-all duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={`/images/${trainer.image}`}
                    alt={trainer.name}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="text-base font-bold text-white mb-0.5 group-hover:text-[#0dd5b5] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-white/40 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                    Certified Personal Trainer
                  </p>
                  <p className="text-xs text-white/55 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {trainer.specialty}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/trainers"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0dd5b5] hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View all trainers <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── From Our Blog ─── */}
      <section className="py-16 md:py-20 bg-white border-t border-black/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              From the Blog
            </h2>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center text-sm font-medium text-black/50 hover:text-black transition-colors gap-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View all <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            {/* Featured post */}
            <div>
              <Link href="/blog/getting-started-fitness-bahafit-way" className="group block">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-5">
                  <img
                    src="/images/blog-featured.jpg"
                    alt="Getting started in fitness"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-black/40 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  <span>By Dorisser Johnson</span>
                  <span>·</span>
                  <span>November 15, 2025</span>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold text-black mb-3 group-hover:text-[#0dd5b5] transition-colors leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Getting started in fitness, the Bahafit way
                </h3>
                <p className="text-sm text-black/60 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  Starting your fitness journey can feel overwhelming, but it doesn&apos;t have to be.
                  Discover how Bahafit makes it easy to find the right gym, trainer, and community to support your goals.
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0dd5b5] group-hover:gap-2.5 transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Read More <span aria-hidden>→</span>
                </span>
              </Link>
            </div>

            {/* Recent posts */}
            <div className="flex flex-col divide-y divide-black/6">
              {[
                { title: 'Top 5 Gyms in Nassau for Strength Training', author: 'Michael Brown', date: 'November 10, 2025', slug: 'top-5-gyms-nassau-strength-training' },
                { title: 'Healthy Eating Guide: Best Meal Prep Services', author: 'Jessica Williams', date: 'November 5, 2025', slug: 'healthy-eating-guide-meal-prep-services' },
                { title: 'How to Stay Consistent with Your Fitness Goals', author: 'David Thompson', date: 'October 28, 2025', slug: 'stay-consistent-fitness-goals' },
                { title: 'Best Running Routes in the Bahamas', author: 'Marcus Thompson', date: 'October 20, 2025', slug: 'best-running-routes-bahamas' },
              ].map((post, i) => (
                <Link
                  key={i}
                  href={`/blog/${post.slug}`}
                  className="group py-5 first:pt-0 last:pb-0 block"
                >
                  <h4
                    className="text-base font-bold text-black mb-1.5 group-hover:text-[#0dd5b5] transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-black/40" style={{ fontFamily: 'var(--font-body)' }}>
                    <span>By {post.author}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gyms and Studios ─── */}
      <section className="py-16 md:py-20 bg-black/3 border-t border-black/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Gyms &amp; Studios
              </h2>
              <p className="text-sm text-black/50 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                The best fitness facilities in the Bahamas
              </p>
            </div>
            <Link
              href="/listings/gyms"
              className="hidden md:inline-flex items-center text-sm font-medium text-black/50 hover:text-black transition-colors gap-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View all <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Macfit West', image: 'macfit-west.jpeg' },
              { name: 'Club One', image: 'clubone.jpeg' },
              { name: 'Macfit East', image: 'macfit-east.jpeg' },
              { name: 'Empire', image: 'empire.jpeg' },
            ].map((gym, i) => (
              <Link
                key={i}
                href={`/gyms/gym-${i + 1}`}
                className="group block bg-white border border-black/8 rounded-2xl overflow-hidden hover:border-black/20 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={`/images/${gym.image}`}
                    alt={gym.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="text-base font-bold text-black group-hover:text-[#0dd5b5] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {gym.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/listings/gyms"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0dd5b5] hover:text-black transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View all gyms <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section
        className="relative py-24 md:py-32 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cta-background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Left — Tagline */}
            <div>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Ready to join a true{' '}
                <span style={{ color: '#f7d656' }}>fitness community</span>?
              </h2>
              <p className="text-base text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Connect with trainers, gyms, events, and fellow fitness enthusiasts across the Bahamas.
              </p>
            </div>

            {/* Right — Signup form */}
            <div className="bg-white rounded-2xl p-7 md:p-8 shadow-2xl shadow-black/30">
              <h3
                className="text-2xl font-bold text-black mb-6 uppercase"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Get Started Today
              </h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-black/50 mb-1.5 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-black/12 rounded-lg text-sm focus:ring-2 focus:ring-[#0dd5b5]/30 focus:border-[#0dd5b5] outline-none transition-all"
                    placeholder="Enter your name"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-black/50 mb-1.5 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-black/12 rounded-lg text-sm focus:ring-2 focus:ring-[#0dd5b5]/30 focus:border-[#0dd5b5] outline-none transition-all"
                    placeholder="Enter your email"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-black/50 mb-1.5 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border border-black/12 rounded-lg text-sm focus:ring-2 focus:ring-[#0dd5b5]/30 focus:border-[#0dd5b5] outline-none transition-all"
                    placeholder="Create a password"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-[#0dd5b5] hover:text-black px-6 py-3.5 rounded-lg font-semibold transition-all text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Create Account
                </button>
                <p className="text-xs text-black/50 text-center" style={{ fontFamily: 'var(--font-body)' }}>
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-[#0dd5b5] hover:text-black font-semibold transition-colors">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
