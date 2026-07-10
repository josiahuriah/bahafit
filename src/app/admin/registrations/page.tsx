'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatDateTime } from '@/lib/utils'

interface Registration {
  _id: string
  eventId: string
  eventTitle?: string
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

interface Stats {
  total: number
  byStatus: Record<string, number>
  byPayment: Record<string, number>
  revenueByCurrency: Record<string, { total: number; count: number }>
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  checked_in: 'bg-blue-100 text-blue-800',
}

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800',
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [actionBusy, setActionBusy] = useState<string | null>(null)

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter)

      const response = await fetch(`/api/admin/registrations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, paymentFilter])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const runAction = async (id: string, action: 'check_in' | 'cancel' | 'mark_refunded') => {
    if (action === 'cancel' && !window.confirm('Cancel this registration?')) return
    setActionBusy(id)
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) await fetchRegistrations()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionBusy(null)
    }
  }

  const revenueEntries = stats ? Object.entries(stats.revenueByCurrency || {}) : []

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

      {/* Summary cards */}
      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Registrations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.byPayment.paid || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.byPayment.pending || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-500">Revenue (paid)</p>
            {revenueEntries.length === 0 ? (
              <p className="text-2xl font-bold text-gray-900">—</p>
            ) : (
              revenueEntries.map(([currency, r]) => (
                <p key={currency} className="text-2xl font-bold text-gray-900">
                  {currency} {r.total.toFixed(2)}
                </p>
              ))
            )}
          </div>
        </div>
      )}

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
              ) : registrations.length === 0 ? (
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
                    No registrations match the current filters.
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Attendee</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ticket</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((reg) => (
                      <tr key={reg._id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm font-medium text-gray-900">{reg.userName}</p>
                          <p className="text-xs text-gray-500">{reg.userEmail}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">
                          {reg.eventTitle || reg.eventId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {reg.ticketType || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {reg.price === 0 ? 'Free' : `${reg.currency} ${reg.price.toFixed(2)}`}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[reg.status] || 'bg-gray-100 text-gray-600'}`}>
                            {reg.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${paymentColors[reg.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                            {reg.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {formatDateTime(reg.registeredAt)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                          {reg.status === 'confirmed' && (
                            <button
                              onClick={() => runAction(reg._id, 'check_in')}
                              disabled={actionBusy === reg._id}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              Check in
                            </button>
                          )}
                          {reg.paymentStatus === 'paid' && (
                            <button
                              onClick={() => runAction(reg._id, 'mark_refunded')}
                              disabled={actionBusy === reg._id}
                              className="text-xs font-medium text-amber-600 hover:text-amber-800 disabled:opacity-50"
                            >
                              Mark refunded
                            </button>
                          )}
                          {reg.status !== 'cancelled' && (
                            <button
                              onClick={() => runAction(reg._id, 'cancel')}
                              disabled={actionBusy === reg._id}
                              className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
