'use client'

import { useState, useEffect } from 'react'

interface BlogPost {
  _id: string
  title: string
  slug: string
  category: string
  authorName: string
  featured: boolean
  likes: string[]
  views: number
  status: string
  createdAt: string
}

interface Category {
  _id: string
  name: string
  slug: string
  createdAt: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const res = await fetch('/api/blog?limit=100&status=published')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      setError('Failed to load posts')
    } finally {
      setLoadingPosts(false)
    }
  }

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const res = await fetch('/api/blog/categories')
      const data = await res.json()
      setCategories(data)
    } catch {
      setError('Failed to load categories')
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    setActionLoading('add-category')
    setError('')
    try {
      const res = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      setNewCategory('')
      setSuccess('Category added')
      fetchCategories()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Posts in this category will keep their category label.`)) return
    setActionLoading(`delete-${id}`)
    setError('')
    try {
      const res = await fetch(`/api/blog/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Category deleted')
      fetchCategories()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSetFeatured = async (slug: string) => {
    setActionLoading(`feature-${slug}`)
    setError('')
    try {
      const res = await fetch('/api/admin/blog/featured', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) throw new Error('Failed to set featured')
      setSuccess('Featured post updated')
      fetchPosts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeletePost = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setActionLoading(`delete-post-${slug}`)
    setError('')
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete post')
      setSuccess('Post deleted')
      fetchPosts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage categories and featured posts</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-500">Total Posts</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{posts.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-500">Categories</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{categories.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-500">Featured</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {posts.filter((p) => p.featured).length}
          </div>
        </div>
      </div>

      {/* Categories Management */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        </div>
        <div className="p-6">
          {/* Add Category */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="New category name..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0dd5b5]/30 focus:border-[#0dd5b5]"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim() || actionLoading === 'add-category'}
              className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {actionLoading === 'add-category' ? 'Adding...' : 'Add Category'}
            </button>
          </div>

          {/* Category List */}
          {loadingCategories ? (
            <div className="text-sm text-gray-400 py-4">Loading categories...</div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-400 ml-3">/{cat.slug}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    disabled={actionLoading === `delete-${cat._id}`}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `delete-${cat._id}` ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts — Featured Selection */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Blog Posts</h2>
          <p className="text-xs text-gray-400 mt-0.5">Select a post to feature on the blog feed</p>
        </div>
        <div className="divide-y divide-gray-50">
          {loadingPosts ? (
            <div className="text-sm text-gray-400 p-6">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-sm text-gray-400 p-6">No published posts yet</div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </span>
                    {post.featured && (
                      <span className="flex-shrink-0 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{post.authorName}</span>
                    <span>&middot;</span>
                    <span>{post.category}</span>
                    <span>&middot;</span>
                    <span>{post.views} views</span>
                    <span>&middot;</span>
                    <span>{post.likes?.length || 0} likes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!post.featured && (
                    <button
                      onClick={() => handleSetFeatured(post.slug)}
                      disabled={actionLoading === `feature-${post.slug}`}
                      className="px-3 py-1.5 text-xs font-medium text-[#0dd5b5] border border-[#0dd5b5]/30 rounded-lg hover:bg-[#0dd5b5]/5 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === `feature-${post.slug}` ? '...' : 'Set Featured'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePost(post.slug, post.title)}
                    disabled={actionLoading === `delete-post-${post.slug}`}
                    className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === `delete-post-${post.slug}` ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
