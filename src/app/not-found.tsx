import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />

      <main
        className="relative min-h-[calc(100vh-80px)] bg-black flex flex-col items-center justify-center overflow-hidden px-6"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#0dd5b5 1px, transparent 1px), linear-gradient(to right, #0dd5b5 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glowing orb behind the 404 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(13,213,181,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto">

          {/* Big 404 */}
          <div className="relative mb-6 select-none">
            <span
              className="text-[160px] sm:text-[220px] font-bold leading-none tracking-tighter text-white/5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              404
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center text-[80px] sm:text-[110px] font-bold leading-none tracking-tighter text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              4<span style={{ color: '#0dd5b5' }}>0</span>4
            </span>
          </div>

          {/* Divider with icon */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-white/10" />
            <div className="w-8 h-8 rounded-full border border-[#0dd5b5]/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="h-px w-16 bg-white/10" />
          </div>

          {/* Headline */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Looks like you skipped<br />
            <span style={{ color: '#f7d656' }}>leg day on this page</span>
          </h1>

          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0dd5b5] text-black text-sm font-bold rounded-lg hover:bg-[#0dd5b5]/90 transition-all hover:scale-105"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white text-sm font-semibold rounded-lg hover:border-white/30 transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Browse Events
            </Link>
          </div>

          {/* Bottom hint */}
          <p className="mt-12 text-white/20 text-xs tracking-widest uppercase">
            Bahafit &mdash; Caribbean Fitness Community
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
