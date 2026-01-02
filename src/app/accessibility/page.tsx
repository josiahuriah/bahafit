import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Accessibility | Bahafit',
  description: 'Our commitment to making Bahafit accessible to everyone.',
}

export default function AccessibilityPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0dd5b5] to-[#0bc5a5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Accessibility Statement
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Our commitment to making fitness accessible to everyone.
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-600">
                Bahafit is committed to ensuring digital accessibility for people of all abilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Standards</h2>
              <p className="text-gray-600">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We're Doing</h2>
              <p className="text-gray-600">We have taken the following measures to ensure accessibility:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li>
                  <strong>Keyboard Navigation:</strong> All functionality is available using a keyboard alone.
                </li>
                <li>
                  <strong>Screen Reader Support:</strong> We use proper heading structures, alt text for images, and ARIA labels where needed.
                </li>
                <li>
                  <strong>Color Contrast:</strong> We maintain sufficient color contrast ratios for text and interactive elements.
                </li>
                <li>
                  <strong>Responsive Design:</strong> Our website works across different devices and screen sizes.
                </li>
                <li>
                  <strong>Clear Language:</strong> We use plain language and clear instructions throughout the site.
                </li>
                <li>
                  <strong>Form Accessibility:</strong> All forms have proper labels, error messages, and instructions.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Navigation</h3>
                  <p className="text-sm text-gray-600">
                    Skip to main content links, consistent navigation, and logical heading structure help users navigate efficiently.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Visual Design</h3>
                  <p className="text-sm text-gray-600">
                    High contrast colors, readable fonts, and clear visual hierarchy ensure content is easy to read.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Interactive Elements</h3>
                  <p className="text-sm text-gray-600">
                    All buttons, links, and form elements have visible focus indicators and are properly labeled.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Media</h3>
                  <p className="text-sm text-gray-600">
                    Images include descriptive alt text, and we're working to add captions to video content.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Physical Accessibility Information</h2>
              <p className="text-gray-600">
                We encourage fitness businesses listing on our platform to provide detailed accessibility information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>Wheelchair accessibility</li>
                <li>Accessible parking</li>
                <li>Accessible restrooms</li>
                <li>Adaptive equipment availability</li>
                <li>Staff training in accessibility accommodations</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Look for the wheelchair accessibility indicator on listings that provide these accommodations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Known Limitations</h2>
              <p className="text-gray-600">
                While we strive for comprehensive accessibility, some older content or third-party integrations may not fully meet all accessibility standards. We are actively working to address these issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback & Assistance</h2>
              <p className="text-gray-600">
                We welcome your feedback on the accessibility of Bahafit. If you encounter any barriers or have suggestions for improvement, please let us know:
              </p>
              <div className="bg-[#0dd5b5]/10 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> accessibility@bahafit.com<br />
                  <strong>Phone:</strong> Contact us through our main line<br />
                  <strong>Response Time:</strong> We aim to respond within 2 business days
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Continuous Improvement</h2>
              <p className="text-gray-600">
                We are committed to continuously improving accessibility. We regularly review our website, test with assistive technologies, and gather user feedback to enhance the experience for all users.
              </p>
              <p className="text-gray-600 mt-4">
                <em>This statement was last updated on December 1, 2024.</em>
              </p>
            </section>
          </div>

          {/* Quick Links */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Related Resources</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/help"
                className="text-[#0dd5b5] hover:underline"
              >
                Help Center →
              </Link>
              <Link
                href="/contact"
                className="text-[#0dd5b5] hover:underline"
              >
                Contact Us →
              </Link>
              <Link
                href="/faq"
                className="text-[#0dd5b5] hover:underline"
              >
                FAQ →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
