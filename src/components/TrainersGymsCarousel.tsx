'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const trainers = [
  { name: 'Darius Johnson', specialty: 'Strength Training & Bodybuilding', image: 'trainer1.jpeg' },
  { name: 'Sarah Williams', specialty: 'Yoga & Flexibility Training', image: 'trainer2.jpeg' },
  { name: 'Renaldo Rahming', specialty: 'CrossFit & HIIT Workouts', image: 'trainer3.jpeg' },
  { name: 'James Rodriguez', specialty: 'Nutrition and Weight Management', image: 'trainer4.jpeg' },
]

const gyms = [
  { name: 'Macfit West', image: 'macfit-west.jpeg' },
  { name: 'Club One', image: 'clubone.jpeg' },
  { name: 'Macfit East', image: 'macfit-east.jpeg' },
  { name: 'Empire', image: 'empire.jpeg' },
]

const allItems = [
  ...trainers.map((t, i) => ({ type: 'trainer' as const, ...t, index: i })),
  ...gyms.map((g, i) => ({ type: 'gym' as const, ...g, specialty: '', index: i })),
]

export default function TrainersGymsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 4)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4)
    }
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true })
      updateScrollState()
      return () => el.removeEventListener('scroll', updateScrollState)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 280
      const gap = 20
      const amount = direction === 'left' ? -(itemWidth + gap) * 2 : (itemWidth + gap) * 2
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-16 md:py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Gyms &amp; Fitness Trainers
            </h2>
            <p className="text-sm text-white/40 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
              Top facilities and certified professionals across the Bahamas
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'border-white/20 text-white hover:border-[#0dd5b5] hover:text-[#0dd5b5]'
                  : 'border-white/8 text-white/20 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? 'border-white/20 text-white hover:border-[#0dd5b5] hover:text-[#0dd5b5]'
                  : 'border-white/8 text-white/20 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2 -mb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.map((item, i) => (
            <Link
              key={`${item.type}-${i}`}
              href={item.type === 'trainer' ? `/trainers/trainer-${item.index + 1}` : `/gyms/gym-${item.index + 1}`}
              className="group flex-shrink-0 snap-start w-[260px] md:w-[280px] block bg-white/5 border border-white/8 rounded-2xl overflow-hidden hover:border-[#0dd5b5]/50 hover:bg-white/8 transition-all duration-300"
            >
              <div className={`${item.type === 'trainer' ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden`}>
                <Image
                  src={`/images/${item.image}`}
                  alt={item.name}
                  width={400}
                  height={item.type === 'trainer' ? 533 : 400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                      item.type === 'trainer'
                        ? 'bg-[#0dd5b5]/15 text-[#0dd5b5]'
                        : 'bg-[#f7d656]/15 text-[#f7d656]'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.type === 'trainer' ? 'Trainer' : 'Gym'}
                  </span>
                </div>
                <h3
                  className="text-base font-bold text-white mb-0.5 group-hover:text-[#0dd5b5] transition-colors"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.name}
                </h3>
                {item.type === 'trainer' && (
                  <>
                    <p className="text-xs text-white/40 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                      Certified Personal Trainer
                    </p>
                    <p className="text-xs text-white/55 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {item.specialty}
                    </p>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view-all link */}
        <div className="text-center mt-8 md:hidden">
          <Link
            href="/trainers"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0dd5b5] hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            View all trainers &amp; gyms <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
