'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    setSubmittedEmail(trimmed)
  }

  if (submittedEmail) {
    return (
      <div className="cs-success cs-on" role="status" aria-live="polite">
        <div className="cs-check" aria-hidden="true">
          <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="cs-msg">
          <div className="cs-t">You&apos;re on the list.</div>
          <div className="cs-s">
            We&apos;ll email <span>{submittedEmail}</span> when Bahafit launches.
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="cs-form-card" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="you@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button type="submit">
        Join the waitlist
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </form>
  )
}
