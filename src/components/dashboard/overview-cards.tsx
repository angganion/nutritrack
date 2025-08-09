import { Users, AlertTriangle, CheckCircle, Activity, TrendingUp, TrendingDown } from 'lucide-react';

import { getChildStats } from '@/services/child.service';

async function getStats() {
  const stats = await getChildStats();
  return [
    {
      name: 'Total Anak',
      value: stats.totalChildren.toString(),
      icon: Users,
      change: '+4.75%',
      changeType: 'positive',
      gradient: 'from-blue-600 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      description: 'Anak yang dipantau',
    },
    {
      name: 'Tidak Stunting',
      value: stats.nonStuntingCases.toString(),
      icon: CheckCircle,
      change: '+2.1%',
      changeType: 'positive',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      description: 'Anak dengan pertumbuhan normal',
    },
    {
      name: 'Stunting',
      value: stats.stuntingCases.toString(),
      icon: AlertTriangle,
      change: '-1.39%',
      changeType: 'negative',
      gradient: 'from-red-600 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      description: 'Anak yang memerlukan perhatian',
    },
    {
      name: 'Data Hari Ini',
      value: stats.todayData.toString(),
      icon: Activity,
      change: '+2.23%',
      changeType: 'positive',
      gradient: 'from-purple-600 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      description: 'Data yang diinput hari ini',
    },
  ];
}

const stats = await getStats();

export function OverviewCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.iconBg}`}>
              <stat.icon
                className={`h-6 w-6 ${stat.iconColor}`}
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center space-x-1">
              {stat.changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-600">
              {stat.name}
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
            <p className="text-xs text-gray-600">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}