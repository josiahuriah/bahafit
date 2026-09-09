'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

// Only allow redirects back to a path on this site, never to an external URL.
function safeCallback(raw: string | null): string {
  if (!raw) return '/'
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

function EnterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = safeCallback(searchParams.get('callbackUrl'))

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(callbackUrl)
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Incorrect password.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0dd5b5] via-[#0bc4a6] to-[#099a82]">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Bahafit"
            width={140}
            height={35}
            priority
            style={{ height: '34px', width: 'auto' }}
          />
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0dd5b5]/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0a9b85]">
            Developer preview
          </span>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Enter the password</h1>
          <p className="mt-1 text-sm text-gray-500">
            This build is password protected while we finish getting Bahafit ready.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-md bg-red-50 p-3" role="alert">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="site-password" className="sr-only">
              Password
            </label>
            <input
              id="site-password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-[#0dd5b5] focus:outline-none focus:ring-2 focus:ring-[#0dd5b5]/40"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0dd5b5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0bc4a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0dd5b5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Enter site'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function EnterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0dd5b5] via-[#0bc4a6] to-[#099a82]">
          <div className="text-white">Loading…</div>
        </div>
      }
    >
      <EnterForm />
    </Suspense>
  )
}
