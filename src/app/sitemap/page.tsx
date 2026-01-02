import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Sitemap | Bahafit',
  description: 'Navigate all pages and sections of the Bahafit website.',
}

const sitemapSections = [
  {
    title: 'Main Pages',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Listings', href: '/listings' },
      { name: 'Events', href: '/events' },
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'For Businesses',
    links: [
      { name: 'List Your Business', href: '/list-your-business' },
      { name: 'Create an Event', href: '/create-event' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Resources', href: '/resources' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Sign In', href: '/auth/signin' },
      { name: 'Create Account', href: '/auth/signup' },
      { name: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    title: 'Listing Categories',
    links: [
      { name: 'Gyms & Fitness Centers', href: '/listings?listingType=gym' },
      { name: 'Personal Trainers', href: '/listings?listingType=trainer' },
      { name: 'Yoga Studios', href: '/listings?listingType=yoga_studio' },
      { name: 'CrossFit Boxes', href: '/listings?listingType=crossfit_box' },
      { name: 'Martial Arts', href: '/listings?listingType=martial_arts' },
      { name: 'Dance Studios', href: '/listings?listingType=dance_studio' },
      { name: 'Wellness Centers', href: '/listings?listingType=wellness_center' },
      { name: 'Swimming & Aquatics', href: '/listings?listingType=aquatics' },
    ],
  },
  {
    title: 'Event Categories',
    links: [
      { name: 'Fitness Classes', href: '/events?category=fitness_class' },
      { name: 'Competitions', href: '/events?category=competition' },
      { name: 'Workshops', href: '/events?category=workshop' },
      { name: 'Wellness Retreats', href: '/events?category=retreat' },
      { name: 'Community Events', href: '/events?category=community' },
    ],
  },
  {
    title: 'Locations',
    links: [
      { name: 'Nassau', href: '/listings?island=nassau' },
      { name: 'Grand Bahama', href: '/listings?island=grand_bahama' },
      { name: 'Exuma', href: '/listings?island=exuma' },
      { name: 'Abaco', href: '/listings?island=abaco' },
      { name: 'Eleuthera', href: '/listings?island=eleuthera' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Sitemap
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Find your way around Bahafit.
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sitemapSections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4 text-lg">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-[#0dd5b5] transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
