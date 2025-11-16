import { getAllUsers } from '@/lib/db/models/user'
import { getRegistrationStats } from '@/lib/db/models/registration'
import StatsCard from '@/components/admin/StatsCard'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [users, registrationStats] = await Promise.all([
      getAllUsers(),
      getRegistrationStats(),
    ])

    const usersByRole = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const activeUsers = users.filter((u) => u.isActive).length

    return {
      totalUsers: users.length,
      activeUsers,
      usersByRole,
      totalRegistrations: registrationStats.total,
      registrationsByStatus: registrationStats.byStatus,
      registrationsByPayment: registrationStats.byPayment,
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      usersByRole: {},
      totalRegistrations: 0,
      registrationsByStatus: {},
      registrationsByPayment: {},
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to the Bahafit admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          trend={{
            value: stats.activeUsers,
            label: 'active',
          }}
        />

        <StatsCard
          title="Admins"
          value={stats.usersByRole.admin || 0}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />

        <StatsCard
          title="Business Owners"
          value={stats.usersByRole.business_owner || 0}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatsCard
          title="Event Organizers"
          value={stats.usersByRole.event_organizer || 0}
          icon={
            <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatsCard
          title="Total Registrations"
          value={stats.totalRegistrations}
          icon={
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />

        <StatsCard
          title="Confirmed"
          value={stats.registrationsByStatus.confirmed || 0}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatsCard
          title="Pending"
          value={stats.registrationsByStatus.pending || 0}
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatsCard
          title="Checked In"
          value={stats.registrationsByStatus.checked_in || 0}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/users"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage all platform users</p>
          </a>

          <a
            href="/admin/events"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Events</h3>
            <p className="text-sm text-gray-600">Approve and manage fitness events</p>
          </a>

          <a
            href="/admin/registrations"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Registrations</h3>
            <p className="text-sm text-gray-600">Track all event registrations</p>
          </a>

          <a
            href="/admin/listings"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Listings</h3>
            <p className="text-sm text-gray-600">Moderate gym and business listings</p>
          </a>

          <a
            href="/admin/analytics"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600">Check platform statistics and insights</p>
          </a>

          <a
            href="/admin/settings"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-sm text-gray-600">Configure platform settings</p>
          </a>
        </div>
      </div>
    </div>
  )
}
