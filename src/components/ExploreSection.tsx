'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    name: 'Race',
    image: '/images/race.jpg',
    href: '/events/races',
    items: [
      { label: '5K Runs', href: '/events/races/5k' },
      { label: '10K Runs', href: '/events/races/10k' },
      { label: 'Half Marathons', href: '/events/races/half-marathon' },
      { label: 'Marathons', href: '/events/races/marathon' },
      { label: 'Trail Races', href: '/events/races/trail' },
      { label: 'View All Races →', href: '/events/races', highlight: true },
    ],
  },
  {
    name: 'Clubs',
    image: '/images/clubs.jpg',
    href: '/listings/clubs',
    items: [
      { label: 'Running Clubs', href: '/listings/clubs/running' },
      { label: 'Cycling Clubs', href: '/listings/clubs/cycling' },
      { label: 'Swimming Clubs', href: '/listings/clubs/swimming' },
      { label: 'CrossFit Groups', href: '/listings/clubs/crossfit' },
      { label: 'Yoga Groups', href: '/listings/clubs/yoga' },
      { label: 'View All Clubs →', href: '/listings/clubs', highlight: true },
    ],
  },
  {
    name: 'Studios',
    image: '/images/studios.jpg',
    href: '/listings/studios',
    items: [
      { label: 'Yoga Studios', href: '/listings/studios/yoga' },
      { label: 'Pilates', href: '/listings/studios/pilates' },
      { label: 'Dance Studios', href: '/listings/studios/dance' },
      { label: 'Spin Studios', href: '/listings/studios/spin' },
      { label: 'Boxing Gyms', href: '/listings/studios/boxing' },
      { label: 'View All Studios →', href: '/listings/studios', highlight: true },
    ],
  },
  {
    name: 'Gyms',
    image: '/images/gyms.jpg',
    href: '/listings/gyms',
    items: [
      { label: 'Commercial Gyms', href: '/listings/gyms/commercial' },
      { label: 'Boutique Gyms', href: '/listings/gyms/boutique' },
      { label: 'CrossFit Boxes', href: '/listings/gyms/crossfit' },
      { label: '24-Hour Gyms', href: '/listings/gyms/24hr' },
      { label: 'Hotel Gyms', href: '/listings/gyms/hotel' },
      { label: 'View All Gyms →', href: '/listings/gyms', highlight: true },
    ],
  },
  {
    name: 'Classes',
    image: '/images/classes.jpg',
    href: '/listings/classes',
    items: [
      { label: 'HIIT', href: '/listings/classes/hiit' },
      { label: 'Zumba', href: '/listings/classes/zumba' },
      { label: 'Spin', href: '/listings/classes/spin' },
      { label: 'Pilates', href: '/listings/classes/pilates' },
      { label: 'Aqua Fitness', href: '/listings/classes/aqua' },
      { label: 'View All Classes →', href: '/listings/classes', highlight: true },
    ],
  },
  {
    name: 'Activities',
    image: '/images/activities.jpg',
    href: '/listings/activities',
    items: [
      { label: 'Swimming', href: '/listings/activities/swimming' },
      { label: 'Cycling', href: '/listings/activities/cycling' },
      { label: 'Hiking', href: '/listings/activities/hiking' },
      { label: 'Tennis', href: '/listings/activities/tennis' },
      { label: 'Paddle Boarding', href: '/listings/activities/paddle' },
      { label: 'View All Activities →', href: '/listings/activities', highlight: true },
    ],
  },
  {
    name: 'Health Fairs',
    image: '/images/health-fairs.jpg',
    href: '/events/expos',
    items: [
      { label: 'Nutrition Expos', href: '/events/expos/nutrition' },
      { label: 'Wellness Conferences', href: '/events/expos/wellness' },
      { label: 'Community Health Days', href: '/events/expos/community' },
      { label: 'Fitness Expos', href: '/events/expos/fitness' },
      { label: 'View All Health Fairs →', href: '/events/expos', highlight: true },
    ],
  },
  {
    name: 'Fitness Guide',
    image: '/images/fitness-guide.jpg',
    href: '/blog',
    items: [
      { label: "Beginner's Guide", href: '/blog/beginners-guide' },
      { label: 'Nutrition Tips', href: '/blog/nutrition' },
      { label: 'Workout Plans', href: '/blog/workout-plans' },
      { label: 'Recovery & Rest', href: '/blog/recovery' },
      { label: 'View All Guides →', href: '/blog', highlight: true },
    ],
  },
  {
    name: 'Sports',
    image: '/images/sports.jpg',
    href: '/listings/sports',
    items: [
      { label: 'Basketball', href: '/listings/sports/basketball' },
      { label: 'Football', href: '/listings/sports/football' },
      { label: 'Tennis', href: '/listings/sports/tennis' },
      { label: 'Cricket', href: '/listings/sports/cricket' },
      { label: 'Track & Field', href: '/listings/sports/track' },
      { label: 'View All Sports →', href: '/listings/sports', highlight: true },
    ],
  },
  {
    name: 'Kids',
    image: '/images/kids.jpg',
    href: '/listings/kids',
    items: [
      { label: 'Youth Sports', href: '/listings/kids/sports' },
      { label: "Kids' Classes", href: '/listings/kids/classes' },
      { label: 'Summer Camps', href: '/listings/kids/camps' },
      { label: 'Teen Fitness', href: '/listings/kids/teen' },
      { label: 'View All Kids →', href: '/listings/kids', highlight: true },
    ],
  },
]

export default function ExploreSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const active = activeIndex !== null ? categories[activeIndex] : null

  return (
    <section className="py-14 bg-white border-t border-black/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Explore
          </h2>
          <p className="text-sm text-black/50 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Select a category to discover everything available
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 group ${
                activeIndex === i
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              {/* Image circle */}
              <div
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                  activeIndex === i
                    ? 'border-[#0dd5b5]'
                    : 'border-black/10 group-hover:border-black/25'
                }`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Label */}
              <span
                className="text-[10px] md:text-xs font-medium text-center leading-tight"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Reveal Panel */}
        {active && (
          <div className="explore-panel mt-4 bg-black rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {active.name}
              </h3>
              <button
                onClick={() => setActiveIndex(null)}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {active.items.map((item, j) => (
                <Link
                  key={j}
                  href={item.href}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium text-center transition-all duration-150 ${'highlight' in item && item.highlight
                      ? 'bg-[#0dd5b5] text-black hover:bg-[#0dd5b5]/90 col-span-2 sm:col-span-1'
                      : 'bg-white/8 text-white/80 hover:bg-white/15 hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
