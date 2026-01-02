'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'

interface CarouselProps {
  children: ReactNode[]
  title?: string
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export default function Carousel({
  children,
  title,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = '',
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const itemCount = children.length

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

      // Calculate active index based on scroll position
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 0
      const gap = 16 // gap-4 = 16px
      const index = Math.round(scrollLeft / (itemWidth + gap))
      setActiveIndex(Math.min(index, itemCount - 1))
    }
  }

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollState)
      updateScrollState()
      return () => scrollContainer.removeEventListener('scroll', updateScrollState)
    }
  }, [itemCount])

  useEffect(() => {
    if (autoPlay && scrollRef.current) {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
          const itemWidth = scrollRef.current.children[0]?.clientWidth || 0
          const gap = 16

          if (scrollLeft >= scrollWidth - clientWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            scrollRef.current.scrollBy({ left: itemWidth + gap, behavior: 'smooth' })
          }
        }
      }, autoPlayInterval)

      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayInterval])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 0
      const gap = 16
      const scrollAmount = direction === 'left' ? -(itemWidth + gap) : itemWidth + gap
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollRef.current && scrollRef.current.children[index]) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 0
      const gap = 16
      scrollRef.current.scrollTo({ left: index * (itemWidth + gap), behavior: 'smooth' })
    }
  }

  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-colors ${
                canScrollLeft
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
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
              className={`p-2 rounded-full transition-colors ${
                canScrollRight
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children.map((child, index) => (
          <div key={index} className="flex-shrink-0 snap-start">
            {child}
          </div>
        ))}
      </div>

      {showDots && itemCount > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-[#0dd5b5]' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
