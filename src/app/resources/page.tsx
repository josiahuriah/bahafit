import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Resources | Bahafit',
  description: 'Guides, tips, and resources to help fitness businesses succeed on Bahafit.',
}

const resources = [
  {
    category: 'Getting Started',
    items: [
      { title: 'How to Create Your First Listing', icon: '📝', description: 'Step-by-step guide to setting up your business profile.' },
      { title: 'Optimizing Your Business Profile', icon: '⚡', description: 'Tips to make your listing stand out from the competition.' },
      { title: 'Understanding the Verification Process', icon: '✅', description: 'Learn how to get verified and build trust with customers.' },
    ],
  },
  {
    category: 'Events',
    items: [
      { title: 'Creating Successful Events', icon: '🎯', description: 'Best practices for event creation and promotion.' },
      { title: 'Managing Event Registrations', icon: '📋', description: 'Tools and tips for handling attendee management.' },
      { title: 'Promoting Your Events', icon: '📢', description: 'Marketing strategies to fill your events.' },
    ],
  },
  {
    category: 'Growth & Marketing',
    items: [
      { title: 'Getting More Reviews', icon: '⭐', description: 'How to encourage customers to leave positive reviews.' },
      { title: 'Using Analytics', icon: '📊', description: 'Understanding your dashboard and tracking performance.' },
      { title: 'Social Media Integration', icon: '📱', description: 'Connecting your social media for maximum reach.' },
    ],
  },
]

const guides = [
  { title: 'Business Owner Handbook', description: 'Complete guide to managing your Bahafit listing', icon: '📖' },
  { title: 'Event Organizer Guide', description: 'Everything you need to know about hosting events', icon: '🎪' },
  { title: 'Marketing Best Practices', description: 'Tips for promoting your fitness business', icon: '🚀' },
  { title: 'Customer Service Tips', description: 'How to respond to reviews and inquiries', icon: '💬' },
]

export default function ResourcesPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Business Resources
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Guides, tips, and tools to help your fitness business succeed on Bahafit.
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Guides */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guides.map((guide, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-4xl mb-4">{guide.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-600">{guide.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Resource Categories */}
          {resources.map((category, index) => (
            <section key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.items.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Video Tutorials */}
          <section className="bg-white rounded-xl shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                'Getting Started with Bahafit',
                'Creating Your First Event',
                'Optimizing Your Profile',
              ].map((video, index) => (
                <div key={index} className="relative bg-gray-100 rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <svg className="w-8 h-8 text-[#0dd5b5] ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{video}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 mt-6">Coming Soon!</p>
          </section>

          {/* Need Help */}
          <section className="bg-gray-900 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
              >
                Visit Help Center
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
