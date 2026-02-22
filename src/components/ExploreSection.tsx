import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { name: 'Race', image: '/images/race.jpg', href: '/events/races' },
  { name: 'Clubs', image: '/images/clubs.jpg', href: '/listings/clubs' },
  { name: 'Studios', image: '/images/studios.jpg', href: '/listings/studios' },
  { name: 'Gyms', image: '/images/gyms.jpg', href: '/listings/gyms' },
  { name: 'Classes', image: '/images/classes.jpg', href: '/listings/classes' },
  { name: 'Activities', image: '/images/activities.jpg', href: '/listings/activities' },
  { name: 'Health Fairs', image: '/images/health-fairs.jpg', href: '/events/expos' },
  { name: 'Fitness Guide', image: '/images/fitness-guide.jpg', href: '/blog' },
  { name: 'Sports', image: '/images/sports.jpg', href: '/listings/sports' },
  { name: 'Kids', image: '/images/kids.jpg', href: '/listings/kids' },
]

export default function ExploreSection() {
  return (
    <section className="py-14 bg-white border-t border-black/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Explore
          </h2>
          <p className="text-sm text-black/50 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Select a category to discover everything available
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 text-black hover:bg-black/5 group"
            >
              {/* Image circle */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-black/10 group-hover:border-black/25 transition-all duration-200">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Label */}
              <span
                className="text-[10px] md:text-xs font-medium text-center leading-tight"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
