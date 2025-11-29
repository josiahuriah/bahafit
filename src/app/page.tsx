import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image';


export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          {/* Fallback gradient if video doesn't load */}
        </video>

        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black/50" /> */}

        {/* Hero Content */}
        {/* <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Your Caribbean Fitness
              <br />
              <span className="text-blue-400">Community Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Connect with fitness events, trainers, gyms, and wellness centers across the Caribbean
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/events"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div> */}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* What is Bahafit Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0dd5b5] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f7d656] opacity-5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#0dd5b5] bg-opacity-10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-[#0dd5b5] rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold" style={{ color: '#0dd5b5' }}>
                  YOUR FITNESS HUB
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block" style={{ color: '#0dd5b5' }}>What is</span>
                <span className="block mt-2" style={{ color: '#f7d656' }}>Bahafit</span>
                <span className="text-black">?</span>
              </h2>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  Bahafit is your{' '}
                  <span className="font-bold relative inline-block">
                    <span style={{ color: '#0dd5b5' }}>one-stop shop</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#f7d656] opacity-30"></span>
                  </span>
                  {' '}for everything fitness in the Bahamas.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  From events and competitions to gyms, trainers, and wellness centers, we bring the entire fitness community together in one place.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#0dd5b5] hover:bg-[#0bc5a5] text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105 group"
                >
                  Learn More
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column - Image with Modern Layout */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/workout1.jpg"
                  alt="Fitness workout"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border-4 border-[#f7d656]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0dd5b5] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-black">100% Verified</div>
                    <div className="text-sm text-gray-600">All listings verified</div>
                  </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-8 -right-8 w-32 h-32 bg-[#f7d656] rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Join the most exciting fitness events in the Caribbean
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-72  flex items-center justify-center">
                <Image
                  src="/images/event1.jpeg"
                  alt="Fitness Event"
                  width={2000}
                  height={8000}
                  className="h-72 w-auto"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>December 15, 2025</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Caribbean Marathon 2025
                </h3>
                <p className="text-gray-600 mb-4">
                  Join hundreds of runners for the annual Caribbean Marathon in Nassau
                </p>
                <Link
                  href="/events/caribbean-marathon"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-72  flex items-center justify-center">
                  <Image
                    src="/images/event4.jpg"
                    alt="Fitness Event"
                    width={2000}
                    height={8000}
                    className="h-72 w-auto"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>January 8, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Wellness & Fitness Expo
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover the latest in health, wellness, and fitness innovations
                </p>
                <Link
                  href="/events/wellness-expo"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-72  flex items-center justify-center">
                  <Image
                    src="/images/event2.jpeg"
                    alt="Fitness Event"
                    width={2000}
                    height={8000}
                    className="h-72 w-auto"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>February 20, 2026</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Caribbean Fitness Challenge
                </h3>
                <p className="text-gray-600 mb-4">
                  Test your strength and endurance in this ultimate fitness competition
                </p>
                <Link
                  href="/events/fitness-challenge"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Find Everything Section */}
      <section className="h-screen flex flex-col bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-12 text-center">
            Find everything you're looking for
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-4">
          {[
            { number: '01', title: 'FITNESS CLASSES', image: '/images/fitness-classes.jpg' },
            { number: '02', title: 'NUTRITIONAL EATS', image: '/images/nutritional-eats.jpg' },
            { number: '03', title: 'YOGA CLASSES', image: '/images/yoga-classes.jpg' },
            { number: '04', title: 'FITNESS APPAREL', image: '/images/fitness-apparel.jpg' }
          ].map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden group cursor-pointer"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                <div className="text-left">
                  <h3
                    className="text-6xl md:text-7xl font-bold mb-4"
                    style={{ color: '#f7d656' }}
                  >
                    {item.number}
                  </h3>
                  <h4 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Trainers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Trainers
            </h2>
            <p className="text-xl text-gray-600">
              Work with certified professionals to reach your fitness goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Darius Johnson', specialty: 'Strength Training & Bodybuilding', image: 'trainer1.jpeg' },
              { name: 'Sarah Williams', specialty: 'Yoga & Flexibility Training', image: 'trainer2.jpeg' },
              {  name: 'Renaldo Rahming', specialty: 'CrossFit & HIIT Workouts',image: 'trainer3.jpeg' },
              { name: 'James Rodriguez', specialty: 'Nutrition and Weight Management',image: 'trainer4.jpeg' }
            ].map((trainer, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-72 flex items-center justify-center overflow-hidden">
                  <Image
                    src={`/images/${trainer.image}`}
                    alt={trainer.name}
                    width={2000}
                    height={8000}
                    className="h-72 w-auto object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Certified Personal Trainer</p>
                  <p className="text-gray-600 text-sm mb-4">
                    {trainer.specialty}
                  </p>
                  <Link
                    href={`/trainers/trainer-${i + 1}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/trainers"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Trainers
            </Link>
          </div>
        </div>
      </section>

      {/* From Our Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              From Our Blog
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Left Column - Featured Blog Post */}
            <div className="flex flex-col">
              <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                  src="/images/blog-featured.jpg"
                  alt="Getting started in fitness"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="text-3xl font-bold text-black mb-3">
                  Getting started in fitness, the Bahafit way
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>By Dorisser Johnson</span>
                  <span>•</span>
                  <span>November 15, 2025</span>
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed flex-1">
                  Starting your fitness journey can feel overwhelming, but it doesn't have to be.
                  Discover how Bahafit makes it easy to find the right gym, trainer, and community
                  to support your goals in the Bahamas. From beginner-friendly classes to nutrition
                  guidance, we've got everything you need to succeed.
                </p>
                <Link
                  href="/blog/getting-started-fitness-bahafit-way"
                  className="inline-block bg-[#0dd5b5] text-white hover:bg-[#0bc5a5] px-6 py-3 rounded-lg font-semibold transition-colors self-start"
                >
                  Read More →
                </Link>
              </div>
            </div>

            {/* Right Column - Recent Blog Posts */}
            <div className="flex flex-col justify-between">
              {[
                {
                  title: 'Top 5 Gyms in Nassau for Strength Training',
                  author: 'Michael Brown',
                  date: 'November 10, 2025',
                  slug: 'top-5-gyms-nassau-strength-training'
                },
                {
                  title: 'Healthy Eating Guide: Best Meal Prep Services',
                  author: 'Jessica Williams',
                  date: 'November 5, 2025',
                  slug: 'healthy-eating-guide-meal-prep-services'
                },
                {
                  title: 'How to Stay Consistent with Your Fitness Goals',
                  author: 'David Thompson',
                  date: 'October 28, 2025',
                  slug: 'stay-consistent-fitness-goals'
                },
                {
                  title: 'Best Running Routes in the Bahamas',
                  author: 'Marcus Thompson',
                  date: 'October 20, 2025',
                  slug: 'best-running-routes-bahamas'
                }
              ].map((post, i) => (
                <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <h4 className="text-xl font-bold text-black mb-2 hover:text-[#0dd5b5] transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#0dd5b5] hover:text-[#0bc5a5] font-semibold text-sm transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gyms and Studios Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gyms and Studios
            </h2>
            <p className="text-xl text-gray-600">
              Discover the best fitness facilities in the Bahamas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Macfit West', image: 'macfit-west.jpeg' },
              { name: 'Club One', image: 'clubone.jpeg' },
              { name: 'Macfit East', image: 'macfit-east.jpeg' },
              { name: 'Empire', image: 'empire.jpeg' }
            ].map((gym, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-72 flex items-center justify-center overflow-hidden">
                  <Image
                    src={`/images/${gym.image}`}
                    alt={gym.name}
                    width={2000}
                    height={8000}
                    className="h-72 w-auto object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {gym.name}
                  </h3>
                  <Link
                    href={`/gyms/gym-${i + 1}`}
                    className="text-[#0dd5b5] hover:text-[#0bc5a5] font-semibold text-sm transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/gyms"
              className="inline-block bg-[#0dd5b5] hover:bg-[#0bc5a5] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Gyms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-32 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/cta-background.jpg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Tagline */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Are you ready to become part of a true{' '}
                <span style={{ color: '#f7d656' }}>fitness community</span>?
              </h2>
              <p className="text-xl text-gray-200">
                Join Bahafit today and connect with trainers, gyms, events, and fellow fitness enthusiasts across the Bahamas.
              </p>
            </div>

            {/* Right Column - Registration Form */}
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-black mb-6">Get Started Today</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0dd5b5] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0dd5b5] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0dd5b5] focus:border-transparent outline-none transition-all"
                    placeholder="Create a password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0dd5b5] hover:bg-[#0bc5a5] text-white px-6 py-4 rounded-lg font-semibold transition-colors text-lg"
                >
                  Create Account
                </button>
                <p className="text-sm text-gray-600 text-center">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-[#0dd5b5] hover:text-[#0bc5a5] font-semibold">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
