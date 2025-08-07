import { Users, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

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
      gradient: 'from-blue-700/20 to-blue-800/20',
      bgGradient: 'from-white to-blue-50/50',
      iconColor: 'text-blue-700',
      borderColor: 'border-blue-200/60',
      iconBg: 'bg-blue-100/80',
    },
    {
      name: 'Tidak Stunting',
      value: stats.nonStuntingCases.toString(),
      icon: CheckCircle,
      change: '+2.1%',
      changeType: 'positive',
      gradient: 'from-green-700/20 to-green-800/20',
      bgGradient: 'from-white to-green-50/50',
      iconColor: 'text-green-700',
      borderColor: 'border-green-200/60',
      iconBg: 'bg-green-100/80',
    },
    {
      name: 'Stunting',
      value: stats.stuntingCases.toString(),
      icon: AlertTriangle,
      change: '-1.39%',
      changeType: 'negative',
      gradient: 'from-red-700/20 to-red-800/20',
      bgGradient: 'from-white to-red-50/50',
      iconColor: 'text-red-700',
      borderColor: 'border-red-200/60',
      iconBg: 'bg-red-100/80',
    },
    {
      name: 'Data Hari Ini',
      value: stats.todayData.toString(),
      icon: Activity,
      change: '+2.23%',
      changeType: 'positive',
      gradient: 'from-yellow-700/20 to-yellow-800/20',
      bgGradient: 'from-white to-yellow-50/50',
      iconColor: 'text-yellow-700',
      borderColor: 'border-yellow-200/60',
      iconBg: 'bg-yellow-100/80',
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
          className={`group relative overflow-hidden rounded-lg border bg-gradient-to-br ${stat.bgGradient} ${stat.borderColor} p-5 shadow transition-all duration-200 hover:shadow-md`}
        >
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative flex items-center">
            <div className="flex-shrink-0">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-110`}>
                <stat.icon
                  className={`h-6 w-6 ${stat.iconColor} transition-all duration-300`}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-950 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          
          {/* Subtle accent line */}
          <div className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r ${stat.gradient.replace('/20', '')} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
        </div>
      ))}
    </div>
  );
}