import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Blog | Bahafit',
  description: 'Fitness tips, wellness advice, and Caribbean health news from the Bahafit team.',
}

const blogPosts = [
  {
    id: 1,
    title: '10 Best Outdoor Workout Spots in Nassau',
    excerpt: 'Discover the most scenic and effective places to exercise outdoors in Nassau, from beach runs to park workouts.',
    category: 'Fitness Tips',
    date: 'Dec 5, 2024',
    readTime: '5 min read',
    image: null,
  },
  {
    id: 2,
    title: 'How to Stay Fit During Hurricane Season',
    excerpt: 'Practical tips for maintaining your fitness routine when outdoor activities are limited by weather.',
    category: 'Wellness',
    date: 'Dec 1, 2024',
    readTime: '4 min read',
    image: null,
  },
  {
    id: 3,
    title: 'Caribbean Superfoods for Athletes',
    excerpt: 'Local foods that can boost your performance and recovery, from coconut water to cassava.',
    category: 'Nutrition',
    date: 'Nov 28, 2024',
    readTime: '6 min read',
    image: null,
  },
  {
    id: 4,
    title: 'Building a Home Gym on a Budget',
    excerpt: 'Everything you need to create an effective workout space at home without breaking the bank.',
    category: 'Equipment',
    date: 'Nov 20, 2024',
    readTime: '7 min read',
    image: null,
  },
  {
    id: 5,
    title: 'The Rise of Fitness Culture in the Bahamas',
    excerpt: 'How the Caribbean fitness scene has evolved and what it means for health-conscious islanders.',
    category: 'Community',
    date: 'Nov 15, 2024',
    readTime: '5 min read',
    image: null,
  },
  {
    id: 6,
    title: 'Yoga on the Beach: A Complete Guide',
    excerpt: 'Everything you need to know about practicing yoga on Caribbean beaches, from poses to precautions.',
    category: 'Yoga',
    date: 'Nov 10, 2024',
    readTime: '6 min read',
    image: null,
  },
]

const categories = ['All', 'Fitness Tips', 'Wellness', 'Nutrition', 'Equipment', 'Community', 'Yoga']

export default function BlogPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Bahafit Blog
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Fitness tips, wellness advice, and Caribbean health news.
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-[#0dd5b5] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-[#0dd5b5]/20 to-[#f7d656]/20 flex items-center justify-center">
                  <div className="text-4xl">📝</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-[#0dd5b5] bg-[#0dd5b5]/10 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <span className="text-[#0dd5b5] text-sm font-medium hover:underline cursor-pointer">
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">More Content Coming Soon!</h3>
            <p className="text-gray-600 mb-6">
              We're working on bringing you more fitness tips, wellness guides, and community stories.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
            >
              Suggest a Topic
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
