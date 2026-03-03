'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  category: string
  authorId: string
  authorName: string
  authorAvatar?: string
  featured: boolean
  likes: string[]
  views: number
  status: string
  createdAt: string
  updatedAt: string
}

const categoryColors: Record<string, string> = {
  'Fitness Tips': '#0dd5b5',
  Wellness: '#7c6df0',
  Nutrition: '#f7d656',
  Equipment: '#ff6b6b',
  Community: '#4ecdc4',
}

function getColor(cat: string): string {
  return categoryColors[cat] || '#0dd5b5'
}

export default function BlogPostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        setPost(data)
        setLikeCount(data.likes?.length || 0)
        if (session?.user?.id) {
          setLiked(data.likes?.includes(session.user.id) || false)
        }
      })
      .catch(() => router.push('/blog'))
      .finally(() => setLoading(false))
  }, [slug, session, router])

  const handleLike = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/blog/' + slug)
      return
    }
    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: 'POST' })
      const data = await res.json()
      setLiked(data.liked)
      setLikeCount(data.count)
    } catch (err) {
      console.error('Failed to like:', err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    setDeleting(true)
    try {
      await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      router.push('/blog')
    } catch (err) {
      console.error('Failed to delete:', err)
      setDeleting(false)
    }
  }

  const isAuthor = session?.user?.id === post?.authorId
  const isAdmin = session?.user?.role === 'admin'

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#fafaf8]">
          <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
            <div className="animate-pulse">
              <div className="h-4 bg-black/5 rounded w-24 mb-8" />
              <div className="h-10 bg-black/5 rounded w-4/5 mb-4" />
              <div className="h-10 bg-black/5 rounded w-3/5 mb-10" />
              <div className="h-64 bg-black/5 rounded-xl mb-10" />
              <div className="space-y-3">
                <div className="h-4 bg-black/5 rounded w-full" />
                <div className="h-4 bg-black/5 rounded w-full" />
                <div className="h-4 bg-black/5 rounded w-4/5" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!post) return null

  const publishDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#fafaf8]">
        {/* Article Header */}
        <div className="bg-white border-b border-black/6">
          <div className="max-w-3xl mx-auto px-6 pt-28 pb-10">
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/blog"
                className="text-sm text-black/40 hover:text-black transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Feed
              </Link>
              <span className="text-black/20">/</span>
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: getColor(post.category) }}
              >
                {post.category}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-[1.1] mb-8"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0dd5b5] flex items-center justify-center flex-shrink-0">
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-semibold">
                      {post.authorName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-black">{post.authorName}</div>
                  <div className="text-xs text-black/40">{publishDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-xs text-black/35">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    {post.views}
                  </span>
                </div>
                {(isAuthor || isAdmin) && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-6 -mt-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover rounded-b-2xl"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-6 py-12">
          <div
            className="prose prose-lg max-w-none text-black/75 leading-relaxed
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-5
              [&_blockquote]:border-l-4 [&_blockquote]:border-[#0dd5b5] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-black/50 [&_blockquote]:my-8
              [&_a]:text-[#0dd5b5] [&_a]:underline [&_a]:underline-offset-2
              [&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5
              [&_li]:mb-2
              [&_strong]:text-black [&_strong]:font-semibold"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Like + Share Bar */}
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between py-6 border-t border-b border-black/6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                liked
                  ? 'bg-red-50 text-red-500'
                  : 'bg-black/4 text-black/50 hover:bg-black/8 hover:text-black/70'
              }`}
            >
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={liked ? 0 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-black/4 text-black/50 hover:bg-black/8 hover:text-black/70 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
