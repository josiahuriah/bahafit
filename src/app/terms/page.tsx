import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Terms of Service | Bahafit',
  description: 'Read the terms and conditions for using Bahafit services.',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Terms of Service
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing or using Bahafit ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600">
                Bahafit is an online platform that connects fitness enthusiasts with fitness businesses, trainers, events, and wellness services across the Caribbean. We provide a directory of listings and facilitate connections but are not directly involved in transactions between users and businesses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600">To access certain features, you must register for an account. You agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p className="text-gray-600 mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Business Listings</h2>
              <p className="text-gray-600">If you create a business listing, you agree that:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>All information provided is accurate and not misleading</li>
                <li>You have the right to represent the business being listed</li>
                <li>You will keep your listing information up to date</li>
                <li>You will not post content that is illegal, harmful, or infringes on others' rights</li>
                <li>You are solely responsible for your business operations and customer interactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Events</h2>
              <p className="text-gray-600">For event organizers:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>You are responsible for the accuracy of event information</li>
                <li>You must have proper authorization to host the event</li>
                <li>You are responsible for safety and compliance with local regulations</li>
                <li>You must honor any commitments made to attendees</li>
              </ul>
              <p className="text-gray-600 mt-4">For event attendees:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>Registration and attendance terms are set by the event organizer</li>
                <li>Bahafit is not responsible for event cancellations or changes</li>
                <li>Refund policies are determined by individual organizers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Content</h2>
              <p className="text-gray-600">
                By posting content (reviews, photos, comments) on Bahafit, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute such content. You represent that you own or have the right to share any content you post.
              </p>
              <p className="text-gray-600 mt-4">You agree not to post content that:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>Is false, misleading, or defamatory</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains viruses or malicious code</li>
                <li>Violates any law or regulation</li>
                <li>Is spam or unauthorized advertising</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-600">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, threaten, or intimidate other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Scrape or collect data without permission</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Post fake reviews or manipulate ratings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Payment Terms</h2>
              <p className="text-gray-600">
                For paid subscriptions and services, you agree to provide accurate payment information and authorize us to charge the applicable fees. All fees are non-refundable unless otherwise stated. We reserve the right to change pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-600">
                The Service and its original content (excluding user content) are and will remain the exclusive property of Bahafit. Our trademarks and trade dress may not be used without our prior written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-gray-600">
                The Service is provided "as is" without warranties of any kind. We do not guarantee the accuracy of listings, the quality of services provided by listed businesses, or the safety of events. Users interact with businesses and attend events at their own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-600">
                To the maximum extent permitted by law, Bahafit shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service or any transactions with businesses found through our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-600">
                You agree to indemnify and hold harmless Bahafit and its affiliates from any claims, damages, or expenses arising from your use of the Service, your content, or your violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
              <p className="text-gray-600">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-600">
                These Terms shall be governed by the laws of the Commonwealth of The Bahamas without regard to conflict of law provisions. Any disputes shall be resolved in the courts of The Bahamas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Email:</strong> legal@bahafit.com<br />
                <strong>Address:</strong> Nassau, Bahamas
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
