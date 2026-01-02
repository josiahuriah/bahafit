import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Cookie Policy | Bahafit',
  description: 'Learn how Bahafit uses cookies and similar technologies.',
}

export default function CookiePolicyPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Last updated: December 1, 2024
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600">
                Bahafit uses cookies and similar technologies for several purposes:
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Essential Cookies</h3>
              <p className="text-gray-600">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account authentication. You cannot opt out of these cookies.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-2">session_id</td>
                      <td className="py-2">Maintains your login session</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">csrf_token</td>
                      <td className="py-2">Security protection</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2">cookie_consent</td>
                      <td className="py-2">Stores your cookie preferences</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Functional Cookies</h3>
              <p className="text-gray-600">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-2">user_preferences</td>
                      <td className="py-2">Remembers your display preferences</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-2">recent_searches</td>
                      <td className="py-2">Stores recent search queries</td>
                      <td className="py-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Analytics Cookies</h3>
              <p className="text-gray-600">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-2">_ga</td>
                      <td className="py-2">Google Analytics - user distinction</td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-2">_gid</td>
                      <td className="py-2">Google Analytics - session tracking</td>
                      <td className="py-2">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Marketing Cookies</h3>
              <p className="text-gray-600">
                These cookies may be set by our advertising partners to build a profile of your interests and show you relevant advertisements on other sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-600">
                You can control and manage cookies in several ways:
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Browser Settings</h3>
              <p className="text-gray-600">
                Most browsers allow you to refuse or accept cookies. The following links provide instructions for common browsers:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#0dd5b5] hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#0dd5b5] hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#0dd5b5] hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#0dd5b5] hover:underline">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Opt-Out Tools</h3>
              <p className="text-gray-600">
                You can opt out of interest-based advertising through:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-[#0dd5b5] hover:underline">Network Advertising Initiative</a></li>
                <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-[#0dd5b5] hover:underline">Digital Advertising Alliance</a></li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Disabling cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600">
                Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and they are subject to the third party's own privacy policies. Third parties we work with include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>Google Analytics (analytics)</li>
                <li>Sanity.io (content management)</li>
                <li>Payment processors (for secure transactions)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about our use of cookies, please contact us:
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Email:</strong> privacy@bahafit.com<br />
                <strong>Address:</strong> Nassau, Bahamas
              </p>
            </section>
          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/privacy"
              className="text-[#0dd5b5] hover:underline"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/terms"
              className="text-[#0dd5b5] hover:underline"
            >
              Terms of Service →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
