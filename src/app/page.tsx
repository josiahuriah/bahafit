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
} from '@/components/home/icons'

const heroBullets = [
  { Icon: CalendarIcon, text: 'Discover fitness events, businesses' },
  { Icon: StoreIcon, text: 'List your events and businesses' },
  { Icon: TicketIcon, text: 'Buy or sell tickets here' },
  { Icon: UsersIcon, text: 'Connect with others through community' },
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300 hover:border-black/20 hover:shadow-lg hover:shadow-black/5">
      <Link href={event.href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0dd5b5]/10">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
      className="group block overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300 hover:border-black/20 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#0dd5b5]/10">
        <Image
          src={listing.image}
          alt={listing.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
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

export default async function Home() {
  const [featuredEvents, featuredListings] = await Promise.all([
    getHomepageEvents(),
    getHomepageListings(),
  ])

  return (
    <>
      <Header />

      <main>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-[#eef9f6]">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Fitness in the Bahamas"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent md:from-white md:via-white/80 md:to-transparent" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-24 lg:px-8">
            <div className="max-w-lg md:max-w-xl">
              <h1 className="text-4xl leading-[1.05] tracking-tight md:text-6xl">
                <span className="font-bold text-[#13191f]">One Platform.</span>
                <br />
                <span className="font-bold text-[#0dd5b5]">All Things Fitness.</span>
              </h1>
              <ul className="mt-7 flex flex-col gap-3.5 md:mt-8">
                {heroBullets.map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0dd5b5] text-black">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-base text-[#13191f] md:text-[17px]">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/events"
                  className="rounded-lg bg-[#0dd5b5] px-6 py-3.5 text-center text-[15px] font-semibold text-black transition-colors hover:bg-[#0bc4a6]"
                >
                  Find Events
                </Link>
                <Link
                  href="/listings"
                  className="rounded-lg border-[1.5px] border-[#0dd5b5] bg-white px-6 py-3.5 text-center text-[15px] font-semibold text-[#0dd5b5] transition-colors hover:bg-[#0dd5b5]/5"
                >
                  Find Listings
                </Link>
              </div>
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredEvents.map((event) => (
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {featuredListings.map((listing) => (
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
