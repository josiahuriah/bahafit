import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Journal | Bahafit',
  description: 'Fitness tips, wellness advice, and Caribbean health stories from the Bahafit community.',
}

const featured = {
  title: 'Getting Started in Fitness, the Bahafit Way',
  excerpt: "Starting your fitness journey can feel overwhelming, but it doesn't have to be. Discover how Bahafit makes it easy to find the right gym, trainer, and community to support your goals.",
  category: 'Featured',
  date: 'Nov 15, 2025',
  readTime: '8 min read',
  slug: 'getting-started-fitness-bahafit-way',
}

const posts = [
  { id: 1, title: '10 Best Outdoor Workout Spots in Nassau', excerpt: 'Discover the most scenic and effective places to exercise outdoors in Nassau.', category: 'Fitness Tips', date: 'Dec 5, 2025', readTime: '5 min', slug: '10-best-outdoor-workout-spots-nassau' },
  { id: 2, title: 'How to Stay Fit During Hurricane Season', excerpt: 'Practical tips for maintaining your fitness routine when weather limits outdoor activities.', category: 'Wellness', date: 'Dec 1, 2025', readTime: '4 min', slug: 'stay-fit-hurricane-season' },
  { id: 3, title: 'Caribbean Superfoods for Athletes', excerpt: 'Local foods that can boost your performance and recovery, from coconut water to cassava.', category: 'Nutrition', date: 'Nov 28, 2025', readTime: '6 min', slug: 'caribbean-superfoods-athletes' },
  { id: 4, title: 'Building a Home Gym on a Budget', excerpt: 'Everything you need to create an effective workout space at home without breaking the bank.', category: 'Equipment', date: 'Nov 20, 2025', readTime: '7 min', slug: 'home-gym-budget' },
  { id: 5, title: 'The Rise of Fitness Culture in the Bahamas', excerpt: 'How the Caribbean fitness scene has evolved and what it means for health-conscious islanders.', category: 'Community', date: 'Nov 15, 2025', readTime: '5 min', slug: 'fitness-culture-bahamas' },
  { id: 6, title: 'Yoga on the Beach: A Complete Guide', excerpt: 'Everything you need to know about practicing yoga on Caribbean beaches.', category: 'Yoga', date: 'Nov 10, 2025', readTime: '6 min', slug: 'yoga-beach-guide' },
]

const categories = ['All', 'Fitness Tips', 'Wellness', 'Nutrition', 'Equipment', 'Community', 'Yoga']

const categoryAccent: Record<string, string> = {
  Featured: '#f7d656',
  'Fitness Tips': '#0dd5b5',
  Wellness: '#0dd5b5',
  Nutrition: '#f7d656',
  Equipment: '#0dd5b5',
  Community: '#f7d656',
  Yoga: '#0dd5b5',
}
export default function BlogPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-black min-h-[45vh] flex items-end pb-16 pt-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl">
          <p className="text-[#0dd5b5] text-xs tracking-[0.4em] uppercase mb-8 font-medium">The Bahafit Journal</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight">
            Stories, tips &<br />
            <span className="text-[#f7d656]">real talk.</span>
          </h1>
        </div>
      </section>

      <main className="bg-white">
        {/* Featured Post */}
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0dd5b5]/20 to-black/5" />
                  <div className="absolute top-6 left-6">
                    <span className="text-xs font-bold tracking-widest uppercase px-3 py-1.5" style={{ background: categoryAccent[featured.category], color: '#000' }}>
                      {featured.category}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 tracking-widest uppercase mb-6">
                    <span>{featured.date}</span>
                    <span>&middot;</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6 group-hover:text-[#0dd5b5] transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed mb-8">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-3 text-sm font-semibold text-black group-hover:text-[#0dd5b5] transition-colors duration-300">
                    Read Article
                    <span className="group-hover:translate-x-1 transition-transform inline-block">&#8594;</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="flex gap-0 mb-16 border-b border-gray-100 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-5 py-3 text-xs font-semibold whitespace-nowrap tracking-widest uppercase transition-colors border-b-2 -mb-px ${
                  i === 0 ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post) => (
              <article key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-gray-100 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0dd5b5]/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-1" style={{ background: categoryAccent[post.category] || '#0dd5b5', color: '#000' }}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 tracking-widest uppercase mb-3">
                    <span>{post.date}</span>
                    <span>&middot;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#0dd5b5] transition-colors duration-300 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">More Coming Soon</p>
              <p className="text-gray-600 text-sm">We are working on more fitness tips, wellness guides, and community stories.</p>
            </div>
            <Link href="/contact" className="flex-shrink-0 px-8 py-4 border border-black text-black text-sm font-semibold tracking-wide hover:bg-black hover:text-white transition-colors">
              Suggest a Topic
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
