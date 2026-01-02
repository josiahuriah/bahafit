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
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Privacy Policy
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600">
                Bahafit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-gray-600">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Personal Information</h3>
              <p className="text-gray-600">We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Register for an account</li>
                <li>Create or update a business listing</li>
                <li>Register for events</li>
                <li>Contact us for support</li>
                <li>Subscribe to our newsletter</li>
                <li>Leave reviews or comments</li>
              </ul>
              <p className="text-gray-600 mt-4">This information may include:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Name and email address</li>
                <li>Phone number</li>
                <li>Business information (for business accounts)</li>
                <li>Payment information</li>
                <li>Profile photos</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Automatically Collected Information</h3>
              <p className="text-gray-600">When you visit our website, we automatically collect certain information, including:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Location data (with your permission)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Protect against fraudulent or illegal activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-600">We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li><strong>Business Listings:</strong> Information you include in your public business listing is visible to all users</li>
                <li><strong>Service Providers:</strong> We may share information with third-party vendors who help us operate our platform</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="text-gray-600 mt-4">We do not sell your personal information to third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no electronic transmission over the internet can be guaranteed to be 100% secure, so please take care when disclosing personal information online.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Access and receive a copy of your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. See our Cookie Policy for more information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions or concerns about this privacy policy, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Email:</strong> privacy@bahafit.com<br />
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
