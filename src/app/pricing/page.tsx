import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Pricing | Bahafit',
  description: 'Simple, transparent pricing for fitness businesses on Bahafit.',
}

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Perfect for getting started',
    features: [
      'Basic business listing',
      'Contact information display',
      'Business hours',
      'Up to 3 photos',
      'Customer reviews',
      'Mobile-optimized listing',
    ],
    notIncluded: [
      'Featured placement',
      'Analytics dashboard',
      'Event creation',
      'Priority support',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Everything in Basic',
      'Up to 10 photos',
      'Services & pricing display',
      'Class schedule',
      'Analytics dashboard',
      'Create up to 5 events/month',
      'Email support',
      'Verified badge eligibility',
    ],
    notIncluded: [
      'Featured homepage placement',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Premium',
    price: '$79',
    period: '/month',
    description: 'Maximum visibility',
    features: [
      'Everything in Professional',
      'Unlimited photos',
      'Featured homepage placement',
      'Top of search results',
      'Unlimited events',
      'Priority support',
      'Custom branding options',
      'Promotional badge',
      'Social media promotion',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    href: '/contact?subject=premium',
    popular: false,
  },
]

const faqs = [
  {
    question: 'Can I try before I buy?',
    answer: 'Yes! Our Basic plan is completely free forever. For Professional and Premium plans, we offer a 14-day free trial so you can experience all the features before committing.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely. You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be prorated for the remainder of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely.',
  },
  {
    question: 'Is there a contract or commitment?',
    answer: 'No contracts or long-term commitments. All paid plans are billed monthly and you can cancel at any time.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Save 20% when you choose annual billing. Contact our sales team for more information.',
  },
]

export default function PricingPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Choose the plan that fits your business. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      <main className="bg-gray-50">
        {/* Pricing Cards */}
        <section className="py-16 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden relative ${
                    plan.popular ? 'ring-2 ring-[#0dd5b5]' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-[#0dd5b5] text-white text-sm font-medium py-2 text-center">
                      Most Popular
                    </div>
                  )}
                  <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>

                    <Link
                      href={plan.href}
                      className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                        plan.popular
                          ? 'bg-[#0dd5b5] text-white hover:bg-[#0bc5a5]'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </Link>

                    <div className="mt-8">
                      <p className="text-sm font-medium text-gray-900 mb-4">What's included:</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-[#0dd5b5] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-gray-50 rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Still Have Questions?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our team is here to help you choose the right plan for your business.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0dd5b5] text-white font-semibold rounded-lg hover:bg-[#0bc5a5] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
