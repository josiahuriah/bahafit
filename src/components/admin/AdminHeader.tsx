'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'

interface AdminHeaderProps {
  user: {
    name: string
    email: string
    image?: string
    role: string
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full bg-gray-50"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
