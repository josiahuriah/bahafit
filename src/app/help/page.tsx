import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Help Center | Bahafit',
  description: 'Get help with your Bahafit account, listings, events, and more.',
}

const helpCategories = [
  {
    title: 'Account & Profile',
    icon: '👤',
    articles: [
      'How to create an account',
      'Resetting your password',
      'Updating your profile',
      'Account security tips',
      'Deleting your account',
    ],
  },
  {
    title: 'Listings',
    icon: '📍',
    articles: [
      'Creating a business listing',
      'Editing your listing',
      'Adding photos and media',
      'Managing operating hours',
      'Responding to reviews',
    ],
  },
  {
    title: 'Events',
    icon: '📅',
    articles: [
      'Creating a new event',
      'Managing registrations',
      'Editing event details',
      'Cancelling an event',
      'Event promotion tips',
    ],
  },
  {
    title: 'Billing & Payments',
    icon: '💳',
    articles: [
      'Understanding pricing plans',
      'Updating payment method',
      'Viewing invoices',
      'Cancelling subscription',
      'Refund policy',
    ],
  },
  {
    title: 'Reviews & Ratings',
    icon: '⭐',
    articles: [
      'How reviews work',
      'Responding to reviews',
      'Reporting fake reviews',
      'Improving your rating',
      'Review guidelines',
    ],
  },
  {
    title: 'Technical Issues',
    icon: '🔧',
    articles: [
      'Troubleshooting login issues',
      'Page not loading',
      'Image upload problems',
      'Browser compatibility',
      'Mobile app issues',
    ],
  },
]

const popularArticles = [
  { title: 'How to get verified', views: '2.4K views' },
  { title: 'Creating your first listing', views: '1.8K views' },
  { title: 'Managing event registrations', views: '1.5K views' },
  { title: 'Responding to customer reviews', views: '1.2K views' },
  { title: 'Upgrading your subscription', views: '980 views' },
]

export default function HelpPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Help Center
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Find answers to your questions and get the support you need.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#0dd5b5] text-white p-2 rounded-full hover:bg-[#0bc5a5] transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Popular Articles */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
            <div className="bg-white rounded-xl shadow-sm divide-y">
              {popularArticles.map((article, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                  <span className="font-medium text-gray-900">{article.title}</span>
                  <span className="text-sm text-gray-500">{article.views}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Help Categories */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    </div>
                  </div>
                  <ul className="p-4">
                    {category.articles.map((article, i) => (
                      <li key={i}>
                        <a href="#" className="block py-2 text-sm text-gray-600 hover:text-[#0dd5b5] transition-colors">
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Still Need Help */}
          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 border rounded-xl">
                <div className="w-16 h-16 bg-[#0dd5b5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">Get help from our support team via email.</p>
                <Link href="/contact" className="text-[#0dd5b5] font-medium hover:underline">
                  Contact Us →
                </Link>
              </div>

              <div className="text-center p-6 border rounded-xl">
                <div className="w-16 h-16 bg-[#0dd5b5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                <p className="text-sm text-gray-600 mb-4">Find quick answers to common questions.</p>
                <Link href="/faq" className="text-[#0dd5b5] font-medium hover:underline">
                  View FAQ →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
