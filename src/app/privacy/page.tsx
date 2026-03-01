import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Privacy Policy | Bahafit',
  description: 'Learn how Bahafit collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            <strong className="text-gray-300">Effective Date:</strong> [INSERT DATE] &nbsp;·&nbsp; <strong className="text-gray-300">Last Updated:</strong> [INSERT DATE]
          </p>
        </div>
      </section>

      <main className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 prose prose-gray max-w-none">

            {/* Who We Are */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed">
                Bahafit (<strong>&ldquo;Bahafit,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo;</strong> or <strong>&ldquo;us&rdquo;</strong>) is a Caribbean fitness community platform operated by{' '}
                <strong>[LEGAL BUSINESS ENTITY NAME]</strong>, a company registered in the Commonwealth of the Bahamas, with its principal place of business at{' '}
                <strong>[REGISTERED BUSINESS ADDRESS], The Bahamas</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                Bahafit connects fitness enthusiasts, event organizers, gym owners, coaches, and wellness businesses across the Caribbean. Our platform allows users to discover fitness events and services, register for events, and connect with the regional fitness community.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                For questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none pl-0 mt-2 space-y-1 text-gray-600">
                <li><strong>Email:</strong> <a href="mailto:support@bahafit.com" className="text-[#0dd5b5] hover:underline">support@bahafit.com</a></li>
                <li><strong>Phone:</strong> [CUSTOMER SERVICE PHONE NUMBER]</li>
                <li><strong>Hours:</strong> [CUSTOMER SERVICE HOURS, e.g., Monday–Friday, 9:00 AM – 5:00 PM AST]</li>
                <li><strong>Mailing Address:</strong> [REGISTERED BUSINESS ADDRESS], The Bahamas</li>
              </ul>
              <div className="mt-5 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg text-sm text-blue-800">
                <strong>RBC Compliance Note (Item 7, 11, 12):</strong> This policy fulfills the RBC e-commerce requirement for a clear privacy statement disclosing what information is collected, tracked, and with whom it is shared. Merchant name, address, and customer service contact are disclosed above and at checkout.
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">
                We collect the following categories of personal information when you use Bahafit:
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Account Registration:</strong> When you create an account, we collect your full name and email address. If you register with a password, that password is stored in a securely hashed format (we never store plaintext passwords).</li>
                <li><strong>User Profile:</strong> Your account role (e.g., regular user, event organizer, business owner) and any profile details you choose to add.</li>
                <li><strong>Event Registrations:</strong> When you register for a fitness event through Bahafit, we collect your name, email address, and event selection. This information is stored as part of your registration record.</li>
                <li><strong>Business &amp; Event Listings:</strong> If you are a business owner or event organizer, we collect information you submit about your business, events, or services (including descriptions, locations, schedules, and contact details).</li>
                <li><strong>Communications:</strong> If you contact us for support or inquiries, we retain records of your communications.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Log Data:</strong> When you visit our website, our servers automatically record information including your IP address, browser type, operating system, referring URLs, pages visited, and time of visit.</li>
                <li><strong>Session Data:</strong> We use session tokens (JWTs) to keep you logged in. These are stored in your browser and expire at the end of your session or after a defined period of inactivity.</li>
                <li><strong>Cookies:</strong> We use essential cookies necessary for the platform to function (e.g., session cookies for authentication). See Section 5 for details.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1.3 Information Received from Third Parties</h3>
              <p className="text-gray-600 leading-relaxed">
                If you choose to sign in using a third-party OAuth provider, we receive certain profile information from that provider:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li><strong>Google Sign-In:</strong> We receive your name, email address, and Google profile photo (if provided).</li>
                <li><strong>Facebook Login:</strong> We receive your name and email address as authorized by your Facebook privacy settings.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                We do not receive or store your social media passwords. The scope of data received is limited to what you authorize during the OAuth consent flow.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use the personal information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li><strong>Account Management:</strong> To create and manage your account, authenticate your identity, and maintain your session.</li>
                <li><strong>Event Registrations:</strong> To process your event registration, associate it with your account, and provide confirmation of your registration.</li>
                <li><strong>Platform Operations:</strong> To display listings, events, and community content relevant to you.</li>
                <li><strong>Customer Support:</strong> To respond to your questions, resolve disputes, and provide assistance.</li>
                <li><strong>Communications:</strong> To send you transactional emails related to your account (e.g., registration confirmations, password resets). We will only send marketing communications if you have opted in.</li>
                <li><strong>Administration:</strong> To manage platform content, approve or reject submitted events and listings, and maintain platform integrity.</li>
                <li><strong>Compliance and Legal Obligations:</strong> To comply with applicable laws, regulations, and lawful requests from authorities.</li>
                <li><strong>Security:</strong> To detect, investigate, and prevent fraudulent or unauthorized activity on the platform.</li>
              </ul>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Payment Processing</h2>
              <p className="text-gray-600 leading-relaxed">
                Bahafit does <strong>not</strong> collect, process, or store payment card information directly.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                When you register for a paid event, you will be redirected to a secure, hosted payment page operated by <strong>Fygaro</strong>, our payment processing partner. All payment card data is collected, transmitted, and processed exclusively by Fygaro in accordance with their own privacy policy and PCI DSS compliance standards. Bahafit receives only a confirmation of your payment status — we do not receive or store your card number, CVV, or banking details.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                You are encouraged to review Fygaro&apos;s privacy policy before completing your payment. A link to Fygaro&apos;s privacy policy is available at their website.
              </p>
              <div className="mt-5 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg text-sm text-blue-800">
                <strong>RBC Compliance Note (Items 13, 14, 16):</strong> Payments are processed through a PCI DSS-compliant hosted payment provider. Payment data transmission uses SSL/TLS encryption (HTTPS). Bahafit does not store cardholder data.
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. We may share your information with the following categories of third parties, only as necessary to operate the platform:
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">4.1 Service Providers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 font-semibold text-gray-900 w-1/4">Third Party</th>
                      <th className="border border-gray-200 px-4 py-3 font-semibold text-gray-900 w-2/5">Purpose</th>
                      <th className="border border-gray-200 px-4 py-3 font-semibold text-gray-900">Data Shared</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">Fygaro</td>
                      <td className="border border-gray-200 px-4 py-3">Payment processing for event registrations</td>
                      <td className="border border-gray-200 px-4 py-3">Name, email, event details (payment page redirect)</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">MongoDB Atlas</td>
                      <td className="border border-gray-200 px-4 py-3">Cloud database hosting — stores user accounts and registration records</td>
                      <td className="border border-gray-200 px-4 py-3">User account data, registration records</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">Sanity.io</td>
                      <td className="border border-gray-200 px-4 py-3">Headless content management system — stores event and listing content</td>
                      <td className="border border-gray-200 px-4 py-3">Event and listing content submitted by organizers</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">Vercel</td>
                      <td className="border border-gray-200 px-4 py-3">Website hosting and deployment infrastructure</td>
                      <td className="border border-gray-200 px-4 py-3">Log data, IP addresses (standard server infrastructure)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">Google</td>
                      <td className="border border-gray-200 px-4 py-3">OAuth sign-in provider; Google Fonts (typography)</td>
                      <td className="border border-gray-200 px-4 py-3">Name and email (if Google sign-in used); font file requests (no PII transmitted for fonts)</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">Meta (Facebook)</td>
                      <td className="border border-gray-200 px-4 py-3">OAuth sign-in provider</td>
                      <td className="border border-gray-200 px-4 py-3">Name and email (if Facebook login used)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">NextAuth.js</td>
                      <td className="border border-gray-200 px-4 py-3">Open-source authentication framework (self-hosted)</td>
                      <td className="border border-gray-200 px-4 py-3">Session tokens (processed locally; no external data sharing)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 leading-relaxed mt-4">
                We require all third-party service providers to maintain appropriate security standards and to use your data only for the purposes we specify.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4.2 Legal Requirements</h3>
              <p className="text-gray-600 leading-relaxed">
                We may disclose your information if required to do so by law, regulation, court order, or governmental authority, or if we believe in good faith that such disclosure is necessary to protect the rights, property, or safety of Bahafit, our users, or the public.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4.3 Business Transfers</h3>
              <p className="text-gray-600 leading-relaxed">
                In the event of a merger, acquisition, or sale of all or a portion of our assets, your personal information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on the platform in advance of any such transfer.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4.4 With Your Consent</h3>
              <p className="text-gray-600 leading-relaxed">
                We may share your information with other parties where you have given us your explicit consent to do so.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bahafit uses the following types of cookies and similar technologies:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 font-semibold text-gray-900 w-1/3">Cookie Type</th>
                      <th className="border border-gray-200 px-4 py-3 font-semibold text-gray-900">Purpose</th>
                      <th className="border border-gray-200 px-4 py-3 font-semibold text-gray-900 w-1/4">Can You Opt Out?</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">Essential / Session Cookies</td>
                      <td className="border border-gray-200 px-4 py-3">Required for authentication and platform functionality (e.g., keeping you logged in, securing your session via JWT)</td>
                      <td className="border border-gray-200 px-4 py-3">No — required for platform use</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">Preference Cookies</td>
                      <td className="border border-gray-200 px-4 py-3">Remember your settings and preferences on the platform</td>
                      <td className="border border-gray-200 px-4 py-3">Yes — via browser settings</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 leading-relaxed mt-4">
                We do not currently use third-party advertising cookies or behavioral tracking cookies.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                <strong>Google Fonts:</strong> Our platform uses Google Fonts for typography. When you visit the platform, your browser may make requests to Google&apos;s servers to download font files. This is a standard web practice; Google may log these requests in accordance with its own privacy policy. No personally identifiable information from Bahafit is transmitted in these font requests.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                You may control cookie preferences through your browser settings. Disabling essential cookies will impair your ability to log in and use the platform.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide services to you. Specifically:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li><strong>Account Data:</strong> Retained for the duration of your account and for up to <strong>[X years]</strong> after account closure, unless a longer retention period is required by law.</li>
                <li><strong>Event Registration Records:</strong> Retained for a minimum of <strong>120 days</strong> following the event date, and available to you on request during that period in accordance with RBC e-commerce requirements.</li>
                <li><strong>Transaction Records:</strong> Retained for a minimum of <strong>5 years</strong> for financial record-keeping and compliance purposes.</li>
                <li><strong>Log Data:</strong> Retained for up to <strong>90 days</strong> unless required for security investigations.</li>
              </ul>
              <div className="mt-5 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg text-sm text-blue-800">
                <strong>RBC Compliance Note (Best Practices):</strong> Transaction date and transaction amount are available to registered users for a minimum of 120 days from the date of the transaction.
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We take the security of your personal information seriously and implement the following measures:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li><strong>HTTPS Encryption:</strong> All data transmitted between your browser and our platform is encrypted using TLS (HTTPS). Our secure site certificate is visible in your browser&apos;s address bar.</li>
                <li><strong>Password Hashing:</strong> Passwords are hashed using bcrypt and are never stored in plaintext.</li>
                <li><strong>Access Controls:</strong> Access to administrative portals and user data is restricted to authorized personnel only, with role-based access controls enforced across the platform.</li>
                <li><strong>Hosting Security:</strong> Our platform is hosted on Vercel, which provides enterprise-grade infrastructure security. Data is stored in MongoDB Atlas with encryption at rest.</li>
                <li><strong>Session Security:</strong> User sessions are managed via secure JWT tokens that expire after a defined period.</li>
                <li><strong>Two-Factor Authentication:</strong> Administrators are encouraged to enable two-factor authentication on all administrative accounts.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                While we implement industry-standard security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data, but we are committed to protecting it using reasonable measures.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights and Choices</h2>
              <p className="text-gray-600 leading-relaxed">
                Depending on your jurisdiction, you may have the following rights with respect to your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete personal data.</li>
                <li><strong>Deletion:</strong> Request that we delete your personal data, subject to our legal retention obligations.</li>
                <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
                <li><strong>Opt-Out of Marketing:</strong> Unsubscribe from marketing emails at any time using the unsubscribe link in the email or by contacting us.</li>
                <li><strong>Withdraw Consent:</strong> Where processing is based on consent, withdraw your consent at any time.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:support@bahafit.com" className="text-[#0dd5b5] hover:underline">support@bahafit.com</a>.
                We will respond to your request within <strong>30 days</strong>. We may require you to verify your identity before processing your request.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Bahafit is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected information from a child under 13, we will promptly delete it. If you believe we have collected information from a child under 13, please contact us at{' '}
                <a href="mailto:support@bahafit.com" className="text-[#0dd5b5] hover:underline">support@bahafit.com</a>.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Bahafit operates primarily in the Caribbean region. However, some of our third-party service providers (including Vercel, MongoDB Atlas, Sanity, Google, and Meta) may process and store your data on servers located outside the Bahamas or the Caribbean region, including in the United States and the European Union. By using Bahafit, you acknowledge that your information may be transferred to and processed in these jurisdictions, which may have different data protection laws than your home country. We take steps to ensure our service providers maintain appropriate data protection standards.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. When we make material changes, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                <li>Post the updated policy on this page with a new &ldquo;Last Updated&rdquo; date.</li>
                <li>Notify you by email (to the address associated with your account) at least <strong>14 days</strong> before the changes take effect.</li>
                <li>Where required by law, seek your consent to material changes.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Your continued use of Bahafit after the effective date of any updates constitutes your acceptance of the revised Privacy Policy.
              </p>
            </section>

            <hr className="border-gray-100 my-8" />

            {/* Section 12 */}
            <section className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">[LEGAL BUSINESS ENTITY NAME] (Bahafit)</p>
                <p>[REGISTERED BUSINESS ADDRESS]</p>
                <p>The Bahamas</p>
                <p className="pt-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@bahafit.com" className="text-[#0dd5b5] hover:underline">support@bahafit.com</a>
                </p>
                <p><strong>Phone:</strong> [CUSTOMER SERVICE PHONE NUMBER]</p>
                <p><strong>Hours:</strong> [CUSTOMER SERVICE HOURS]</p>
              </div>
            </section>

            <hr className="border-gray-100 my-8" />

            <p className="text-center text-sm text-gray-400 italic">
              Bahafit — Connecting the Caribbean Fitness Community
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
