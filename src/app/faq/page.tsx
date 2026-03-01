import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
// import Link from 'next/link'

export const metadata = {
  title: 'FAQ | Bahafit',
  description: 'Frequently asked questions about Bahafit - the Caribbean fitness directory.',
}

/*
const faqCategories = [
  {
    title: 'General Questions',
    faqs: [
      {
        question: 'What is Bahafit?',
        answer: 'Bahafit is the Caribbean\'s premier fitness directory, connecting health-conscious individuals with gyms, trainers, fitness classes, and wellness events across the islands.',
      },
      {
        question: 'Is Bahafit free to use?',
        answer: 'Yes! Browsing listings and events is completely free for users. Fitness businesses can create a basic listing for free, with premium features available through paid plans.',
      },
      {
        question: 'Which Caribbean islands does Bahafit cover?',
        answer: 'We currently cover all major Bahamian islands including Nassau, Grand Bahama, Exuma, Abaco, and more. We\'re expanding to other Caribbean islands soon!',
      },
    ],
  },
  {
    title: 'For Users',
    faqs: [
      {
        question: 'How do I find a gym or trainer near me?',
        answer: 'Use our search and filter features on the Listings page. You can filter by location, type of service, price range, and amenities to find the perfect match.',
      },
      {
        question: 'Can I leave reviews for businesses?',
        answer: 'Yes! After using a service, you can leave a review to help others in the community make informed decisions. Your honest feedback helps maintain quality.',
      },
      {
        question: 'How do I register for events?',
        answer: 'Find an event you\'re interested in on our Events page, click on it for details, and follow the registration instructions provided by the event organizer.',
      },
    ],
  },
  {
    title: 'For Businesses',
    faqs: [
      {
        question: 'How do I list my business on Bahafit?',
        answer: 'Create a free business account, then follow our step-by-step listing creation process. Add your business details, photos, services, and pricing to get started.',
      },
      {
        question: 'What does it cost to list my business?',
        answer: 'Basic listings are free forever. For enhanced visibility and features like analytics, event creation, and featured placement, check out our Professional and Premium plans.',
      },
      {
        question: 'How do I get verified?',
        answer: 'Apply for verification through your dashboard. Our team will review your business credentials, licenses, and customer feedback before granting verified status.',
      },
      {
        question: 'Can I create events for my business?',
        answer: 'Yes! Professional and Premium plan subscribers can create and promote fitness events, classes, workshops, and competitions through their dashboard.',
      },
    ],
  },
  {
    title: 'Account & Technical',
    faqs: [
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a link to reset your password within a few minutes.',
      },
      {
        question: 'Can I have multiple listings?',
        answer: 'Yes, if you operate multiple locations or businesses, you can create separate listings for each one under the same account.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact our support team through the Contact page. We\'ll verify your identity and process your account deletion request within 48 hours.',
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for full details.',
      },
    ],
  },
]
*/

export default function FAQPage() {
  return (
    <>
      <Header />

      {/* Coming Soon */}
      <main
        className="relative min-h-[calc(100vh-80px)] bg-black flex flex-col items-center justify-center overflow-hidden px-6"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#0dd5b5 1px, transparent 1px), linear-gradient(to right, #0dd5b5 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(13,213,181,0.07) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#0dd5b5]/30 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0dd5b5] animate-pulse" />
            <span className="text-[#0dd5b5] text-xs font-semibold tracking-widest uppercase">FAQ</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Coming <span style={{ color: '#f7d656' }}>Soon</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            We&apos;re compiling answers to the most frequently asked questions. Have a question in the meantime? Contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0dd5b5] text-black text-sm font-bold rounded-lg hover:bg-[#0dd5b5]/90 transition-all"
            >
              Ask a Question
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white text-sm font-semibold rounded-lg hover:border-[#0dd5b5]/50 hover:text-[#0dd5b5] transition-all"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </main>

      {/*
      <main className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => (
                  <details key={faqIndex} className="group bg-white rounded-xl shadow-sm overflow-hidden">
                    <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                      <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                      <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 border-t pt-4">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <section className="bg-gray-900 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Our support team is happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Visit Help Center
              </Link>
            </div>
          </section>
        </div>
      </main>
      */}

      <Footer />
    </>
  )
}
