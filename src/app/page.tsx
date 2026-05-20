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
  StoreIcon,
  TicketIcon,
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
  SparkleIcon,
} from '@/components/home/icons'

const heroBullets = [
  { Icon: CalendarIcon, text: 'Discover fitness events, businesses' },
  { Icon: StoreIcon, text: 'List your events and businesses' },
  { Icon: TicketIcon, text: 'Buy or sell tickets here' },
  { Icon: UsersIcon, text: 'Connect with others through community' },
]

const heroBulletsCompact = [
  { Icon: CalendarIcon, text: 'Discover events' },
  { Icon: StoreIcon, text: 'List your business' },
  { Icon: TicketIcon, text: 'Buy & sell tickets' },
  { Icon: UsersIcon, text: 'Connect community' },
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
      <Header />

      <main>
        {/* ─── Hero (desktop) ─── */}
        <section className="relative hidden overflow-hidden bg-[#eef9f6] md:block">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Fitness in the Bahamas"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="max-w-xl">
              <h1 className="text-6xl leading-[1.05] tracking-tight">
                <span className="font-bold text-[#13191f]">One Platform.</span>
                <br />
                <span className="font-bold text-[#0dd5b5]">All Things Fitness.</span>
              </h1>
              <ul className="mt-8 flex flex-col gap-3.5">
                {heroBullets.map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0dd5b5] text-black">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[17px] text-[#13191f]">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-3">
                <Link
                  href="/events"
                  className="rounded-lg bg-[#0dd5b5] px-6 py-3.5 text-[15px] font-semibold text-black transition-colors hover:bg-[#0bc4a6]"
                >
                  Find Events
                </Link>
                <Link
                  href="/listings"
                  className="rounded-lg border-[1.5px] border-[#0dd5b5] bg-white px-6 py-3.5 text-[15px] font-semibold text-[#0dd5b5] transition-colors hover:bg-[#0dd5b5]/5"
                >
                  Find Listings
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Hero (mobile) — image-forward, editorial ─── */}
        <section className="relative overflow-hidden bg-[#eef9f6] md:hidden">
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-white via-[#eef9f6]/40 to-[#eef9f6]"
          />
          <span
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0dd5b5]/15 blur-3xl"
          />
          <span
            aria-hidden
            className="absolute -left-24 top-72 h-64 w-64 rounded-full bg-[#f7d656]/20 blur-3xl"
          />

          <div className="relative px-4 pt-6 pb-10 sm:px-6">
            <h1 className="mt-3 text-[2.6rem] leading-[0.95] tracking-tight">
              <span className="block font-bold text-[#13191f]">One Platform.</span>
              <span className="block font-bold text-[#0dd5b5]">All Things</span>
              <span className="block font-bold text-[#13191f]">
                Fitness<span className="text-[#f7d656]">.</span>
              </span>
            </h1>

            <div className="relative mt-7">
              <span
                aria-hidden
                className="absolute -left-1 -top-3 z-20 flex h-12 w-12 -rotate-12 items-center justify-center rounded-2xl bg-[#f7d656] text-[#3a2a00] shadow-lg shadow-black/15 ring-4 ring-white"
              >
                <SparkleIcon className="h-6 w-6" />
              </span>
              <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-[#0dd5b5]/15 shadow-xl shadow-[#0a6e70]/25 ring-1 ring-black/5">
                <Image
                  src={heroImage}
                  alt="Fitness in the Bahamas"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-right"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/92 p-3 backdrop-blur">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0dd5b5] text-black">
                    <UsersIcon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a6e70]">
                      A community built for you
                    </div>
                    <div className="text-sm font-bold text-[#13191f]">
                      Coaches, gyms, runs &amp; more
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-2.5">
              {heroBulletsCompact.map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-3 shadow-sm shadow-black/[0.03]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0dd5b5]/15 text-[#0a6e70]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-semibold leading-tight text-[#13191f]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/events"
                className="rounded-xl bg-[#0dd5b5] py-3.5 text-center text-sm font-bold text-black shadow-sm shadow-[#0dd5b5]/30 transition-all hover:bg-[#0bc4a6] active:scale-[0.98]"
              >
                Find Events
              </Link>
              <Link
                href="/listings"
                className="rounded-xl border-2 border-[#13191f] bg-white py-3.5 text-center text-sm font-bold text-[#13191f] transition-all hover:bg-[#13191f] hover:text-white active:scale-[0.98]"
              >
                Find Listings
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Explore Categories ─── */}
        <section className="bg-white pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead title="Explore Categories" link="/listings" linkLabel="See all" />
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 md:grid-cols-5 md:gap-x-3">
              {categories.map(({ label, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-[1.8px] border-[#0dd5b5] bg-white text-[#0dd5b5] transition-colors group-hover:bg-[#0dd5b5]/5 md:h-14 md:w-14">
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </span>
                  <span className="text-sm font-semibold text-[#13191f]">{label}</span>
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
