import type { Metadata } from 'next'
import Image from 'next/image'
import { Bebas_Neue } from 'next/font/google'
import WaitlistForm from './WaitlistForm'
import './coming-soon.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bahafit — Coming Soon',
  description:
    'The all-in-one fitness and wellness platform for the Caribbean. Connect, track and grow with a community that supports your goals.',
}

export default function ComingSoonPage() {
  return (
    <div className={`cs-root ${bebasNeue.variable}`}>
      <div className="cs-page">
        <div className="cs-waves" />

        <div className="cs-shell">
          {/* LEFT: Website preview */}
          <div className="cs-preview-pane">
            <div className="cs-preview-tag">A peek at what&apos;s coming</div>

            <div className="cs-flyer-wrap">
              <Image
                src="/images/coming-soon-preview.jpg"
                alt="Bahafit app preview"
                width={960}
                height={720}
                priority
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div className="cs-float-chip cs-c1">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.32.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              Built for the islands
            </div>
            <div className="cs-float-chip cs-c2">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
              Launching 2026
            </div>
          </div>

          {/* RIGHT: Coming Soon copy + form */}
          <div className="cs-copy-pane">
            <div className="cs-brand-row">
              <Image src="/images/logo.png" alt="Bahafit" width={120} height={30} style={{ height: '30px', width: 'auto' }} />
              <span className="cs-v" />
              <span className="cs-tag">One Platform. All Things Fitness.</span>
            </div>

            <span className="cs-pill-soon">
              <span className="cs-dot" />
              Coming Soon
            </span>

            <h1 className="cs-headline">
              The all-in-one fitness &amp; wellness platform for the{' '}
              <span className="cs-accent">Caribbean.</span>
            </h1>

            <p className="cs-lede">Connect, track and grow with a community that supports your goals.</p>
            <p className="cs-tagline">Track Workouts · Plan Meals · Share Progress · Stay Inspired</p>

            <ul className="cs-features">
              <li className="cs-feature">
                <div className="cs-ico-wrap" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <span className="cs-txt">Discover events</span>
              </li>
              <li className="cs-feature">
                <div className="cs-ico-wrap" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                </div>
                <span className="cs-txt">Find gyms, coaches &amp; businesses</span>
              </li>
              <li className="cs-feature">
                <div className="cs-ico-wrap" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                </div>
                <span className="cs-txt">Join the community</span>
              </li>
              <li className="cs-feature">
                <div className="cs-ico-wrap" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                    />
                  </svg>
                </div>
                <span className="cs-txt">Buy tickets to events</span>
              </li>
            </ul>

            <WaitlistForm />
          </div>
        </div>
      </div>
    </div>
  )
}
