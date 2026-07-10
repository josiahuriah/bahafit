'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ActivityCard, { Avatar, FeedActivity } from '@/components/community/ActivityCard'
import { timeAgo } from '@/components/community/helpers'

interface Comment {
  _id: string
  userId: string
  userName: string
  userImage?: string
  text: string
  createdAt: string
}

export default function ActivityDetailPage() {
  const { data: session, status: authStatus } = useSession()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [activity, setActivity] = useState<FeedActivity | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [posting, setPosting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/community/activity/${id}`)
    }
  }, [authStatus, router, id])

  const load = useCallback(async () => {
    try {
      const [aRes, cRes] = await Promise.all([
        fetch(`/api/activities/${id}`),
        fetch(`/api/activities/${id}/comments`),
      ])
      if (aRes.ok) {
        const data = await aRes.json()
        setActivity(data.activity)
      } else {
        setNotFound(true)
      }
      if (cRes.ok) {
        const data = await cRes.json()
        setComments(data.comments || [])
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (session?.user?.id && id) load()
  }, [session, id, load])

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = commentText.trim()
    if (!text || posting) return
    setPosting(true)
    try {
      const res = await fetch(`/api/activities/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (res.ok) {
        const data = await res.json()
        setComments((c) => [...c, data.comment])
        setCommentText('')
      }
    } finally {
      setPosting(false)
    }
  }

  const removeComment = async (commentId: string) => {
    const res = await fetch(`/api/activities/${id}/comments?commentId=${commentId}`, { method: 'DELETE' })
    if (res.ok) setComments((c) => c.filter((x) => x._id !== commentId))
  }

  const deleteActivity = async () => {
    if (!window.confirm('Delete this activity? This cannot be undone.')) return
    setDeleting(true)
    const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/community')
    } else {
      setDeleting(false)
    }
  }

  if (authStatus === 'loading' || !session || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0dd5b5] border-t-transparent" />
        </div>
        <Footer />
      </>
    )
  }

  if (notFound || !activity) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity Not Found</h1>
          <p className="text-gray-600 mb-6">It may have been deleted or is private.</p>
          <Link href="/community" className="bg-[#0dd5b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0bc5a5] transition-colors">
            Back to Community
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const isOwner = activity.userId === session.user.id
  const isAdmin = session.user.role === 'admin'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/community" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Community
            </Link>
            {(isOwner || isAdmin) && (
              <button
                onClick={deleteActivity}
                disabled={deleting}
                className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>

          <ActivityCard activity={activity} detailed />

          {/* Comments */}
          <div className="bg-white rounded-xl shadow-sm mt-4 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Comments {comments.length > 0 && `(${comments.length})`}
            </h2>

            {comments.length === 0 && (
              <p className="text-sm text-gray-400 mb-4">No comments yet — be the first to cheer them on.</p>
            )}

            <ul className="space-y-4 mb-4">
              {comments.map((c) => (
                <li key={c._id} className="flex gap-3">
                  <Link href={`/community/athletes/${c.userId}`}>
                    <Avatar name={c.userName} image={c.userImage} size={8} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/community/athletes/${c.userId}`}
                          className="text-sm font-semibold text-gray-900 hover:text-[#0dd5b5]"
                        >
                          {c.userName}
                        </Link>
                        <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{c.text}</p>
                    </div>
                    {(c.userId === session.user.id || isAdmin) && (
                      <button
                        onClick={() => removeComment(c._id)}
                        className="text-xs text-gray-400 hover:text-red-500 mt-1 ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <form onSubmit={postComment} className="flex gap-3">
              <Avatar name={session.user.name || ''} image={session.user.image} size={8} />
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={1000}
                placeholder="Add a comment…"
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#0dd5b5]"
              />
              <button
                type="submit"
                disabled={posting || !commentText.trim()}
                className="bg-[#0dd5b5] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0bc5a5] transition-colors disabled:opacity-40"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
