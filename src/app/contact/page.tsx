'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-black min-h-[40vh] flex items-end pb-16 pt-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl">
          <p className="text-[#0dd5b5] text-xs tracking-[0.4em] uppercase mb-8 font-medium">Contact</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight">
            {"Let's talk."}
          </h1>
        </div>
      </section>

      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="pt-12 border-t-2 border-[#0dd5b5]">
                  <div className="w-12 h-12 bg-[#0dd5b5] flex items-center justify-center mb-8">
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-3">Message received.</h3>
                  <p className="text-gray-500">{"We'll get back to you within 24–48 hours."}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="border-t-2 border-black pt-10">
                  <h2 className="text-2xl font-bold text-black mb-10">Send a message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-b border-gray-200 py-3 text-black bg-transparent focus:outline-none focus:border-[#0dd5b5] transition-colors placeholder:text-gray-300 text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border-b border-gray-200 py-3 text-black bg-transparent focus:outline-none focus:border-[#0dd5b5] transition-colors placeholder:text-gray-300 text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="subject" className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
                      Subject
                    </label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border-b border-gray-200 py-3 text-black bg-transparent focus:outline-none focus:border-[#0dd5b5] transition-colors appearance-none cursor-pointer text-sm"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Support</option>
                      <option value="business">Business Partnership</option>
                      <option value="listing">Listing Question</option>
                      <option value="event">Event Question</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="mb-12">
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border-b border-gray-200 py-3 text-black bg-transparent focus:outline-none focus:border-[#0dd5b5] transition-colors resize-none placeholder:text-gray-300 text-sm"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-10 py-4 bg-black text-white text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 border-t-2 border-[#0dd5b5] pt-10">
              <h2 className="text-2xl font-bold text-black mb-10">Get in Touch</h2>

              <div className="space-y-10">
                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">Email</p>
                  <p className="text-black font-medium">support@bahafit.com</p>
                  <p className="text-sm text-gray-400 mt-1">Response within 24–48 hours</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">Location</p>
                  <p className="text-black font-medium">Nassau, Bahamas</p>
                  <p className="text-sm text-gray-400 mt-1">Serving the entire Caribbean</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">Hours</p>
                  <p className="text-black font-medium">Mon – Fri, 9AM – 6PM EST</p>
                  <p className="text-sm text-gray-400 mt-1">Closed weekends & public holidays</p>
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-6">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { label: 'FB', href: '#' },
                    { label: 'IG', href: '#' },
                    { label: 'TW', href: '#' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="w-10 h-10 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 hover:border-[#0dd5b5] hover:text-[#0dd5b5] transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
