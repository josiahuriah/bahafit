'use client'

import { useEffect, useState } from 'react'
import { formatDateTime, formatCurrency } from '@/lib/utils'

interface Registration {
  _id: string
  eventId: string
  userName: string
  userEmail: string
  ticketType?: string
  price: number
  currency: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  registeredAt: string
  checkedInAt?: string
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  checked_in: 'bg-blue-100 text-blue-800',
}

const paymentColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800',
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')

  useEffect(() => {
    fetchRegistrations()
  }, [statusFilter, paymentFilter])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter)

      // This endpoint would need to be created
      // const response = await fetch(`/api/admin/registrations?${params}`)
      // For now, we'll just show empty state
      setRegistrations([])
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all event registrations including user details, payment status, and check-in information.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Registration Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="payment" className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            id="payment"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {loading ? (
                <div className="text-center py-12 bg-white">
                  <p className="text-gray-500">Loading registrations...</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-white">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No registrations</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Event registrations will appear here once users start registering for events.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
