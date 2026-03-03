'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  category: string
  authorName: string
  authorAvatar?: string
  featured: boolean
  likes: string[]
  views: number
  createdAt: string
}

interface Category {
  _id: string
  name: string
  slug: string
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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function readTime(excerpt: string): string {
  const words = excerpt.split(/\s+/).length * 4
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

export default function BlogPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')

  const fetchPosts = useCallback(async (cat: string, pageNum: number, searchTerm: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (cat !== 'All') params.set('category', cat)
      if (searchTerm) params.set('search', searchTerm)
      params.set('page', pageNum.toString())
      params.set('limit', '12')

      const res = await fetch(`/api/blog?${params}`)
      const data = await res.json()
      setPosts(data.posts || [])
      setTotal(data.total || 0)

      // Get featured separately on first load
      if (pageNum === 1 && !searchTerm && cat === 'All') {
        const featRes = await fetch('/api/blog?featured=true&limit=1')
        const featData = await featRes.json()
        setFeaturedPost(featData.posts?.[0] || null)
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch('/api/blog/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetchPosts(activeCategory, page, search)
  }, [activeCategory, page, search, fetchPosts])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setPage(1)
  }

  const totalPages = Math.ceil(total / 12)

  // Separate featured from regular posts in display
  const displayPosts = posts.filter((p) => !p.featured || activeCategory !== 'All' || search || page > 1)

  return (
    <>
      <Header />

      <main className="bg-[#fafaf8] min-h-screen">
        {/* Hero — compact, editorial */}
        <section className="bg-black pt-28 pb-14 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[#0dd5b5] text-[10px] tracking-[0.5em] uppercase mb-4 font-medium">Community Feed</p>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.95] tracking-tight"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Share. Inspire.<br />
                <span className="text-[#f7d656]">Move.</span>
              </h1>
            </div>
            {session && (
              <Link
                href="/blog/create"
                className="inline-flex items-center gap-2 bg-[#0dd5b5] text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0bc4a6] transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Write a Post
              </Link>
            )}
          </div>
        </section>

        {/* Categories + Search */}
        <div className="sticky top-[60px] z-30 bg-white/90 backdrop-blur-xl border-b border-black/6">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex items-center gap-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex gap-0 flex-shrink-0">
                {['All', ...categories.map((c) => c.name)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 text-xs font-semibold whitespace-nowrap tracking-wide uppercase transition-all rounded-full ${
                      activeCategory === cat
                        ? 'bg-black text-white'
                        : 'text-black/40 hover:text-black/70 hover:bg-black/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex-shrink-0">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="pl-9 pr-4 py-2 text-sm bg-black/4 rounded-full border-none outline-none w-48 focus:w-64 transition-all placeholder:text-black/30 text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-10">
          {/* Featured Post */}
          {featuredPost && activeCategory === 'All' && !search && page === 1 && (
            <Link href={`/blog/${featuredPost.slug}`} className="group block mb-14">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="lg:col-span-3 aspect-[16/9] lg:aspect-auto relative overflow-hidden bg-black/5">
                  {featuredPost.coverImage ? (
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5]/20 to-black/5 flex items-center justify-center min-h-[300px]">
                      <span className="text-6xl opacity-20">&#9997;</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                      style={{ background: '#f7d656', color: '#000' }}
                    >
                      Featured
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase mb-4 inline-block"
                    style={{ color: getColor(featuredPost.category) }}
                  >
                    {featuredPost.category}
                  </span>
                  <h2
                    className="text-2xl lg:text-3xl font-bold text-black leading-tight mb-4 group-hover:text-[#0dd5b5] transition-colors"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {featuredPost.title}
                  </h2>
                  <p className="text-black/50 text-sm leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0dd5b5] flex items-center justify-center flex-shrink-0">
                      {featuredPost.authorAvatar ? (
                        <img src={featuredPost.authorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-xs font-semibold">
                          {featuredPost.authorName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">{featuredPost.authorName}</div>
                      <div className="text-[11px] text-black/40">
                        {timeAgo(featuredPost.createdAt)} &middot; {readTime(featuredPost.excerpt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-black/5" />
                  <div className="p-5">
                    <div className="h-3 bg-black/5 rounded w-20 mb-4" />
                    <div className="h-5 bg-black/5 rounded w-4/5 mb-2" />
                    <div className="h-5 bg-black/5 rounded w-3/5 mb-4" />
                    <div className="h-3 bg-black/5 rounded w-full mb-2" />
                    <div className="h-3 bg-black/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {!loading && displayPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.map((post) => (
                <article key={post._id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                    {/* Image */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-black/3">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0dd5b5]/10 via-transparent to-[#f7d656]/10 flex items-center justify-center">
                          <span className="text-4xl opacity-15">&#128221;</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
                          style={{ background: `${getColor(post.category)}dd`, color: '#000' }}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3
                        className="text-lg font-bold text-black leading-snug mb-2 group-hover:text-[#0dd5b5] transition-colors line-clamp-2"
                        style={{ fontFamily: 'var(--font-syne)' }}
                      >
                        {post.title}
                      </h3>
                      <p className="text-black/45 text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Author + Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#0dd5b5] flex items-center justify-center flex-shrink-0">
                            {post.authorAvatar ? (
                              <img src={post.authorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-white text-[10px] font-semibold">
                                {post.authorName?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-black">{post.authorName}</div>
                            <div className="text-[10px] text-black/35">{timeAgo(post.createdAt)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-black/30">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            {post.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && displayPosts.length === 0 && !featuredPost && (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                No posts yet
              </h3>
              <p className="text-black/40 text-sm mb-8">Be the first to share something with the community.</p>
              {session ? (
                <Link
                  href="/blog/create"
                  className="inline-flex items-center gap-2 bg-[#0dd5b5] text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0bc4a6] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Write the First Post
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0dd5b5] hover:text-black transition-colors"
                >
                  Sign In to Post
                </Link>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-14">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-black/50 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-black text-white'
                      : 'text-black/40 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-black/50 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
