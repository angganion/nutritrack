import Link from 'next/link';
import { LayoutDashboard, LineChart, Table, FileSpreadsheet, Settings, Map, Activity, Users } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview utama' },
  { name: 'Statistik', href: '/dashboard/statistics', icon: LineChart, description: 'Analisis data' },
  { name: 'Data Anak', href: '/dashboard/children', icon: Users, description: 'Kelola data anak' },
  { name: 'Persebaran', href: '/dashboard/distribution', icon: Map, description: 'Peta persebaran' },
  { name: 'Laporan', href: '/dashboard/reports', icon: FileSpreadsheet, description: 'Generate laporan' },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings, description: 'Konfigurasi sistem' },
];

export function Sidebar() {
  return (
    <div className="hidden w-64 flex-shrink-0 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 md:flex">
      <div className="flex w-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <img src="/garuda.png" alt="Logo" className="h-5 w-auto brightness-0 invert" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-tight">PANTAU+</div>
              <div className="text-[10px] text-slate-500 font-medium">Sistem Pemantauan</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200"
            >
              <item.icon className="h-[18px] w-[18px] text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="px-3 pb-3">
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-3.5 border border-slate-200/60">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-700">Online</span>
              </div>
              <Activity className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sistem berjalan normal
            </p>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center ring-2 ring-slate-100">
                <span className="text-xs font-semibold text-white">AD</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
            <Settings className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}