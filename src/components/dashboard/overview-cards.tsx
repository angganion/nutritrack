import { Users, AlertTriangle, CheckCircle, Activity, TrendingUp, TrendingDown } from 'lucide-react';

async function getDashboardStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/dashboard/stats?period=30`, {
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    
    const data = await response.json();
    
    return [
      {
        name: 'Total Anak',
        value: data.overview.totalChildren.value.toString(),
        icon: Users,
        change: `${data.overview.totalChildren.change}%`,
        changeType: data.overview.totalChildren.change.startsWith('-') ? 'negative' : 'positive',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        iconColor: 'text-white',
        borderColor: 'border-blue-100',
        bgGradient: 'from-blue-50/50 to-blue-100/50',
        description: 'yang dipantau',
      },
      {
        name: 'Normal',
        value: data.overview.nonStuntingCases.value.toString(),
        icon: CheckCircle,
        change: `${data.overview.nonStuntingCases.change}%`,
        changeType: data.overview.nonStuntingCases.change.startsWith('-') ? 'negative' : 'positive',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        iconColor: 'text-white',
        borderColor: 'border-emerald-100',
        bgGradient: 'from-emerald-50/50 to-emerald-100/50',
        description: 'pertumbuhan normal',
      },
      {
        name: 'Stunting',
        value: data.overview.stuntingCases.value.toString(),
        icon: AlertTriangle,
        change: `${data.overview.stuntingCases.change}%`,
        changeType: data.overview.stuntingCases.change.startsWith('-') ? 'positive' : 'negative',
        iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
        iconColor: 'text-white',
        borderColor: 'border-rose-100',
        bgGradient: 'from-rose-50/50 to-rose-100/50',
        description: 'perlu perhatian',
      },
      {
        name: 'Hari Ini',
        value: data.overview.todayData.value.toString(),
        icon: Activity,
        change: `${data.overview.todayData.change}%`,
        changeType: data.overview.todayData.change.startsWith('-') ? 'negative' : 'positive',
        iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        iconColor: 'text-white',
        borderColor: 'border-purple-100',
        bgGradient: 'from-purple-50/50 to-purple-100/50',
        description: 'data masuk',
      },
    ];
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Fallback to empty stats
    return [];
  }
}

const stats = await getDashboardStats();

export function OverviewCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className={`group relative rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} p-5 hover:shadow-xl hover:shadow-${stat.borderColor?.split('-')[1]}-200/30 transition-all duration-300 hover:-translate-y-1`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} shadow-lg shadow-${stat.borderColor?.split('-')[1]}-500/30 group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon
                className={`h-5 w-5 ${stat.iconColor}`}
              />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              {stat.changeType === 'positive' ? (
                <TrendingUp className="h-3 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-rose-600" />
              )}
              <span className={`text-xs font-semibold ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">
              {stat.name}
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}