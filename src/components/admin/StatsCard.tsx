interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number | string
    label: string
  }
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {value}
          </dd>
          {trend && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{trend.value}</span>{' '}
              {trend.label}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
