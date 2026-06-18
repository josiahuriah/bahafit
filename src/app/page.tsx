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
import { grossPrice } from '@/lib/utils'
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

function HeroArrowIcon({ className }: HeroIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// Floating category shortcuts shared across both breakpoints
const heroCategories = [
  { label: 'Events', img: '/images/events.png', href: '/events' },
  { label: 'Classes', img: '/images/classes.png', href: '/listings/gyms' },
  { label: 'Clubs', img: '/images/clubs.png', href: '/listings/clubs' },
  { label: 'Runs', img: '/images/runs.png', href: '/events/races' },
]

// Each category renders its PNG icon from /public/images when `img` is set,
// falling back to the monoline SVG icon otherwise (e.g. the "More" tile).
const categories = [
  { label: 'Events', Icon: CalendarIcon, img: '/images/events.png', href: '/events' },
  { label: 'Runs', Icon: RunIcon, img: '/images/runs.png', href: '/events/races' },
  { label: 'Clubs', Icon: GroupIcon, img: '/images/clubs.png', href: '/listings/clubs' },
  { label: 'Trainers', Icon: UserIcon, img: '/images/trainers.png', href: '/listings' },
  { label: 'Studios', Icon: StudioIcon, img: '/images/studios.png', href: '/listings/wellness' },
  { label: 'Gyms', Icon: DumbbellIcon, img: '/images/gyms.png', href: '/listings/gyms' },
  { label: 'Wellness', Icon: LotusIcon, img: '/images/wellness.png', href: '/listings/wellness' },
  { label: 'Classes', Icon: ClassesIcon, img: '/images/classes.png', href: '/listings/gyms' },
  { label: 'More', Icon: MoreIcon, img: null, href: '/listings' },
]

// Buyers pay the listed price plus a 9% service charge and 1% facility fee.
// Display that final price wherever a ticket price is shown, while leaving
// "Free"/"TBA" and other non-numeric labels untouched.
function priceWithFees(price: string): string {
  const match = price.match(/^(.*?)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return price
  const [, prefix, num, suffix] = match
  const value = parseFloat(num.replace(/,/g, ''))
  if (isNaN(value)) return price
  return `${prefix}${grossPrice(value).toFixed(2)}${suffix}`
}

const tagTone: Record<EventTagTone, string> = {
  trending: 'bg-[#f7d656] text-[#3a2a00]',
  popular: 'bg-[#3170d6] text-white',
  new: 'bg-[#2ead6b] text-white',
}

function HeartBubble({ small }: { small?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-white dark:bg-[#1a1e26] shadow-sm shadow-black/15 ${
        small ? 'h-7 w-7' : 'h-8 w-8'
      }`}
    >
      <HeartIcon className={small ? 'h-3.5 w-3.5 text-black/40 dark:text-white/40' : 'h-4 w-4 text-black/40 dark:text-white/40'} />
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
      <h2 className="text-2xl font-bold tracking-tight text-[#13191f] dark:text-white md:text-[26px]">{title}</h2>
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
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-[#1a1e26] transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 hover:shadow-lg hover:shadow-black/5">
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
          <h3 className="text-[17px] font-bold text-[#13191f] dark:text-white transition-colors group-hover:text-[#0dd5b5]">
            {event.title}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-black/55 dark:text-white/50">
          <PinIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{event.location}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[13px] text-black/55 dark:text-white/50">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="mt-2 text-lg font-bold text-[#13191f] dark:text-white">{priceWithFees(event.price)}</div>
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
      className="group block h-full overflow-hidden rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-[#1a1e26] transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 hover:shadow-lg hover:shadow-black/5"
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
        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 dark:bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-[#13191f] dark:text-white">
          {listing.distance}
        </span>
        {listing.verified && (
          <span className="absolute bottom-2 right-2 rounded-full bg-[#0dd5b5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            Verified
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="truncate text-sm font-bold text-[#13191f] dark:text-white transition-colors group-hover:text-[#0dd5b5]">
          {listing.name}
        </h4>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-black/55 dark:text-white/50">
          <StarIcon className="h-3.5 w-3.5 text-[#f7d656]" />
          <span className="font-bold text-[#13191f] dark:text-white">{listing.rating.toFixed(1)}</span>
          <span>({listing.reviews})</span>
          <span className="text-black/15 dark:text-white/15">|</span>
          <span className="font-bold text-[#13191f] dark:text-white">{listing.priceLevel}</span>
          <span className="text-black/15 dark:text-white/15">·</span>
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-dashed border-[#0dd5b5] bg-gradient-to-br from-[#0dd5b5]/15 via-white dark:via-[#1a1e26] to-[#f7d656]/20 transition-all hover:border-solid hover:shadow-lg hover:shadow-[#0dd5b5]/20"
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
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#13191f] dark:bg-[#0dd5b5]/20 text-[#0dd5b5] shadow-lg shadow-black/20 ring-4 ring-white dark:ring-white/10 transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110">
          <ArrowRightIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-tight text-[#13191f] dark:text-white">{label}</h3>
        <p className="mt-1.5 max-w-[18ch] text-center text-sm text-black/55 dark:text-white/50">{sub}</p>
      </div>
      <div className="relative border-t border-dashed border-[#0dd5b5]/40 bg-white/50 dark:bg-black/30 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a6e70] dark:text-[#0dd5b5] backdrop-blur-sm">
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
          {/* Desktop */}
          <Image
            src={heroImage}
            alt="Fitness in the Bahamas"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover object-right"
          />

          {/* Mobile */}
          <Image
            src={heroImage}
            alt="Fitness in the Bahamas"
            fill
            priority
            sizes="100vw"
            className="md:hidden object-cover object-[65%_center]"
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
            <p className="mt-5 max-w-[520px] text-[19px] leading-[1.6] text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,.5)]">
              Discover fitness events, businesses
              <br />
              List your events and businesses
              <br />
              Buy or sell tickets here
              <br />
              Connect with others through community
            </p>

            {/* Category chips */}
            <div className="mt-[30px] mb-[26px] flex gap-3">
              {heroCategories.map(({ label, img, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex w-32 flex-col items-center gap-[9px] rounded-[18px] border border-white/[.26] bg-white/[.13] px-1.5 py-4 backdrop-blur-md transition-[background,transform] duration-200 hover:-translate-y-[3px] hover:bg-white/[.26]"
                >
                  <Image src={img} alt={label} width={36} height={36} className="h-9 w-9 object-contain" />
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
            className="object-cover object-[80%_top]"
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
            <p className="mt-[13px] text-[13px] leading-[1.6] text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,.5)]">
              Discover fitness events, businesses
              <br />
              List your events and businesses
              <br />
              Buy or sell tickets here
              <br />
              Connect with others through community
            </p>

            {/* Category chips — equal-width */}
            <div className="mt-[22px] mb-[18px] flex gap-[9px]">
              {heroCategories.map(({ label, img, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-1 flex-col items-center gap-2 rounded-[17px] border border-white/[.28] bg-white/[.14] px-[3px] py-[13px] backdrop-blur-md transition-colors duration-200 hover:bg-white/[.28]"
                >
                  <Image src={img} alt={label} width={32} height={32} className="h-8 w-8 object-contain" />
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
        <section className="bg-white dark:bg-[#0f1117] pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead title="Explore Categories" link="/listings" linkLabel="See all" />
            <div className="grid grid-cols-5 gap-x-2 gap-y-5 md:gap-x-3">
              {categories.map(({ label, Icon, img, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-2.5"
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={label}
                      width={56}
                      height={56}
                      className="h-11 w-11 object-contain md:h-14 md:w-14"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.8px] border-[#0dd5b5] bg-white dark:bg-transparent text-[#0dd5b5] transition-colors group-hover:bg-[#0dd5b5]/5 md:h-14 md:w-14">
                      <Icon className="h-4 w-4 md:h-6 md:w-6" />
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-[#13191f] dark:text-white/80 md:text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Featured Events ─── */}
        <section className="bg-white dark:bg-[#0f1117] pb-10 md:pb-14">
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
              <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/35 dark:text-white/25">
                <span className="h-px w-6 bg-black/15 dark:bg-white/15" />
                Swipe to explore
                <span className="h-px w-6 bg-black/15 dark:bg-white/15" />
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
        <section className="bg-white dark:bg-[#0f1117] pb-10 md:pb-14">
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
              <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/35 dark:text-white/25">
                <span className="h-px w-6 bg-black/15 dark:bg-white/15" />
                Swipe to explore
                <span className="h-px w-6 bg-black/15 dark:bg-white/15" />
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

        {/* ─── How It Works ─── */}
        <section className="bg-white dark:bg-[#0f1117] pb-14 md:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center md:mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0dd5b5]">
                How It Works
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#13191f] dark:text-white md:text-[32px]">
                Simple. Straightforward. Effective.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              {/* For You */}
              <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-[#1a1e26] p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0dd5b5]">For You</span>
                  <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>
                <ol className="space-y-6">
                  {[
                    { num: '01', title: 'Search & Discover', body: 'Browse fitness events, gyms, trainers, and wellness spots across the islands.' },
                    { num: '02', title: 'Compare & Choose', body: 'Review details, pricing, and amenities to find the perfect fit for your goals.' },
                    { num: '03', title: 'Connect & Train', body: 'Buy tickets, register for events, and start your fitness journey with confidence.' },
                  ].map((step) => (
                    <li key={step.num} className="flex gap-4">
                      <span className="text-2xl font-bold leading-none text-[#0dd5b5]/30 dark:text-[#0dd5b5]/40">{step.num}</span>
                      <div>
                        <h3 className="font-bold text-[#13191f] dark:text-white">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-black/55 dark:text-white/50">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/listings"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0dd5b5] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#0bc4a6]"
                >
                  Browse Listings
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* For Businesses */}
              <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-[#13191f] dark:bg-[#15191f] p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#f7d656]">For Businesses</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <ol className="space-y-6">
                  {[
                    { num: '01', title: 'Create Your Profile', body: 'Sign up and build a profile showcasing your services, pricing, and what makes you unique.' },
                    { num: '02', title: 'List Events & Sell Tickets', body: 'Create events, sell tickets, and promote workshops, classes, and competitions.' },
                    { num: '03', title: 'Grow Your Reach', body: 'Get discovered by fitness enthusiasts actively looking for exactly what you offer.' },
                  ].map((step) => (
                    <li key={step.num} className="flex gap-4">
                      <span className="text-2xl font-bold leading-none text-[#f7d656]/40">{step.num}</span>
                      <div>
                        <h3 className="font-bold text-white">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/50">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/list-your-business"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#f7d656] px-5 py-2.5 text-sm font-semibold text-[#3a2a00] transition-colors hover:bg-[#f7d656]/85"
                >
                  List Your Business
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Community banner ─── */}
        <section className="bg-white dark:bg-[#0f1117] pb-16 md:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-5 rounded-2xl bg-[#0dd5b5]/10 dark:bg-[#0dd5b5]/8 p-6 text-center sm:flex-row sm:text-left md:p-7">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0dd5b5]/20 text-[#0a6e70] dark:text-[#0dd5b5] md:h-16 md:w-16">
                <UsersIcon className="h-8 w-8" />
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#13191f] dark:text-white md:text-2xl">
                  Connect. Share. Grow Together.
                </h3>
                <p className="mt-1 text-sm text-black/55 dark:text-white/50 md:text-base">
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
                <span className="text-[11px] text-black/40 dark:text-white/30">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
