'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Category {
  _id: string
  name: string
  slug: string
}

export default function CreateBlogPost() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/blog/create')
    }
  }, [status, router])

  useEffect(() => {
    fetch('/api/blog/categories')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data) })
      .catch(console.error)
  }, [])

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Upload failed')
    }
    const data = await res.json()
    return data.url
  }, [])

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setCoverImage(url)
    } catch (err: any) {
      setError(err.message)
      setCoverPreview('')
    } finally {
      setUploading(false)
    }
  }

  const insertImage = async () => {
    fileInputRef.current?.click()
  }

  const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      const editor = editorRef.current
      if (editor) {
        editor.focus()
        const img = document.createElement('img')
        img.src = url
        img.alt = file.name
        img.style.maxWidth = '100%'
        img.style.borderRadius = '8px'
        img.style.margin = '16px 0'

        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(img)
          range.setStartAfter(img)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          editor.appendChild(img)
        }

        // Add a line break after image
        const br = document.createElement('br')
        img.after(br)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleSubmit = async (postStatus: 'published' | 'draft' = 'published') => {
    if (!title.trim()) {
      setError('Please add a title')
      return
    }
    if (!category) {
      setError('Please select a category')
      return
    }
    const content = editorRef.current?.innerHTML || ''
    if (!content.trim() || content === '<br>') {
      setError('Please add some content')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const plainText = editorRef.current?.innerText || ''
      const excerpt = plainText.slice(0, 160).trim()

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          coverImage,
          category,
          status: postStatus,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create post')
      }

      const post = await res.json()
      router.push(`/blog/${post.slug}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
          <div className="animate-pulse text-black/40 text-sm tracking-widest uppercase">Loading...</div>
        </div>
        <Footer />
      </>
    )
  }

  if (!session) return null

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#fafaf8]">
        {/* Top bar */}
        <div className="sticky top-[60px] z-40 bg-white/80 backdrop-blur-xl border-b border-black/6">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/blog"
              className="text-sm text-black/50 hover:text-black transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Feed
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={submitting}
                className="px-5 py-2 text-sm font-medium text-black/60 hover:text-black border border-black/10 hover:border-black/20 rounded-full transition-all"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={submitting || uploading}
                className="px-6 py-2 text-sm font-semibold text-black bg-[#0dd5b5] hover:bg-[#0bc4a6] rounded-full transition-all disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Cover Image */}
          <div className="mb-10">
            {coverPreview ? (
              <div className="relative group">
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="w-full aspect-[21/9] object-cover rounded-2xl"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <div className="text-white text-sm font-medium">Uploading...</div>
                  </div>
                )}
                <button
                  onClick={() => {
                    setCoverPreview('')
                    setCoverImage('')
                  }}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full aspect-[21/9] border-2 border-dashed border-black/10 hover:border-[#0dd5b5]/40 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-black/5 group-hover:bg-[#0dd5b5]/10 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-black/30 group-hover:text-[#0dd5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
                <span className="text-sm text-black/40 group-hover:text-black/60 transition-colors">
                  Add a cover image
                </span>
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-4xl md:text-5xl font-bold text-black placeholder:text-black/20 bg-transparent border-none outline-none mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          />

          {/* Category */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-10 border-b border-black/6">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setCategory(cat.name)}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full transition-all ${
                  category === cat.name
                    ? 'bg-[#0dd5b5] text-black'
                    : 'bg-black/5 text-black/40 hover:bg-black/10 hover:text-black/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Editor Toolbar */}
          <div className="sticky top-[120px] z-30 bg-white border border-black/6 rounded-xl p-2 mb-6 flex flex-wrap items-center gap-1 shadow-sm">
            <button
              onClick={() => execCommand('bold')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
              title="Bold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
              </svg>
            </button>
            <button
              onClick={() => execCommand('italic')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
              title="Italic"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
              </svg>
            </button>
            <button
              onClick={() => execCommand('underline')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
              title="Underline"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
              </svg>
            </button>

            <div className="w-px h-5 bg-black/10 mx-1" />

            <button
              onClick={() => execCommand('formatBlock', 'h2')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors text-xs font-bold"
              title="Heading"
            >
              H2
            </button>
            <button
              onClick={() => execCommand('formatBlock', 'h3')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors text-xs font-bold"
              title="Subheading"
            >
              H3
            </button>
            <button
              onClick={() => execCommand('formatBlock', 'blockquote')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
              title="Quote"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
            </button>

            <div className="w-px h-5 bg-black/10 mx-1" />

            <button
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
              title="Bullet List"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
              </svg>
            </button>
            <button
              onClick={() => execCommand('insertOrderedList')}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
              title="Numbered List"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
              </svg>
            </button>

            <div className="w-px h-5 bg-black/10 mx-1" />

            <button
              onClick={() => {
                const url = prompt('Enter link URL:')
                if (url) execCommand('createLink', url)
              }}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors"
              title="Insert Link"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
            </button>
            <button
              onClick={insertImage}
              disabled={uploading}
              className="p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/5 transition-colors disabled:opacity-40"
              title="Insert Image"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleInlineImage}
              className="hidden"
            />
          </div>

          {/* Content Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[400px] text-lg text-black/80 leading-relaxed outline-none prose prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0dd5b5] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-black/60 [&_a]:text-[#0dd5b5] [&_a]:underline [&_img]:rounded-xl [&_img]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
            data-placeholder="Share your story, tip, or experience..."
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          />

          <style jsx global>{`
            [data-placeholder]:empty:before {
              content: attr(data-placeholder);
              color: rgba(0,0,0,0.2);
              pointer-events: none;
            }
          `}</style>
        </div>
      </main>

      <Footer />
    </>
  )
}
