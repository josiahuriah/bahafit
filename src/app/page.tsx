import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  heroImage,
  type SeedEvent,
  type SeedListing,
  type EventTagTone,
} from '@/data/seed'
import { getHomepageEvents, getHomepageListings } from '@/data/homepage'
import {
  CalendarIcon,
  UsersIcon,
  DumbbellIcon,
  UserIcon,
  LotusIcon,
  MoreIcon,
  RunIcon,
  GroupIcon,
  StudioIcon,
  ClassesIcon,
  PinIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon,
} from '@/components/home/icons'

// ─── Immersive hero icons (stroke style, viewBox 0 0 24 24, exact design paths) ───
type HeroIconProps = { className?: string }

function HeroEventsIcon({ className }: HeroIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  )
}

function HeroClassesIcon({ className }: HeroIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="6" r="1.6" />
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="17.5" cy="6" r="1.6" />
      <path d="M5 16l1.5-7 2 3h6.5l2-3L19 16" />
      <path d="M5 16l1 4M19 16l-1 4" />
    </svg>
  )
}

function HeroClubsIcon({ className }: HeroIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="2.2" />
      <circle cx="6" cy="9" r="1.8" />
      <circle cx="18" cy="9" r="1.8" />
      <path d="M4 17c.4-2 1.8-3.2 3.5-3.5" />
      <path d="M20 17c-.4-2-1.8-3.2-3.5-3.5" />
      <path d="M8 19c.5-2.5 2-3.8 4-3.8S15.5 16.5 16 19" />
    </svg>
  )
}

function HeroRunsIcon({ className }: HeroIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14.5" cy="5.5" r="1.8" />
      <path d="M7 21l3-5 2-3-3-2-1 3-3 1" />
      <path d="M12 13l3 2 2 4" />
      <path d="M15 10l3-1 2 2" />
    </svg>
  )
}

function HeroArrowIcon({ className }: HeroIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// Floating category shortcuts shared across both breakpoints
const heroCategories = [
  { label: 'Events', Icon: HeroEventsIcon, href: '/events' },
  { label: 'Classes', Icon: HeroClassesIcon, href: '/listings/gyms' },
  { label: 'Clubs', Icon: HeroClubsIcon, href: '/listings/clubs' },
  { label: 'Runs', Icon: HeroRunsIcon, href: '/events/races' },
]

const categories = [
  { label: 'Events', Icon: CalendarIcon, href: '/events' },
  { label: 'Runs', Icon: RunIcon, href: '/events/races' },
  { label: 'Clubs', Icon: GroupIcon, href: '/listings/clubs' },
  { label: 'Trainers', Icon: UserIcon, href: '/listings' },
  { label: 'Studios', Icon: StudioIcon, href: '/listings/wellness' },
  { label: 'Gyms', Icon: DumbbellIcon, href: '/listings/gyms' },
  { label: 'Wellness', Icon: LotusIcon, href: '/listings/wellness' },
  { label: 'Classes', Icon: ClassesIcon, href: '/listings/gyms' },
  { label: 'More', Icon: MoreIcon, href: '/listings' },
]

const tagTone: Record<EventTagTone, string> = {
  trending: 'bg-[#f7d656] text-[#3a2a00]',
  popular: 'bg-[#3170d6] text-white',
  new: 'bg-[#2ead6b] text-white',
}

function HeartBubble({ small }: { small?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-white shadow-sm shadow-black/15 ${
        small ? 'h-7 w-7' : 'h-8 w-8'
      }`}
    >
      <HeartIcon className={small ? 'h-3.5 w-3.5 text-black/40' : 'h-4 w-4 text-black/40'} />
    </span>
  )
}

function SectionHead({
  title,
  link,
  linkLabel,
}: {
  title: string
  link: string
  linkLabel: string
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between">
      <h2 className="text-2xl font-bold tracking-tight text-[#13191f] md:text-[26px]">{title}</h2>
      <Link
        href={link}
        className="text-sm font-semibold text-[#0dd5b5] transition-colors hover:text-[#0bc4a6]"
      >
        {linkLabel}
      </Link>
    </div>
  )
}

function EventCard({ event }: { event: SeedEvent }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300 hover:border-black/20 hover:shadow-lg hover:shadow-black/5">
      <Link href={event.href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0dd5b5]/10">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${tagTone[event.tagTone]}`}
          >
            {event.tag}
          </span>
          <span className="absolute right-3 top-3">
            <HeartBubble />
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={event.href}>
          <h3 className="text-[17px] font-bold text-[#13191f] transition-colors group-hover:text-[#0dd5b5]">
            {event.title}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-black/55">
          <PinIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{event.location}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[13px] text-black/55">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="mt-2 text-lg font-bold text-[#13191f]">{event.price}</div>
        <Link
          href={event.href}
          className="mt-3 rounded-lg bg-[#f7d656] px-4 py-2.5 text-center text-sm font-semibold text-[#3a2a00] transition-colors hover:bg-[#f7d656]/85"
        >
          Get Tickets
        </Link>
      </div>
    </div>
  )
}

function ListingCard({ listing }: { listing: SeedListing }) {
  return (
    <Link
      href={listing.href}
      className="group block h-full overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300 hover:border-black/20 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#0dd5b5]/10">
        <Image
          src={listing.image}
          alt={listing.name}
          fill
          sizes="(max-width: 768px) 78vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2">
          <HeartBubble small />
        </span>
        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-[#13191f]">
          {listing.distance}
        </span>
        {listing.verified && (
          <span className="absolute bottom-2 right-2 rounded-full bg-[#0dd5b5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            Verified
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="truncate text-sm font-bold text-[#13191f] transition-colors group-hover:text-[#0dd5b5]">
          {listing.name}
        </h4>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-black/55">
          <StarIcon className="h-3.5 w-3.5 text-[#f7d656]" />
          <span className="font-bold text-[#13191f]">{listing.rating.toFixed(1)}</span>
          <span>({listing.reviews})</span>
          <span className="text-black/15">|</span>
          <span className="font-bold text-[#13191f]">{listing.priceLevel}</span>
          <span className="text-black/15">·</span>
          <span className="truncate">{listing.category}</span>
        </div>
      </div>
    </Link>
  )
}

function SeeAllCard({
  label,
  sub,
  href,
}: {
  label: string
  sub: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-dashed border-[#0dd5b5] bg-gradient-to-br from-[#0dd5b5]/15 via-white to-[#f7d656]/20 transition-all hover:border-solid hover:shadow-lg hover:shadow-[#0dd5b5]/20"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#0dd5b5]/25 blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-[#f7d656]/40 blur-2xl"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#13191f] text-[#0dd5b5] shadow-lg shadow-black/20 ring-4 ring-white transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110">
          <ArrowRightIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-tight text-[#13191f]">{label}</h3>
        <p className="mt-1.5 max-w-[18ch] text-center text-sm text-black/55">{sub}</p>
      </div>
      <div className="relative border-t border-dashed border-[#0dd5b5]/40 bg-white/50 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a6e70] backdrop-blur-sm">
        Tap to explore →
      </div>
    </Link>
  )
}

export default async function Home() {
  const [featuredEvents, featuredListings] = await Promise.all([
    getHomepageEvents(),
    getHomepageListings(),
  ])

  const mobileEvents = featuredEvents.slice(0, 8)
  const mobileListings = featuredListings.slice(0, 8)
  const desktopEvents = featuredEvents.slice(0, 4)
  const desktopListings = featuredListings.slice(0, 4)

  return (
    <>
      <Header transparent />

      <main>
        {/* ─── Immersive hero (desktop ≥ md) — full-bleed photo ─── */}
        <section className="relative hidden h-screen min-h-[600px] w-full overflow-hidden bg-black md:block">
          <Image
            src={heroImage}
            alt="Fitness in the Bahamas"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          {/* Directional scrim — darkens the left for legibility */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(100deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.5) 38%, rgba(0,0,0,.12) 72%, rgba(0,0,0,.32) 100%)',
            }}
          />
          {/* Vertical vignette */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,.28) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, rgba(0,0,0,.4) 100%)',
            }}
          />

          {/* Hero content block */}
          <div className="absolute inset-x-[52px] bottom-[56px]">
            <h1 className="font-extrabold leading-[.98] tracking-[-.02em] text-white [text-shadow:0_4px_34px_rgba(0,0,0,.45)] text-[clamp(2.4rem,6vw,4.875rem)]">
              One Platform.
              <br />
              All Things <span className="text-[#F5BE2E]">Fitness.</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-[19px] leading-[1.5] text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,.5)]">
              Discover events, gyms, trainers &amp; classes across the islands — buy &amp; sell
              tickets and connect with the community, all in one place.
            </p>

            {/* Category chips */}
            <div className="mt-[30px] mb-[26px] flex gap-3">
              {heroCategories.map(({ label, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex w-32 flex-col items-center gap-[9px] rounded-[18px] border border-white/[.26] bg-white/[.13] px-1.5 py-4 backdrop-blur-md transition-[background,transform] duration-200 hover:-translate-y-[3px] hover:bg-white/[.26]"
                >
                  <Icon className="h-7 w-7 text-white" />
                  <span className="text-sm font-semibold text-white">{label}</span>
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3.5">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-[13px] bg-[#F5BE2E] px-[30px] py-4 text-base font-bold text-[#3a2a00] transition-transform duration-150 hover:-translate-y-[2px]"
              >
                Find Events
                <HeroArrowIcon className="h-[19px] w-[19px]" />
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center rounded-[13px] border border-white/50 bg-white/[.15] px-[30px] py-4 text-base font-semibold text-white backdrop-blur-[6px] transition-colors duration-200 hover:bg-white/[.26]"
              >
                Find Listings
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Immersive hero (mobile < md) — full-bleed photo, bottom-pinned ─── */}
        <section className="relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-black md:hidden">
          <Image
            src={heroImage}
            alt="Fitness in the Bahamas"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right-center"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.08) 24%, rgba(0,0,0,.12) 48%, rgba(0,0,0,.88) 100%)',
            }}
          />

          {/* Bottom-pinned content */}
          <div className="relative mt-auto px-6 pb-[30px]">
            <h1 className="text-[38px] font-extrabold leading-[1.03] tracking-[-.02em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,.5)]">
              One Platform.
              <br />
              All Things <span className="text-[#F5BE2E]">Fitness.</span>
            </h1>
            <p className="mt-[13px] max-w-[310px] text-[14.5px] leading-[1.5] text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,.5)]">
              Events, gyms, trainers &amp; classes across the islands — all in one place.
            </p>

            {/* Category chips — equal-width */}
            <div className="mt-[22px] mb-[18px] flex gap-[9px]">
              {heroCategories.map(({ label, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-1 flex-col items-center gap-2 rounded-[17px] border border-white/[.28] bg-white/[.14] px-[3px] py-[13px] backdrop-blur-md transition-colors duration-200 hover:bg-white/[.28]"
                >
                  <Icon className="h-6 w-6 text-white" />
                  <span className="text-[11.5px] font-semibold text-white">{label}</span>
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-[11px]">
              <Link
                href="/events"
                className="flex flex-1 items-center justify-center gap-2 rounded-[13px] bg-[#F5BE2E] px-4 py-[15px] text-[15px] font-bold text-[#3a2a00] active:scale-[0.98]"
              >
                Find Events
                <HeroArrowIcon className="h-[18px] w-[18px]" />
              </Link>
              <Link
                href="/listings"
                className="flex items-center justify-center rounded-[13px] border border-white/50 bg-white/[.15] px-5 py-[15px] text-[15px] font-semibold text-white backdrop-blur-[6px] active:scale-[0.98]"
              >
                Listings
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Explore Categories ─── */}
        <section className="bg-white pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead title="Explore Categories" link="/listings" linkLabel="See all" />
            <div className="grid grid-cols-5 gap-x-2 gap-y-5 md:gap-x-3">
              {categories.map(({ label, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.8px] border-[#0dd5b5] bg-white text-[#0dd5b5] transition-colors group-hover:bg-[#0dd5b5]/5 md:h-14 md:w-14">
                    <Icon className="h-4 w-4 md:h-6 md:w-6" />
                  </span>
                  <span className="text-[11px] font-semibold text-[#13191f] md:text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Featured Events ─── */}
        <section className="bg-white pb-10 md:pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              title="Featured Events"
              link="/events"
              linkLabel="See all events"
            />

            {/* Mobile carousel */}
            <div className="md:hidden">
              <div className="-mx-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-pl-4 sm:-mx-6 sm:scroll-pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-4 px-4 sm:px-6">
                  {mobileEvents.map((event) => (
                    <div
                      key={event.id}
                      className="snap-start shrink-0 w-[78vw] min-w-[260px] max-w-[300px]"
                    >
                      <EventCard event={event} />
                    </div>
                  ))}
                  <div className="snap-start shrink-0 w-[78vw] min-w-[260px] max-w-[300px]">
                    <SeeAllCard
                      label="See All Events"
                      sub="Browse the full Bahamas calendar"
                      href="/events"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/35">
                <span className="h-px w-6 bg-black/15" />
                Swipe to explore
                <span className="h-px w-6 bg-black/15" />
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {desktopEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Explore Listings ─── */}
        <section className="bg-white pb-10 md:pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              title="Explore Listings"
              link="/listings"
              linkLabel="See all listings"
            />

            {/* Mobile carousel */}
            <div className="md:hidden">
              <div className="-mx-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-pl-4 sm:-mx-6 sm:scroll-pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-4 px-4 sm:px-6">
                  {mobileListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="snap-start shrink-0 w-[68vw] min-w-[220px] max-w-[260px]"
                    >
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                  <div className="snap-start shrink-0 w-[68vw] min-w-[220px] max-w-[260px]">
                    <SeeAllCard
                      label="See All Listings"
                      sub="Gyms, coaches, studios & wellness"
                      href="/listings"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/35">
                <span className="h-px w-6 bg-black/15" />
                Swipe to explore
                <span className="h-px w-6 bg-black/15" />
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {desktopListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Community banner ─── */}
        <section className="bg-white pb-16 md:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-5 rounded-2xl bg-[#0dd5b5]/10 p-6 text-center sm:flex-row sm:text-left md:p-7">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0dd5b5]/20 text-[#0a6e70] md:h-16 md:w-16">
                <UsersIcon className="h-8 w-8" />
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#13191f] md:text-2xl">
                  Connect. Share. Grow Together.
                </h3>
                <p className="mt-1 text-sm text-black/55 md:text-base">
                  Join a community that inspires and supports your fitness journey.
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-[#0dd5b5] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#0bc4a6]"
                >
                  Join Community
                </Link>
                <span className="text-[11px] text-black/40">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
