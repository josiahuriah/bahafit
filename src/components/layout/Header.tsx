'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image';

const fitnessEventsMenu = [
  { name: 'Races', href: '/events/races' },
  { name: 'Health & Wellness Expos', href: '/events/expos' },
  { name: 'Fitness Challenges', href: '/events/challenges' },
  { name: 'Bodybuilding Competitions', href: '/events/bodybuilding' },
  { name: 'Weightlifting Competitions', href: '/events/weightlifting' },
]

const fitnessListingsMenu = [
  { name: 'Gyms & Classes', href: '/listings/gyms' },
  { name: 'Activities & Clubs', href: '/listings/clubs' },
  { name: 'Health & Wellness', href: '/listings/wellness' },
  { name: 'Fitness Apparel', href: '/listings/apparel' },
  { name: 'Fitness Equipment', href: '/listings/equipment' },
]

const createMenu = [
  { name: 'Blog Post', href: '/blog/create' },
  { name: 'Event', href: '/create-event' },
  { name: 'Listing', href: '/list-your-business' },
]

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false)
  const [listingsDropdownOpen, setListingsDropdownOpen] = useState(false)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!transparent) return
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparent])

  const isGlass = transparent && !scrolled && !mobileMenuOpen

  return (
    <header className={`${transparent ? 'fixed inset-x-0' : 'sticky'} top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${isGlass ? 'bg-transparent border-b border-transparent' : 'bg-white dark:bg-[#0f1117] border-b border-black/8 dark:border-white/8'}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-between">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={isGlass ? '/images/white-logo.png' : '/images/logo.png'}
                alt="Bahafit"
                width={110}
                height={36}
                className="h-9 w-auto transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation — center */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${isGlass ? 'text-white/90 hover:text-white' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'}`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Home
            </Link>

            {/* Fitness Events Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setEventsDropdownOpen(true)}
              onMouseLeave={() => setEventsDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${isGlass ? 'text-white/90 hover:text-white' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'}`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Events
                <svg className="h-3.5 w-3.5 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {eventsDropdownOpen && (
                <div className="absolute left-0 top-full mt-0 w-52 bg-white dark:bg-[#1a1e26] border border-black/8 dark:border-white/8 shadow-xl shadow-black/5 rounded-lg overflow-hidden z-50">
                  <div className="py-1.5">
                    {fitnessEventsMenu.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-black/70 dark:text-white/70 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fitness Listings Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setListingsDropdownOpen(true)}
              onMouseLeave={() => setListingsDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${isGlass ? 'text-white/90 hover:text-white' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'}`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Listings
                <svg className="h-3.5 w-3.5 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {listingsDropdownOpen && (
                <div className="absolute left-0 top-full mt-0 w-52 bg-white dark:bg-[#1a1e26] border border-black/8 dark:border-white/8 shadow-xl shadow-black/5 rounded-lg overflow-hidden z-50">
                  <div className="py-1.5">
                    {fitnessListingsMenu.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-black/70 dark:text-white/70 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Blog Link */}
            <Link
              href="/blog"
              className={`px-3 py-2 text-sm font-medium transition-colors ${isGlass ? 'text-white/90 hover:text-white' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'}`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Blog
            </Link>
          </div>

          {/* Right Section — Create + Auth */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {/* Create Button */}
            {session && (
              <div
                className="relative"
                onMouseEnter={() => setCreateDropdownOpen(true)}
                onMouseLeave={() => setCreateDropdownOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#0dd5b5] text-black rounded-lg hover:bg-[#0bc4a6] transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create
                </button>

                {createDropdownOpen && (
                  <div className="absolute right-0 top-full mt-0 w-44 bg-white dark:bg-[#1a1e26] border border-black/8 dark:border-white/8 shadow-xl shadow-black/5 rounded-lg overflow-hidden z-50">
                    <div className="py-1.5">
                      {createMenu.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-black/70 dark:text-white/70 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === 'loading' ? (
              <div className="text-sm text-black/40">Loading…</div>
            ) : session ? (
              <div
                className="relative"
                onMouseEnter={() => setAccountDropdownOpen(true)}
                onMouseLeave={() => setAccountDropdownOpen(false)}
              >
                <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${isGlass ? 'text-white/90 hover:text-white' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${isGlass ? 'bg-white/20 backdrop-blur-sm' : 'bg-[#0dd5b5]'}`}>
                    <span className="text-white font-semibold text-xs">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>Account</span>
                  <svg className="h-3.5 w-3.5 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {accountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-0 w-48 bg-white dark:bg-[#1a1e26] border border-black/8 dark:border-white/8 shadow-xl shadow-black/5 rounded-lg overflow-hidden z-50">
                    <div className="py-1.5">
                      <div className="px-4 py-2.5 border-b border-black/6 dark:border-white/6">
                        <div className="text-sm font-semibold text-black dark:text-white">{session.user.name}</div>
                        <div className="text-xs text-black/40 dark:text-white/40 mt-0.5 truncate">{session.user.email}</div>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-black/70 dark:text-white/70 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 transition-colors">
                        Dashboard
                      </Link>
                      {session.user.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-black/70 dark:text-white/70 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      <Link href="/profile" className="block px-4 py-2 text-sm text-black/70 dark:text-white/70 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 transition-colors">
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${isGlass ? 'text-white/90 hover:text-white' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'}`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isGlass ? 'bg-white text-black hover:bg-white/90' : 'bg-black dark:bg-[#0dd5b5] text-white dark:text-black hover:bg-[#0dd5b5] dark:hover:bg-[#0bc4a6]'}`}
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors ${isGlass ? 'text-white/90 hover:text-white' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'}`}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/8 dark:border-white/8 py-4">
            <div className="space-y-0.5">
              <Link
                href="/"
                className="block px-3 py-2.5 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/3 dark:hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/blog"
                className="block px-3 py-2.5 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/3 dark:hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <div>
                <div className="px-3 py-2.5 text-xs font-semibold text-black/40 dark:text-white/30 uppercase tracking-widest">
                  Events
                </div>
                {fitnessEventsMenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block pl-5 pr-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div>
                <div className="px-3 py-2.5 text-xs font-semibold text-black/40 dark:text-white/30 uppercase tracking-widest">
                  Listings
                </div>
                {fitnessListingsMenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block pl-5 pr-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Create Section */}
              {session && (
                <div>
                  <div className="px-3 py-2.5 text-xs font-semibold text-black/40 dark:text-white/30 uppercase tracking-widest">
                    Create
                  </div>
                  {createMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block pl-5 pr-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-[#0dd5b5] hover:bg-[#0dd5b5]/5 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-black/8 dark:border-white/8 mt-3 flex flex-col gap-2 px-3">
                {session ? (
                  <>
                    <div className="text-sm font-medium text-black dark:text-white">{session.user.name}</div>
                    <Link href="/dashboard" className="text-sm text-black/60 dark:text-white/60 hover:text-[#0dd5b5] transition-colors" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    {session.user.role === 'admin' && (
                      <Link href="/admin" className="text-sm text-black/60 dark:text-white/60 hover:text-[#0dd5b5] transition-colors" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false); }}
                      className="text-left text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-center py-2.5 text-sm font-medium text-black dark:text-white border border-black/15 dark:border-white/15 rounded-lg hover:border-black/30 dark:hover:border-white/30 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-center py-2.5 text-sm font-medium bg-black dark:bg-[#0dd5b5] text-white dark:text-black rounded-lg hover:bg-[#0dd5b5] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Join Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
